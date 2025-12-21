import { NextRequest, NextResponse } from "next/server";
import { queryDatabase, createPage } from "@/lib/notion";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email } = body;

    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "All fields are required" },
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

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingSubmissions = await queryDatabase({
      property: "Email",
      rich_text: {
        equals: normalizedEmail,
      },
    });

    if (existingSubmissions.length > 0) {
      return NextResponse.json(
        { error: "This email has already been submitted" },
        { status: 409 }
      );
    }

    // Create the submission in Notion
    const result = await createPage({
      "First Name": {
        title: [
          {
            text: {
              content: firstName.trim(),
            },
          },
        ],
      },
      "Last Name": {
        rich_text: [
          {
            text: {
              content: lastName.trim(),
            },
          },
        ],
      },
      Email: {
        rich_text: [
          {
            text: {
              content: normalizedEmail,
            },
          },
        ],
      },
      "Created At": {
        date: {
          start: new Date().toISOString(),
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Submission recorded successfully",
        id: result.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting form:", error);
    
    // Handle Notion API errors
    if (error.code === "object_not_found") {
      return NextResponse.json(
        { error: "Notion database not found. Please check your database ID." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to submit form. Please try again later." },
      { status: 500 }
    );
  }
}

