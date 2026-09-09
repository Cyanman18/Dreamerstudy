# Nova AI — Vercel deployment

## 1. Upload to GitHub
Create a GitHub repository and upload every file in this folder.

## 2. Import into Vercel
In Vercel, create a new project and import the GitHub repository.
Vercel will serve `public/` and the `/api/chat` serverless function.

## 3. Add your API key
In Vercel:
Project → Settings → Environment Variables

Add:
`OPENAI_API_KEY` = your OpenAI API key

Enable it for Production (and Preview if desired), save, then redeploy.

Do NOT put your API key into `public/app.js` or `index.html`.

## 4. Get your URL
After deployment Vercel gives you a URL such as:
`https://your-project.vercel.app`

You can also connect a custom domain from Project Settings → Domains.

## Local development
Install Node.js 24+, then:
`npm install`
`npm start`

For Vercel-style local development, install the Vercel CLI and run:
`vercel dev`

## Notes
The browser sends chat messages to `/api/chat`; the API key is used only inside the serverless function.
