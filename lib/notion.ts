import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("Please add your Notion API Key to .env.local");
}

if (!process.env.NOTION_DATABASE_ID) {
  throw new Error("Please add your Notion Database ID to .env.local");
}

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

// Helper function to query database
export async function queryDatabase(filter?: any) {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID,
    filter: filter,
  });
  return response.results;
}

// Helper function to create a page in the database
export async function createPage(properties: any) {
  return await notion.pages.create({
    parent: {
      database_id: NOTION_DATABASE_ID,
    },
    properties: properties,
  });
}

// Helper function to update a page
export async function updatePage(pageId: string, properties: any) {
  return await notion.pages.update({
    page_id: pageId,
    properties: properties,
  });
}
