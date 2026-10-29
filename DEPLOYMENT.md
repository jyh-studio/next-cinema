# Vercel Services deployment

Import the repository with the project Root Directory set to the repository root (not frontend). The root vercel.json owns both services and all routing. Frontend SPA fallback is configured on the frontend service; frontend/vercel.json is removed to avoid duplicate configuration.

Public routes: /api/* and /uploads/* go to backend, all other paths go to frontend. FastAPI already defines /api/v1 routes; the prefix is preserved. Worksheet downloads use authenticated /api/v1/worksheets routes, so /worksheets need not be publicly routed to the backend. /healthz and FastAPI docs are not publicly exposed.

No bindings are needed: frontend is static browser code, with no runtime function that calls backend. Browser requests use same-origin public URLs. Do not add a BACKEND_URL binding or embed internal URLs in VITE_* variables. If a server-side proxy is added later, declare the binding on that calling service and read it at runtime.

Unset VITE_API_BASE_URL and VITE_BACKEND_BASE_URL in Vercel, or leave them empty. Configure MONGODB_URI, JWT_SECRET, GEMINI_API_KEY and (for news) NEWS_API_KEY in project environment settings. DB_PASSWORD is only needed when the existing Mongo URI contains its password placeholder. Never commit secrets.

Run `vercel dev` (or `vercel dev -L`) from the repository root. Smoke-test /api/v1, a frontend deep link such as /login, and a committed /uploads image. Also test authenticated login, worksheets and database operations with real environment settings.

Known blocker: new uploads write to backend/uploads on local disk. Vercel Functions cannot persist those writes. This change rejects uploads on Vercel with 503 rather than returning a non-durable URL. Existing committed media remains served. Choose durable object storage (for example Vercel Blob or S3) and implement direct uploads before enabling production uploads, especially 50 MB videos.

Security repair: frontend/postcss.config.js contained an obfuscated remote-code downloader/executor appended to its normal configuration. It was replaced with the standard Tailwind/Autoprefixer configuration. If the original file has been executed, review the affected environment and rotate exposed credentials.

Validation in this editing environment: static Python syntax and URL/routing checks only. Dependency installation, a frontend production build and vercel dev require network/package access and must be run before deployment.
