# Nova AI — Vercel-ready

This version puts `index.html` at the project root, so Vercel can serve the homepage directly.

## Deploy with your existing GitHub project

Replace the files in your GitHub repository with the files in this folder:

- `index.html`
- `styles.css`
- `app.js`
- `api/chat.mjs`
- `vercel.json`
- `package.json`

Then push/commit the changes. Vercel should automatically create a new deployment.

## Environment variable

In Vercel → Settings → Environment Variables, add:

`OPENAI_API_KEY` = your OpenAI API key

Do not put the key in `app.js` or `index.html`.

## Expected structure

index.html
styles.css
app.js
package.json
vercel.json
api/
  chat.mjs

After deployment, open your `dreamerstudy.vercel.app` URL.
