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

### Prerequisites

1. **Git Repository**: Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket)
2. **Vercel Account**: Sign up for a free account at [vercel.com](https://vercel.com)

### Step-by-Step Deployment

#### Option 1: Deploy via Vercel Dashboard (Recommended for first-time deployment)

1. **Push your code to Git:**
   ```bash
   git init  # if not already initialized
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

2. **Import your project:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository (GitHub, GitLab, or Bitbucket)
   - Authorize Vercel to access your repository if prompted

3. **Configure your project:**
   - **Framework Preset**: Vercel will auto-detect Next.js (should show "Next.js")
   - **Root Directory**: Leave as `./` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variables:**
   Before deploying, click "Environment Variables" and add:
   
   | Variable Name | Value | Notes |
   |--------------|-------|-------|
   | `NOTION_API_KEY` | Your Notion API key | Required |
   | `NOTION_DATABASE_ID` | Your Notion database ID | Required |
   | `RESEND_API_KEY` | Your Resend API key | Required |
   | `RESEND_FROM_EMAIL` | Your verified email | Optional (defaults to `onboarding@resend.dev`) |

   **Important:** Make sure to add these for all environments (Production, Preview, and Development) or at least for Production.

5. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)
   - Your app will be live at `https://your-project-name.vercel.app`

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set up and develop? No (unless you want to test locally)
   - Override settings? No (defaults are fine)

4. **Add Environment Variables:**
   ```bash
   vercel env add NOTION_API_KEY
   vercel env add NOTION_DATABASE_ID
   vercel env add RESEND_API_KEY
   vercel env add RESEND_FROM_EMAIL
   ```
   
   For each variable, select which environments to apply it to (Production, Preview, Development).

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Post-Deployment Checklist

After deployment, verify everything works:

1. **Test your live site:**
   - Visit your Vercel URL
   - Check that the landing page loads correctly

2. **Test API endpoints:**
   - `https://your-project.vercel.app/api/test-notion` - Should return success
   - `https://your-project.vercel.app/api/test-email?email=your-email@example.com` - Should send a test email

3. **Test form submission:**
   - Fill out and submit the form on your landing page
   - Verify data appears in your Notion database
   - Check that confirmation emails are sent

### Custom Domain (Optional)

1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Vercel will automatically provision SSL certificates

### Environment Variables Best Practices

- **Never commit `.env.local`** to Git (already in `.gitignore`)
- Use Vercel's environment variables for all secrets
- Use different environment variables for Production vs Preview if needed
- Rotate API keys periodically for security

### Troubleshooting

**Build fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18.x by default)

**Environment variables not working:**
- Make sure variables are added for the correct environment (Production/Preview/Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

**API routes returning errors:**
- Verify all environment variables are set correctly
- Check Vercel function logs in the dashboard
- Test endpoints individually using the test routes

### Continuous Deployment

Once connected to Git, Vercel will automatically:
- Deploy new commits to the main branch to Production
- Create Preview deployments for pull requests
- Run builds automatically on every push

## Design System Components

- **Button**: Primary (#1c78fe), outline, and ghost variants
- **Typography**: Consistent text styles (h1-h4, body, lead, small)

# scoreapp-clone
