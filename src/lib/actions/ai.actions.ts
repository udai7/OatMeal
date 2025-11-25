"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateCoverLetter(resumeContent: string, jobDescription?: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
      You are a professional career coach. Write a compelling cover letter based on the following resume content:
      
      RESUME CONTENT:
      ${resumeContent}
      
      ${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}` : ""}
      
      The cover letter should be professional, engaging, and highlight the candidate's key strengths relevant to the role (if provided) or generally based on their skills.
      Format the output as a standard business letter.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, data: text };
    } catch (error) {
        console.error("Error generating cover letter:", error);
        return { success: false, error: "Failed to generate cover letter" };
    }
}
