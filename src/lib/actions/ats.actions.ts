"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchResume } from "./resume.actions";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.8,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

interface ATSAnalysisParams {
  resumeData: any;
  jobLink?: string;
  jobDescription?: string;
}

export async function analyzeATS({
  resumeData,
  jobLink,
  jobDescription,
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
    if (jobLink && !jobDescription) {
      // For this version, we'll ask the user to paste the job description
      // Future enhancement: Implement job scraping from LinkedIn
      fullJobDescription = "Job link provided but no description. Please paste the job description for better results.";
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
${resume.experience?.map((exp: any) => `
- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || "Present"})
  ${exp.description || ""}
`).join("") || "No experience listed"}

Education:
${resume.education?.map((edu: any) => `
- ${edu.degree} at ${edu.institution} (${edu.startDate} - ${edu.endDate || "Present"})
  ${edu.description || ""}
`).join("") || "No education listed"}

Skills:
${resume.skills?.map((skill: any) => `- ${skill.name}`).join("\n") || "No skills listed"}
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

    // Get the analysis from Gemini
    const analysisResult = await askGemini(prompt);
    
    // Parse and return the JSON result
    return JSON.parse(analysisResult);

  } catch (error: any) {
    console.error(`ATS analysis error: ${error.message}`);
    throw new Error(`Failed to analyze resume: ${error.message}`);
  }
} 