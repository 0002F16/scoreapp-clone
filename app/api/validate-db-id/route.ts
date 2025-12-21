import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, databaseId } = body;

    // If URL is provided, extract the database ID
    if (url) {
      // Extract database ID from Notion URL
      // Can be with or without hyphens
      // Format 1: https://www.notion.so/workspace/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?v=...
      // Format 2: https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...
      const urlMatchWithHyphens = url.match(/\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
      const urlMatchWithoutHyphens = url.match(/\/([a-f0-9]{32})(?:\?|$)/i);
      
      let extractedId = null;
      if (urlMatchWithHyphens && urlMatchWithHyphens[1]) {
        extractedId = urlMatchWithHyphens[1];
      } else if (urlMatchWithoutHyphens && urlMatchWithoutHyphens[1]) {
        extractedId = urlMatchWithoutHyphens[1];
      }
      
      if (extractedId) {
        return NextResponse.json({
          success: true,
          extractedDatabaseId: extractedId,
          format: extractedId.includes('-') ? "with-hyphens" : "without-hyphens",
          length: extractedId.length,
          message: "Database ID extracted successfully!",
          nextStep: `Add this to your .env.local: NOTION_DATABASE_ID=${extractedId}`
        });
      } else {
        return NextResponse.json({
          success: false,
          error: "Could not find a valid database ID in the URL",
          message: "Make sure you're using a database URL, not a page URL",
          note: "Database IDs are 32 hex characters (with or without hyphens)"
        }, { status: 400 });
      }
    }

    // If database ID is provided, validate it
    if (databaseId) {
      const dbId = databaseId.trim();
      const dbIdWithHyphens = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
      const dbIdWithoutHyphens = /^[a-f0-9]{32}$/i;
      
      if (dbIdWithHyphens.test(dbId) || dbIdWithoutHyphens.test(dbId)) {
        return NextResponse.json({
          success: true,
          databaseId: dbId,
          format: dbId.includes('-') ? "with-hyphens" : "without-hyphens",
          length: dbId.length,
          message: "Database ID format is correct! Both formats (with or without hyphens) are accepted."
        });
      } else {
        return NextResponse.json({
          success: false,
          error: "Invalid Database ID format",
          received: dbId,
          receivedLength: dbId.length,
          expectedFormats: [
            "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars with hyphens)",
            "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 chars without hyphens)"
          ],
          message: "Database ID should be 32 hex characters (with or without hyphens)"
        }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: false,
      error: "Please provide either 'url' or 'databaseId' in the request body"
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || "An error occurred"
    }, { status: 500 });
  }
}

// Also support GET with query parameters
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const databaseId = searchParams.get('databaseId');

  if (url) {
    const response = await POST(
      new NextRequest(request.url, {
        method: 'POST',
        body: JSON.stringify({ url }),
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return response;
  }

  if (databaseId) {
    const response = await POST(
      new NextRequest(request.url, {
        method: 'POST',
        body: JSON.stringify({ databaseId }),
        headers: { 'Content-Type': 'application/json' }
      })
    );
    return response;
  }

  return NextResponse.json({
    success: false,
    error: "Please provide either 'url' or 'databaseId' as a query parameter",
    examples: {
      extractFromUrl: "/api/validate-db-id?url=https://www.notion.so/workspace/your-db-id-here?v=...",
      validateId: "/api/validate-db-id?databaseId=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }, { status: 400 });
}
