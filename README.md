<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
AI Resume Builder App
A React + Vite application powered by Google Gemini AI with an Express backend, Tailwind CSS styling, and data visualization via Recharts.
Requirements

Node.js >= 20.x
A valid Gemini API key — get one at aistudio.google.com

Getting Started

Install dependencies:

bash   npm install

Set your API key in .env.local:

env   GEMINI_API_KEY=your_api_key_here

Run the app:

bash   npm run dev

The frontend will be available at: http://localhost:5173
The backend API will be available at: http://localhost:3000

Deploying to Railway

Push your code to GitHub
Create a new project on Railway

Click New Project → Deploy from GitHub repo
Select your repository


Set environment variables in the Railway dashboard:

   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=production

Configure the start command (if not auto-detected):

bash   npm run build && npm start

Generate a public domain under Settings → Networking → Generate Domain


Make sure your server.ts listens on process.env.PORT since Railway dynamically assigns ports.

Environment Variables
VariableDescriptionGEMINI_API_KEYYour Google Gemini API keyPORTPort the backend service listens onNODE_ENVSet to production for deploymentCORS_ORIGINAllowed origin for frontend requests
Scripts
CommandDescriptionnpm run devStart dev server (Express + Vite)npm run buildBuild for productionnpm run previewPreview production buildnpm run lintTypeScript type check
Links

Gemini API Docs
Railway Docs

