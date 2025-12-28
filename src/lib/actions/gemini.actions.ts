"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "google/gemma-3-27b-it:free";

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

export async function generateSummary(jobTitle: string, userId: string) {
  try {
    const prompt =
      jobTitle && jobTitle !== ""
        ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be 3-4 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level. Return ONLY valid JSON.`
        : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON objects, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in. Return ONLY valid JSON.`;

    const result = await askOpenRouter(prompt);

    // Clean up result if it contains markdown code blocks
    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResult);
  } catch (error: any) {
    console.error("Error generating summary:", error);
    throw error;
  }
}

export async function generateEducationDescription(
  educationInfo: string,
  userId: string
) {
  try {
    const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be 3-4 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results. Return ONLY valid JSON.`;

    const result = await askOpenRouter(prompt);
    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResult);
  } catch (error: any) {
    console.error("Error generating education description:", error);
    throw error;
  }
}

export async function generateExperienceDescription(
  experienceInfo: string,
  userId: string
) {
  try {
    const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list: High Activity, Medium Activity, and Low Activity. Each summary should be 3-4 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. You can include <b>, <i>, <u>, <s>, <blockquote>, <ul>, <ol>, and <li> to further enhance the descriptions. Use example work samples if needed, but do not insert placeholders for me to fill in. Return ONLY valid JSON.`;

    const result = await askOpenRouter(prompt);
    const cleanResult = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResult);
  } catch (error: any) {
    console.error("Error generating experience description:", error);
    throw error;
  }
}
