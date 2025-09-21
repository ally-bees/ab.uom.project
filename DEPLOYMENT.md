# Deployment Guide

This guide shows simple, low-cost approaches to deploy the frontend and backend separately using free or trial-friendly platforms.

Goals
- Deploy Angular frontend to Vercel or Netlify (free tiers)
- Deploy .NET backend to Fly.io or Railway (free / generous trial tiers)
- Keep frontend and backend separate; communicate via HTTPS

Prerequisites
- Git installed and code committed
- Docker (for building backend image locally)
- Accounts at providers you plan to use (Vercel, Netlify, Fly.io, Railway)

Frontend (Angular)
Option A — Vercel (recommended for simplicity)
1. Install Vercel CLI (optional):

```powershell
npm i -g vercel
```

2. Build the Angular app for production:

```powershell
cd src
npm install
npm run build -- --configuration=production
```

3. Deploy the `dist/` folder to Vercel:

```powershell
vercel deploy --prod ./dist
```

If not using the CLI, connect your GitHub repo in the Vercel dashboard and set the build command to `npm run build -- --configuration=production` and the output directory to `dist`.

Option B — Netlify
1. Build the app (same as above).
2. Drag-and-drop the `dist/` folder into the Netlify dashboard, or connect your repo and set the build command and output folder.

Notes
- Set environment variables needed by the frontend (for example `VITE_API_BASE_URL` or add to `src/environments/environment.prod.ts`) in the hosting service's dashboard.

Backend (.NET)
Option A — Fly.io (good free tier for small apps)
1. Install Fly CLI and sign in: https://fly.io/docs/getting-started/installing-flyctl/
2. From the `Backend` folder, build and deploy with a Dockerfile:

```powershell
cd Backend
fly launch --name ab-uom-backend --copy-config --image-name ab-uom-backend
# follow prompts to create app and org; choose region
fly deploy
```

3. Configure secrets (environment variables) on Fly:

```powershell
fly secrets set MONGO_CONN="<your-conn>" JWT_KEY="<your-jwt-key>" EMAIL_SENDER="..."
```

Option B — Railway
1. Create a new project and connect repository or use Dockerfile.
2. Add environment variables in the Railway dashboard and deploy.

Option C — Use Docker + Cloud Run / Render / Azure (if you prefer)
- The included `Backend/Dockerfile` builds and publishes the app.

Environment variables / appsettings
- `MongoDBSettings:ConnectionString` — MongoDB connection string
- `MongoDBSettings:DatabaseName` — Database name
- `JwtSettings:Key` — JWT signing secret
- `EmailSettings:SenderEmail` — Email address for SMTP
- `EmailSettings:Password` — Email app password (use secrets only)
- `PredictionService:Endpoint` — Optional model endpoint

CORS / HTTPS
- Ensure backend allows requests from your frontend origin (configure CORS in `Startup` / `Program.cs`).
- Use HTTPS endpoints for production; hosting providers usually provide TLS.

DNS & URLs
- After deploying, set the frontend to use the backend's public URL. Prefer storing the backend URL in environment variables.

Testing the deployment
- Frontend: visit the Vercel/Netlify URL and verify charts load and API calls succeed (check browser Console / Network).
- Backend: use `curl` or Postman to hit health endpoints and API endpoints.

Rollback & Logs
- Use provider dashboards to inspect build logs and runtime logs. Fly, Railway, and Vercel provide log viewers.

Troubleshooting
- 500 errors: check backend logs for missing secrets or DB connectivity.
- CORS: add the frontend origin to allowed CORS in the backend.
- Static files not found: make sure the frontend build output `dist/` directory is set as the publish folder.

Optional (free alternatives)
- Frontend: GitHub Pages (if SPA rewrite handled), Firebase Hosting (free tier), Surge.sh
- Backend: Render.com (starter free tier), Railway, Fly.io — choose based on region and limits.

Security
- Never commit secrets. Use provider secrets or environment variables.
- Use JWT secrets and rotate them if leaked.

If you want, I can:
- Add a `vercel.json` or `netlify.toml` and an `nginx.conf` for static hosting rewrites.
- Add GitHub Actions workflow to automatically build and deploy on push to `master`/`main`.
- Prepare a sample `docker-compose.yml` to run MongoDB + Backend locally for testing.
