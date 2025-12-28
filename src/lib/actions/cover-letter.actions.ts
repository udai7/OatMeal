"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchResume } from "./resume.actions";
import { checkRateLimit, incrementRateLimit } from "./rateLimit.actions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 0.8,
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 4096,
};

async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
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
    // Check rate limit first
    const rateLimitCheck = await checkRateLimit(userId, "cover_letter");
    if (!rateLimitCheck.allowed) {
      throw new Error(
        `RATE_LIMIT_EXCEEDED:You have exhausted your free daily quota for cover letter generation. Resets at ${rateLimitCheck.resetAt.toLocaleString()}`
      );
    }

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

    // Get the cover letter from Gemini
    const coverLetter = await askGemini(prompt);

    // Increment rate limit after successful generation
    await incrementRateLimit(userId, "cover_letter");

    return {
      success: true,
      coverLetter: coverLetter.trim(),
    };
  } catch (error: any) {
    console.error(`Cover letter generation error: ${error.message}`);

    // Check if it's our custom rate limit error
    if (error.message?.startsWith("RATE_LIMIT_EXCEEDED:")) {
      throw error; // Pass through rate limit errors as-is
    }

    // Check if it's a rate limit error from API
    if (
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("Too Many Requests")
    ) {
      throw new Error(
        "API rate limit exceeded. Please wait a moment and try again."
      );
    }

    throw new Error(`Failed to generate cover letter: ${error.message}`);
  }
}
