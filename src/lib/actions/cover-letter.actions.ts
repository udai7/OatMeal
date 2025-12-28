"use server";

import { fetchResume } from "./resume.actions";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b";

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
      "AI_ERROR:Unable to generate content. Please try again later."
    );
  }
}

interface CoverLetterParams {
  resumeData: any;
  jobDescription: string;
  additionalDetails?: string;
  companyName?: string;
  jobTitle?: string;
  userId: string;
}

export async function generateCoverLetter({
  resumeData,
  jobDescription,
  additionalDetails,
  companyName,
  jobTitle,
  userId,
}: CoverLetterParams) {
  try {
    // If we have a resumeId, fetch full resume data
    let fullResumeData = resumeData;
    if (resumeData.resumeId) {
      const fetchedResume = await fetchResume(resumeData.resumeId);
      if (fetchedResume) {
        fullResumeData = JSON.parse(fetchedResume as any);
      }
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

Projects:
${
  resume.projects
    ?.map(
      (proj: any) => `
- ${proj.name}: ${proj.description || ""}
  Technologies: ${proj.technologies || ""}
`
    )
    .join("") || "No projects listed"
}
      `;
    }

    // Create the prompt for Gemini
    const prompt = `
You are an expert cover letter writer with extensive experience in helping job seekers land their dream jobs. Write a professional, compelling, and personalized cover letter based on the following information:

CANDIDATE'S RESUME:
${resumeContent}

JOB DESCRIPTION:
${jobDescription}

${companyName ? `COMPANY NAME: ${companyName}` : ""}
${jobTitle ? `JOB TITLE: ${jobTitle}` : ""}

${
  additionalDetails
    ? `ADDITIONAL DETAILS FROM CANDIDATE:\n${additionalDetails}`
    : ""
}

INSTRUCTIONS:
1. Write a professional cover letter that highlights the candidate's most relevant experience and skills for this specific job
2. Match the tone to be professional yet personable
3. Include specific examples from the candidate's experience that align with the job requirements
4. Keep it concise (3-4 paragraphs) but impactful
5. Start with a compelling opening that shows genuine interest in the role
6. End with a strong call to action
7. Do NOT include any placeholder text like [Your Name] or [Date] - use the actual information from the resume
8. Format the letter properly with appropriate spacing between paragraphs
9. Do NOT include any JSON formatting or markdown - just the plain text cover letter
10. Use the candidate's actual name from the resume for the signature

Write the cover letter now:
`;

    // Get the cover letter from OpenRouter
    const coverLetter = await askOpenRouter(prompt);

    return {
      success: true,
      coverLetter: coverLetter.trim(),
    };
  } catch (error: any) {
    console.error(`Cover letter generation error: ${error.message}`);
    throw new Error(`Failed to generate cover letter: ${error.message}`);
  }
}
