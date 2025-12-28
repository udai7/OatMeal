"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { checkRateLimit, incrementRateLimit } from "./rateLimit.actions";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 2048, // Reduced for faster responses
  responseMimeType: "application/json",
};

// Helper function to add timeout to promises
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage: string
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  return Promise.race([promise, timeout]);
}

// Helper function to check if error is a Google API quota error
function isGoogleQuotaError(error: any): boolean {
  const message = error?.message?.toLowerCase() || "";
  return (
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("resource has been exhausted")
  );
}

// Helper function to handle common errors
function handleAIError(error: any): never {
  // Re-throw app rate limit errors as-is
  if (error.message?.startsWith("RATE_LIMIT_EXCEEDED:")) {
    throw error;
  }
  // Convert Google API quota errors to user-friendly message
  if (isGoogleQuotaError(error)) {
    throw new Error(
      "RATE_LIMIT_EXCEEDED:AI service is temporarily unavailable due to high demand. Please try again later."
    );
  }
  // Convert timeout errors to user-friendly message (use different prefix)
  if (error.message?.includes("timed out")) {
    throw new Error(
      "AI_ERROR:AI service is slow. Please try again in a moment."
    );
  }
  // For other errors, use AI_ERROR prefix (not rate limit)
  console.error("AI generation error:", error);
  throw new Error(
    "AI_ERROR:Unable to generate content. Please try again later."
  );
}

async function askGemini(prompt: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  // Add 8 second timeout for AI generation (leaving 2s buffer for Vercel's 10s limit)
  const result = await withTimeout(
    chatSession.sendMessage(prompt),
    8000,
    "AI generation timed out. Please try again."
  );

  return result.response.text();
}

export async function generateSummary(jobTitle: string, userId: string) {
  try {
    // Check rate limit first
    const rateLimitCheck = await checkRateLimit(userId, "resume_ai");
    if (!rateLimitCheck.allowed) {
      throw new Error(
        `RATE_LIMIT_EXCEEDED:You have exhausted your free daily quota for AI resume features. Resets at ${rateLimitCheck.resetAt.toLocaleString()}`
      );
    }

    const prompt =
      jobTitle && jobTitle !== ""
        ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 3-4 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
        : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

    const result = await askGemini(prompt);

    // Increment rate limit after successful generation
    await incrementRateLimit(userId, "resume_ai");

    return JSON.parse(result);
  } catch (error: any) {
    handleAIError(error);
  }
}

export async function generateEducationDescription(
  educationInfo: string,
  userId: string
) {
  try {
    // Check rate limit
    const rateLimitCheck = await checkRateLimit(userId, "resume_ai");
    if (!rateLimitCheck.allowed) {
      throw new Error(
        `RATE_LIMIT_EXCEEDED:You have exhausted your free daily quota for AI resume features. Resets at ${rateLimitCheck.resetAt.toLocaleString()}`
      );
    }

    const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 3-4 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`;

    const result = await askGemini(prompt);

    // Increment rate limit after successful generation
    await incrementRateLimit(userId, "resume_ai");

    return JSON.parse(result);
  } catch (error: any) {
    handleAIError(error);
  }
}

export async function generateExperienceDescription(
  experienceInfo: string,
  userId: string
) {
  try {
    // Check rate limit
    const rateLimitCheck = await checkRateLimit(userId, "resume_ai");
    if (!rateLimitCheck.allowed) {
      throw new Error(
        `RATE_LIMIT_EXCEEDED:You have exhausted your free daily quota for AI resume features. Resets at ${rateLimitCheck.resetAt.toLocaleString()}`
      );
    }

    const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list: High Activity, Medium Activity, and Low Activity. Each summary should be 3-4 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in.`;

    const result = await askGemini(prompt);

    // Increment rate limit after successful generation
    await incrementRateLimit(userId, "resume_ai");

    return JSON.parse(result);
  } catch (error: any) {
    handleAIError(error);
  }
}
