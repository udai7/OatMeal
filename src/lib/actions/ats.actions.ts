"use server";

import { fetchResume } from "./resume.actions";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "meta-llama/llama-3.3-70b-instruct:free";

async function askOpenRouter(prompt: string): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not defined");
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "OatMeal",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenRouter generation error:", error);
    throw new Error(
      `AI_ERROR: ${error.message || "Unable to generate content"}`
    );
  }
}

interface ATSAnalysisParams {
  resumeData: any;
  jobDescription?: string;
  userId: string;
}

export async function analyzeATS({
  resumeData,
  jobDescription,
  userId,
}: ATSAnalysisParams) {
  try {
    // If we have a resumeId, fetch full resume data
    let fullResumeData = resumeData;
    if (resumeData.resumeId) {
      const fetchedResume = await fetchResume(resumeData.resumeId);
      if (fetchedResume) {
        fullResumeData = JSON.parse(fetchedResume as any);
      }
    }

    // Extract job details from LinkedIn URL if provided
    let fullJobDescription = jobDescription || "";

    // Validation is done on the client side, but we keep a fallback check here
    if (!fullJobDescription || fullJobDescription.trim().length < 50) {
      throw new Error(
        "Please provide a complete job description (at least 50 characters) for accurate analysis."
      );
    }

    // Format the resume data into a string
    let resumeContent = "";
    if (fullResumeData.content) {
      // Direct text content
      resumeContent = fullResumeData.content;
    } else {
      // Structured resume data from the system
      const resume = fullResumeData;

      resumeContent = `
Name: ${resume.firstName || ""} ${resume.lastName || ""}
Job Title: ${resume.jobTitle || ""}
Email: ${resume.email || ""}
Phone: ${resume.phone || ""}
Address: ${resume.address || ""}
Summary: ${resume.summary || ""}

Experience:
${
  resume.experience
    ?.map(
      (exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${
        exp.endDate || "Present"
      })
  ${exp.description || ""}
`
    )
    .join("") || "No experience listed"
}

Education:
${
  resume.education
    ?.map(
      (edu: any) => `
- ${edu.degree} at ${edu.institution} (${edu.startDate} - ${
        edu.endDate || "Present"
      })
  ${edu.description || ""}
`
    )
    .join("") || "No education listed"
}

Skills:
${
  resume.skills?.map((skill: any) => `- ${skill.name}`).join("\n") ||
  "No skills listed"
}
      `;
    }

    // Create the prompt for Gemini
    const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer. I'm going to provide you with a resume and a job description. Your task is to:

1. Analyze how well the resume matches the job requirements
2. Identify which key skills and requirements from the job description are present in the resume
3. Identify which important skills or requirements are missing from the resume
4. Calculate a match percentage (0-100%)
5. Provide specific suggestions for improving the resume to better match this job

Resume:
${resumeContent}

Job Description:
${fullJobDescription}

Please format your response as a JSON object with the following structure:
{
  "match_percentage": number (0-100),
  "overall_assessment": "brief 1-2 sentence assessment",
  "matched_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "improvement_suggestions": ["suggestion1", "suggestion2", ...],
  "keyword_analysis": {
    "found_keywords": ["keyword1", "keyword2", ...],
    "missing_keywords": ["keyword1", "keyword2", ...]
  }
}

Keep your response STRICTLY in valid JSON format with no additional text.
`;

    // Get the analysis from OpenRouter
    const analysisResult = await askOpenRouter(prompt);

    // Clean up result if it contains markdown code blocks
    const cleanResult = analysisResult
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Parse and return the JSON result
    return JSON.parse(cleanResult);
  } catch (error: any) {
    console.error(`ATS analysis error: ${error.message}`);

    // Check if it's a validation error (job description missing)
    if (
      error.message?.includes("LinkedIn") ||
      error.message?.includes("job description")
    ) {
      throw error; // Pass through validation errors as-is
    }

    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
}
