import { NextRequest, NextResponse } from "next/server";
import { queryDatabase, updatePage } from "@/lib/notion";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, score } = body;

    // Validate input
    if (!email || score === undefined) {
      return NextResponse.json(
        { error: "Email and score are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate score is a number
    const scoreNumber = Number(score);
    if (isNaN(scoreNumber)) {
      return NextResponse.json(
        { error: "Score must be a valid number" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find the submission by email
    const existingSubmissions = await queryDatabase({
      property: "Email",
      rich_text: {
        equals: normalizedEmail,
      },
    });

    if (existingSubmissions.length === 0) {
      return NextResponse.json(
        { error: "Submission not found for this email" },
        { status: 404 }
      );
    }

    // Update the submission with the score
    const pageId = existingSubmissions[0].id;
    await updatePage(pageId, {
      Score: {
        number: scoreNumber,
      },
      "Quiz Completed At": {
        date: {
          start: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Score saved successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error saving quiz score:", error);
    
    // Handle Notion API errors
    if (error.code === "object_not_found") {
      return NextResponse.json(
        { error: "Notion database or page not found. Please check your configuration." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to save quiz score. Please try again later." },
      { status: 500 }
    );
  }
}






