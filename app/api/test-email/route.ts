import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  try {
    // Check if RESEND_API_KEY is set
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "RESEND_API_KEY is not set in environment variables",
          message: "Please add RESEND_API_KEY to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Get test email from query params or use default
    const searchParams = request.nextUrl.searchParams;
    const testEmail = searchParams.get("email") || "test@example.com";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(testEmail)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
          message: `"${testEmail}" is not a valid email address`,
        },
        { status: 400 }
      );
    }

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get the "from" email from environment or use a default
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Send test email
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: testEmail,
      subject: "Test Email - Quiz Results API",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1c78fe;">Test Email</h1>
          <p>Hello,</p>
          <p>This is a test email from your Quiz Results API.</p>
          <p>If you received this email, your email service is configured correctly!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">
            <strong>Test Details:</strong><br/>
            From: ${fromEmail}<br/>
            To: ${testEmail}<br/>
            API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}... (configured)<br/>
            Timestamp: ${new Date().toISOString()}
          </p>
        </div>
      `,
      text: `
        Test Email
        
        Hello,
        
        This is a test email from your Quiz Results API.
        
        If you received this email, your email service is configured correctly!
        
        Test Details:
        From: ${fromEmail}
        To: ${testEmail}
        API Key: ${process.env.RESEND_API_KEY.substring(0, 10)}... (configured)
        Timestamp: ${new Date().toISOString()}
      `,
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
          details: error.message,
          message: "Check your RESEND_API_KEY and domain verification in Resend dashboard",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Test email sent successfully!",
        emailId: data?.id,
        details: {
          from: fromEmail,
          to: testEmail,
          subject: "Test Email - Quiz Results API",
          sentAt: new Date().toISOString(),
        },
        nextSteps: [
          "Check your inbox (and spam folder) for the test email",
          "If you don't receive it, verify your domain in Resend dashboard",
          "Make sure RESEND_FROM_EMAIL matches your verified domain",
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error testing email:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unexpected error",
        details: error.message || "Unknown error occurred",
        message: "Check your server logs for more details",
      },
      { status: 500 }
    );
  }
}



