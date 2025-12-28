import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, score, segment } = body;

    // Validate input
    if (!email || !firstName || !lastName || score === undefined) {
      return NextResponse.json(
        { error: "Email, firstName, lastName, and score are required" },
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

    // Validate RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    // Get the "from" email from environment or use a default
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Send email with blank/minimal content (to be filled in later)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "Your Quiz Results",
      html: `
        <div>
          <h1>Quiz Results</h1>
          <p>Hello ${firstName} ${lastName},</p>
          <p>Your quiz score: ${score}</p>
          ${segment ? `<p>Segment: ${segment}</p>` : ""}
          <p>Email content to be added here.</p>
        </div>
      `,
      text: `
        Quiz Results
        
        Hello ${firstName} ${lastName},
        
        Your quiz score: ${score}
        ${segment ? `Segment: ${segment}` : ""}
        
        Email content to be added here.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully",
        emailId: data?.id,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}



