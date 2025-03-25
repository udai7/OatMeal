import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { githubUrl } = await req.json();

    if (!githubUrl || !githubUrl.includes('github.com')) {
      return NextResponse.json(
        { error: "Invalid GitHub URL" },
        { status: 400 }
      );
    }

    // Extract repo information
    const urlParts = githubUrl.split('/');
    const repoName = urlParts.pop() || "";
    const username = urlParts.pop() || "";

    // In a production environment, you would:
    // 1. Call the GitHub API to get repository data
    // 2. Pass that data to Gemini API for analysis
    // 3. Return the structured response with description and technologies

    // This is a mock implementation for demonstration
    const description = `A ${repoName} project developed by ${username} that demonstrates expertise in web development and software architecture. This project implements modern best practices for user interface design, data handling, and performance optimization.`;
    
    const technologies = "React, TypeScript, Next.js, Tailwind CSS, Node.js";

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      data: {
        description,
        technologies
      }
    });
  } catch (error) {
    console.error("Error generating project details:", error);
    return NextResponse.json(
      { error: "Failed to generate project details" },
      { status: 500 }
    );
  }
} 