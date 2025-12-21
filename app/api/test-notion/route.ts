import { NextResponse } from "next/server";
import { notion, NOTION_DATABASE_ID } from "@/lib/notion";

export async function GET() {
  // First, validate the database ID format
  const dbId = NOTION_DATABASE_ID.trim();
  
  // Notion database IDs can be in two formats:
  // 1. With hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars total)
  // 2. Without hyphens: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 chars, hex)
  const dbIdWithHyphens = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
  const dbIdWithoutHyphens = /^[a-f0-9]{32}$/i;
  
  if (!dbIdWithHyphens.test(dbId) && !dbIdWithoutHyphens.test(dbId)) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid Database ID format",
        errorCode: "invalid_format",
        receivedId: dbId.substring(0, 10) + "...", // Show first 10 chars for debugging
        receivedLength: dbId.length,
        expectedFormats: [
          "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 characters with hyphens)",
          "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 characters without hyphens)"
        ],
        troubleshooting: {
          howToGetId: [
            "1. Open your Notion database in a browser",
            "2. Look at the URL - it will look like:",
            "   https://www.notion.so/workspace/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?v=...",
            "   OR",
            "   https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=...",
            "3. Copy the part between the last '/' and the '?'",
            "4. It should be either:",
            "   - 32 hex characters (no hyphens), OR",
            "   - 36 characters with hyphens in the format above"
          ],
          commonMistakes: [
            "❌ Including the '?v=...' part",
            "❌ Including extra slashes or spaces",
            "❌ Using a page ID instead of database ID",
            "✅ Both formats are accepted: with or without hyphens"
          ],
          checkConnection: "Also ensure your integration is connected to the database (Database → ... → Connections)"
        },
      },
      { status: 400 }
    );
  }

  try {
    // Test 1: Check if we can retrieve the database
    const database = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID,
    });

    // Test 2: Try to query the database (limit to 1 result for speed)
    const queryResult = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      page_size: 1,
    });

    // Check if required properties exist
    const requiredProperties = [
      "First Name",
      "Last Name",
      "Email",
      "Created At",
    ];
    const optionalProperties = ["Score", "Quiz Completed At"];

    const existingProperties = Object.keys(database.properties);
    const missingRequired = requiredProperties.filter(
      (prop) => !existingProperties.includes(prop)
    );
    const existingOptional = optionalProperties.filter((prop) =>
      existingProperties.includes(prop)
    );

    return NextResponse.json(
      {
        success: true,
        message: "Notion connection successful!",
        database: {
          id: database.id,
          title: database.title[0]?.plain_text || "Untitled",
          url: database.url,
        },
        properties: {
          total: existingProperties.length,
          required: {
            found: requiredProperties.length - missingRequired.length,
            total: requiredProperties.length,
            missing: missingRequired,
          },
          optional: {
            found: existingOptional.length,
            total: optionalProperties.length,
            existing: existingOptional,
          },
          all: existingProperties,
        },
        queryTest: {
          success: true,
          resultCount: queryResult.results.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Notion connection test failed:", error);

    let errorMessage = "Unknown error";
    let errorCode = error.code || "UNKNOWN";

    if (error.code === "object_not_found") {
      errorMessage =
        "Database not found. The Database ID might be incorrect OR the integration is not connected to the database.";
    } else if (error.code === "unauthorized") {
      errorMessage =
        "Unauthorized. Please check your NOTION_API_KEY and ensure the integration is connected to the database.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        errorCode: errorCode,
        troubleshooting: {
          step1_verifyDatabaseId: {
            title: "Step 1: Verify Database ID Format",
            instructions: [
              "Your Database ID can be in either format:",
              "  • With hyphens: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (36 chars)",
              "  • Without hyphens: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (32 chars)",
              "",
              "How to get it:",
              "1. Open your Notion database in browser",
              "2. URL looks like: https://www.notion.so/workspace/YOUR_DB_ID?v=...",
              "3. Copy ONLY the part between the last '/' and the '?'",
              "4. Remove any spaces or extra characters"
            ],
            currentId: dbId.substring(0, 20) + "..." + " (length: " + dbId.length + " chars)"
          },
          step2_connectIntegration: {
            title: "Step 2: Connect Integration to Database",
            instructions: [
              "This is the MOST COMMON issue!",
              "",
              "1. Open your Notion database",
              "2. Click the '...' (three dots) menu in the top right",
              "3. Select 'Connections' or 'Add connections'",
              "4. Find and click your integration name (e.g., 'SPHT App')",
              "5. The integration should now appear in the connections list",
              "",
              "⚠️ Without this step, the integration cannot access the database!"
            ]
          },
          step3_verifyApiKey: {
            title: "Step 3: Verify API Key",
            instructions: [
              "Your API key should start with 'secret_'",
              "Get it from: https://www.notion.so/my-integrations",
              "Make sure there are no extra spaces in .env.local"
            ]
          },
          quickChecklist: [
            "☐ Database ID is 32 characters (no hyphens) OR 36 characters (with hyphens)",
            "☐ Integration is connected to the database (Database → Connections)",
            "☐ API key starts with 'secret_'",
            "☐ No spaces around '=' in .env.local",
            "☐ Restarted dev server after changing .env.local"
          ]
        },
      },
      { status: 500 }
    );
  }
}
