# SPHT Landing Page

A modern landing page built with Next.js 14, TypeScript, and Tailwind CSS.

## Design System

- **Font**: Poppins (Google Fonts)
- **Primary Color**: #1c78fe (Blue)
- **Button Style**: Primary buttons use #1c78fe background with white text

## Getting Started

First, install the dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory with your Notion credentials and Resend API key:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_notion_database_id_here
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=your_verified_email@domain.com
```

**Note:** `RESEND_FROM_EMAIL` is optional. If not provided, it defaults to `onboarding@resend.dev` (for testing only). For production, you should use a verified domain email.

#### Setting up Notion Integration

1. **Create a Notion Integration:**
   - Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
   - Click "New integration"
   - Give it a name (e.g., "SPHT App")
   - Select your workspace
   - Click "Submit" to create the integration
   - Copy the "Internal Integration Token" - this is your `NOTION_API_KEY`

2. **Create a Notion Database:**
   - Create a new database in Notion (or use an existing one)
   - Add the following properties to your database:
     - **First Name** (Title type) - This will be the primary field
     - **Last Name** (Text type)
     - **Email** (Text type)
     - **Created At** (Date type)
     - **Score** (Number type) - Optional, for quiz scores
     - **Quiz Completed At** (Date type) - Optional, for quiz completion tracking
   - Click the "..." menu in the top right of the database
   - Select "Connections" → Add your integration
   - Copy the Database ID from the URL (the part after the last `/` and before the `?`) - this is your `NOTION_DATABASE_ID`

#### Setting up Resend (Email Service)

1. **Create a Resend Account:**
   - Go to [https://resend.com](https://resend.com)
   - Sign up for a free account (3,000 emails/month free tier)

2. **Get your API Key:**
   - After signing up, go to the API Keys section
   - Create a new API key
   - Copy the API key - this is your `RESEND_API_KEY`

3. **Verify your domain (for production):**
   - Add and verify your domain in Resend
   - Use your verified email as `RESEND_FROM_EMAIL` (e.g., `noreply@yourdomain.com`)
   - For development/testing, you can use the default `onboarding@resend.dev` (no verification needed)

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the landing page.

### Testing the Notion Connection

After setting up your environment variables, you can test the connection by visiting:

```
http://localhost:3000/api/test-notion
```

This endpoint will:
- ✅ Verify your API key and database ID are correct
- ✅ Check if the database exists and is accessible
- ✅ Verify all required properties are present
- ✅ Test querying the database

If successful, you'll see a JSON response with connection details. If there's an error, you'll get helpful troubleshooting tips.

### Testing the Email Service

After setting up your Resend API key, you can test the email service by visiting:

```
http://localhost:3000/api/test-email
```

Or with a custom email address:

```
http://localhost:3000/api/test-email?email=your-email@example.com
```

This endpoint will:
- ✅ Verify your RESEND_API_KEY is configured
- ✅ Send a test email to the specified address (or test@example.com by default)
- ✅ Return the email ID and status if successful
- ✅ Provide helpful error messages if something is wrong

If successful, check your inbox (and spam folder) for the test email. If you don't receive it, verify your domain in the Resend dashboard.

## Project Structure

- `/app` - Next.js app router pages and layouts
  - `/api/submit` - API route for form submissions
- `/components/ui` - Reusable design system components (Button, Typography, Input, Modal)
- `/lib` - Utility functions
  - `notion.ts` - Notion API client utility

## Deployment to Vercel

1. Push your code to a Git repository
2. Import your project in Vercel
3. Add the following environment variables in Vercel's project settings:
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (optional, but recommended for production)
4. Deploy

## Design System Components

- **Button**: Primary (#1c78fe), outline, and ghost variants
- **Typography**: Consistent text styles (h1-h4, body, lead, small)

# scoreapp-clone
