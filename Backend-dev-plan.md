# 1) Executive Summary
- This document outlines the backend development plan for the Next Cinema Playground, an online community platform for actors and filmmakers.
- The backend will be built using FastAPI (Python 3.12) and MongoDB Atlas, adhering to a no-Docker constraint and a frontend-driven manual testing approach.
- The sprint count is dynamic and will expand to cover all frontend features.
- Constraints honored: FastAPI, MongoDB Atlas, no Docker, frontend-driven manual testing, `main`-only workflow.

# 2) In-scope & Success Criteria
- In-scope:
  - User authentication (signup, login, logout)
  - Profile management (creation, editing, display)
  - Community feed (posting, liking)
  - Learning resources (displaying curated content)
  - Magazines (displaying curated articles)
  - News (displaying industry news)
  - Worksheets (displaying interactive checklists and templates)
  - Payment (handling membership payments)
- Success criteria:
  - Full coverage of discovered frontend features.
  - Each sprint passes manual tests via the UI.
  - Push to `main` after success.

# 3) API Design
- Conventions:
  - Base path: `/api/v1`
  - Error model: short, consistent JSON error envelope.
- Endpoints:
  - **Authentication:**
    - `POST /api/v1/auth/signup`: Registers a new user.
      - Request: `{ email: string, password: string, name: string }`
      - Response: `{ access_token: string, token_type: string }`
      - Validation: Email format, password strength, name presence.
    - `POST /api/v1/auth/login`: Authenticates an existing user.
      - Request: `{ email: string, password: string }`
      - Response: `{ access_token: string, token_type: string }`
      - Validation: Email format, password presence.
    - `POST /api/v1/auth/logout`: Invalidates the current user's token (client-side only, no backend invalidation).
      - Request: None
      - Response: None
    - `GET /api/v1/auth/me`: Retrieves the current user's profile. (Only if the frontend needs it.)
      - Request: None (requires authentication)
      - Response: `{ id: string, email: string, name: string, is_member: boolean, profile_completed: boolean }`
  - **Profile Management:**
    - `POST /api/v1/profiles`: Creates a new user profile.
      - Request: See Data Model below.
      - Response: `{ id: string }`
      - Validation: Required fields, data types.
    - `GET /api/v1/profiles/{profile_id}`: Retrieves a specific user profile.
      - Request: None
      - Response: See Data Model below.
    - `PUT /api/v1/profiles/{profile_id}`: Updates an existing user profile.
      - Request: See Data Model below.
      - Response: `{ id: string }`
  - **Community Feed:**
    - `GET /api/v1/posts`: Retrieves a list of posts.
      - Request: None (no filtering/sorting initially)
      - Response: `[{ id: string, user_id: string, author_name: string, author_headshot: string, type: string, content: string, media_url: string, likes: number, comments: [], created_at: string }]`
    - `POST /api/v1/posts`: Creates a new post.
      - Request: `{ type: string, content: string, media: UploadFile | None }`
      - Response: `{ id: string }`
      - Validation: Type, content presence (or media), media file type/size.
    - `POST /api/v1/posts/{post_id}/likes`: Adds a like to a post.
      - Request: None
      - Response: `{ likes: number }`
  - **Learning Resources, Magazines, News, Worksheets:**
    - These sections will initially display curated content. If the frontend requires dynamic content updates, API endpoints for content management will be added in later sprints.
  - **Payment:**
    - `POST /api/v1/subscriptions`: Handles new subscriptions.
      - Request: `{ plan: string, stripe_token: string }` (Stripe integration details to be defined later)
      - Response: `{ success: boolean }`

# 4) Data Model (MongoDB Atlas)
- Collections:
  - **users:**
    - `_id`: ObjectId (primary key)
    - `email`: string (required)
    - `password_hash`: string (required)
    - `name`: string (required)
    - `is_member`: boolean (default: false)
    - `profile_completed`: boolean (default: false)
    - `created_at`: datetime (required)
    - Example: `{ "_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7a"), "email": "test@example.com", "password_hash": "$argon2id$v=19$m=65536,t=3,p=2$...", "name": "Test User", "is_member": false, "profile_completed": false, "created_at": datetime.datetime(2023, 9, 21, 23, 30, 0) }`
  - **profiles:**
    - `_id`: ObjectId (primary key)
    - `user_id`: ObjectId (required, referenced from `users`)
    - `name`: string (required)
    - `pronouns`: string (optional)
    - `age_range`: string (required)
    - `location`: string (required)
    - `willing_to_relocate`: boolean (default: false)
    - `height`: string (optional)
    - `build`: string (optional)
    - `eye_color`: string (optional)
    - `hair_color`: string (optional)
    - `ethnicity`: string (optional)
    - `acting_schools`: list of strings (optional)
    - `workshops`: list of strings (optional)
    - `coaches`: list of strings (optional)
    - `stage_experience`: boolean (default: false)
    - `film_experience`: boolean (default: false)
    - `special_skills`: list of strings (optional)
    - `union_status`: string (optional)
    - `preferred_genres`: list of strings (optional)
    - `career_goals`: string (optional)
    - `headshots`: list of strings (optional, URLs)
    - `resume`: string (optional, URL)
    - `demo_reel`: string (optional, URL)
    - `social_links`: list of strings (optional)
    - `bio`: string (optional)
    - `tagline`: string (optional)
    - `is_public`: boolean (default: true)
    - `completion_percentage`: integer (optional)
    - `profile_url`: string (optional)
    - `created_at`: datetime (required)
    - `updated_at`: datetime (required)
    - Example: `{ "_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7b"), "user_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7a"), "name": "Jane Doe", "age_range": "25-30", "location": "Los Angeles, CA", "willing_to_relocate": true, "height": "5'7\"", "build": "Athletic", "eye_color": "Brown", "hair_color": "Brown", "ethnicity": "Caucasian", "acting_schools": ["Stella Adler Studio"], "workshops": [], "coaches": [], "stage_experience": true, "film_experience": false, "special_skills": ["Singing", "Dancing"], "union_status": "SAG-AFTRA", "preferred_genres": ["Drama", "Comedy"], "career_goals": "To work in film and television.", "headshots": ["https://example.com/headshot1.jpg"], "resume": "https://example.com/resume.pdf", "demo_reel": "https://example.com/demo_reel.mp4", "social_links": ["https://instagram.com/janedoe"], "bio": "Jane Doe is an actress based in Los Angeles.", "tagline": "Bringing authenticity to every role.", "is_public": true, "completion_percentage": 95, "profile_url": "jane-doe", "created_at": datetime.datetime(2023, 9, 21, 23, 30, 0), "updated_at": datetime.datetime(2023, 9, 21, 23, 30, 0) }`
  - **posts:**
    - `_id`: ObjectId (primary key)
    - `user_id`: ObjectId (required, referenced from `users`)
    - `author_name`: string (required)
    - `author_headshot`: string (optional, URL)
    - `type`: string (required, enum: "text", "monologue", "reel", "headshot", "resume")
    - `content`: string (optional)
    - `media_url`: string (optional, URL)
    - `likes`: integer (default: 0)
    - `comments`: list of embedded comment documents (see below)
    - `created_at`: datetime (required)
    - Example: `{ "_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7c"), "user_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7a"), "author_name": "Jane Doe", "author_headshot": "https://example.com/headshot.jpg", "type": "text", "content": "Looking for feedback on my new headshot!", "media_url": null, "likes": 0, "comments": [], "created_at": datetime.datetime(2023, 9, 21, 23, 30, 0) }`
  - **comments:** (embedded in `posts`)
    - `_id`: ObjectId (optional, if needed for internal tracking)
    - `user_id`: ObjectId (required, referenced from `users`)
    - `author_name`: string (required)
    - `content`: string (required)
    - `created_at`: datetime (required)
    - Example: `{ "_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7d"), "user_id": ObjectId("650c7a7a7a7a7a7a7a7a7a7a"), "author_name": "John Smith", "content": "Great headshot!", "created_at": datetime.datetime(2023, 9, 21, 23, 35, 0) }`

# 5) Frontend Audit & Feature Map
- **Home / Landing Page:**
  - Route: `/`
  - Purpose: Highlights mission, value proposition, call to action.
  - Backend capability: None (static content)
  - Auth requirement: None
- **What We Offer:**
  - Route: `/what-we-offer`
  - Purpose: Clear breakdown of membership benefits.
  - Backend capability: None (static content)
  - Auth requirement: None
- **Our Mission:**
  - Route: `/our-mission`
  - Purpose: Vision, values, and community goals.
  - Backend capability: None (static content)
  - Auth requirement: None
- **Free Guides:**
  - Route: `/free-guides`
  - Purpose: Introductory resources.
  - Backend capability: None (static content initially, CMS integration in later sprints if needed)
  - Auth requirement: None
- **Login:**
  - Route: `/login`
  - Purpose: User login.
  - Backend capability: `POST /api/v1/auth/login`
  - Auth requirement: None
- **Signup:**
  - Route: `/signup`
  - Purpose: User registration.
  - Backend capability: `POST /api/v1/auth/signup`
  - Auth requirement: None
- **Payment:**
  - Route: `/payment`
  - Purpose: Membership payment processing.
  - Backend capability: `POST /api/v1/subscriptions` (Stripe integration)
  - Auth requirement: None
- **Membership:**
  - Route: `/membership`
  - Purpose: Display membership information.
  - Backend capability: None (static content initially, dynamic content in later sprints if needed)
  - Auth requirement: Authentication required
- **Profile Builder:**
  - Route: `/profile-builder`
  - Purpose: Profile creation and editing.
  - Backend capability: `POST /api/v1/profiles`, `PUT /api/v1/profiles/{profile_id}`
  - Auth requirement: Authentication required
- **Profile:**
  - Route: `/profile`
  - Purpose: Display user profile.
  - Backend capability: `GET /api/v1/profiles/{profile_id}`
  - Auth requirement: Authentication required
- **Learn:**
  - Route: `/learn`
  - Purpose: Display learning resources.
  - Backend capability: None (static content initially, CMS integration in later sprints if needed)
  - Auth requirement: Membership required
- **Community:**
  - Route: `/community`
  - Purpose: Display community feed and allow posting.
  - Backend capability: `GET /api/v1/posts`, `POST /api/v1/posts`, `POST /api/v1/posts/{post_id}/likes`
  - Auth requirement: Membership required
- **News:**
  - Route: `/news`
  - Purpose: Display industry news.
  - Backend capability: None (IMDb integration, AI curation in later sprints if needed)
  - Auth requirement: Membership required
- **Magazines:**
  - Route: `/magazines`
  - Purpose: Display curated articles.
  - Backend capability: None (AI summarization in later sprints if needed)
  - Auth requirement: Membership required
- **Worksheets:**
  - Route: `/worksheets`
  - Purpose: Display interactive checklists and templates.
  - Backend capability: None (dynamic content in later sprints if needed)
  - Auth requirement: Membership required

# 6) Configuration & ENV Vars (core only)
- `APP_ENV` - environment name (e.g., development)
- `PORT` - HTTP port (e.g., 8000)
- `MONGODB_URI` - Atlas connection string
- `JWT_SECRET` - token signing secret
- `JWT_EXPIRES_IN` - access token lifetime (seconds)
- `CORS_ORIGINS` - allowed origins (frontend URL)

# 7) Background Work (only include this section if actual background tasks are required)
- Not required in initial sprints.

# 8) Integrations (only include this section if the frontend/PRD truly requires them)
- Not required in initial sprints.

# 9) Testing Strategy (Manual via Frontend)
- Policy: validate via the UI by navigating screens and submitting forms; optionally observe Network in DevTools.
- Per-sprint Manual Test Checklist (Frontend): list the exact UI steps and expected outcomes for that sprint.
- User Test Prompt: short, copy-pasteable instructions guiding a human tester through the UI.
- Post-sprint: if tests pass, **commit and push to GitHub `main`**; if not, fix and retest before pushing.

# 10) Dynamic Sprint Plan & Backlog (S0…Sn)
- Create as many sprints as needed to cover all frontend features.
- Each sprint must include: Objectives, User Stories, Tasks, Definition of Done, Manual Test Checklist (Frontend), User Test Prompt, Post-sprint push to `main` if successful.

- **S0 - Environment Setup & Frontend Connection (always)**
  - Objectives:
    - Create FastAPI skeleton with `/api/v1` and `/healthz`.
    - Ask the user for `MONGODB_URI` and set it in the environment.
    - Implement `/healthz` to include a quick DB connectivity check (e.g., ping) and return a simple JSON status.
    - Enable CORS for the frontend origin.
    - Wire the frontend to the backend (configure `API_BASE_URL`, replace dummy calls with real ones).
    - Initialize Git and set up GitHub: `git init`, `.gitignore`, first commit, create remote, set default branch `main`, initial push.
  - Definition of Done:
    - Backend runs locally; `/healthz` responds and shows DB connectivity.
    - Frontend successfully calls the backend and renders live data.
    - Repository exists on GitHub with `main` as default.
  - Manual Test Checklist (Frontend):
    - Set `MONGODB_URI`, start backend, open the app, hit a page that triggers `/healthz`, confirm success in UI/Network.
  - Manual Test Checklist (Frontend):
    1.  Set the `MONGODB_URI` environment variable.
    2.  Start the backend using the command `uvicorn main:app --reload`.
    3.  Open the frontend in a browser at `http://localhost:5137/`.
    4.  Navigate to the `/login` page.
    5.  Enter valid email and password credentials and click the "Login" button.
    6.  Verify that the user is successfully logged in and redirected to a protected page (e.g., `/profile`).
    7.  Navigate to the `/signup` page.
    8.  Enter valid email, password, and name credentials and click the "Signup" button.
    9.  Verify that the user is successfully signed up and redirected to a protected page.
    10. Open the browser's developer tools and inspect the Network tab to confirm that the frontend is making API calls to the backend endpoints (`/api/v1/auth/login` and `/api/v1/auth/signup`).
  - User Test Prompt:
    1.  Make sure the backend is running.
    2.  Open the frontend in your browser.
    3.  Try to log in with your existing credentials.
    4.  If you don't have an account, sign up for a new one.
    5.  Check if you can access the profile page after logging in/signing up.
  - Post-sprint:
    - Commit any changes and push to `main`.

- **S1 - Basic Auth (signup, login, logout)**
  - Objectives:
    - Implement signup, login, logout.
    - Protect at least one route in the backend and one page in the frontend.
  - Endpoints:
    - `POST /api/v1/auth/signup`
    - `POST /api/v1/auth/login`
    - `POST /api/v1/auth/logout`
    - (Add `GET /api/v1/auth/me` only if the frontend needs it.)
  - Tasks:
    - Store users with hashed passwords (Argon2).
    - Issue short-lived JWT access token; add simple middleware to enforce auth.
    - Configure CORS for the frontend origin.
  - Definition of Done:
    - Users can sign up, log in, access a protected page, log out via the frontend.
  - Manual Test Checklist (Frontend):
    - Create a user, visit a protected page, log out, log back in, verify unauthorized access is blocked.
  - User Test Prompt:
    - Short steps a tester can follow in the UI to confirm the flow.
  - Post-sprint:
    - Commit the changes and push to `main`.

- **S2 - Profile Management**
  - Objectives:
    - Implement profile creation, retrieval, and update.
    - Connect the profile builder form to the backend.
    - Display user profiles on the profile page.
  - Endpoints:
    - `POST /api/v1/profiles`
    - `GET /api/v1/profiles/{profile_id}`
    - `PUT /api/v1/profiles/{profile_id}`
  - Tasks:
    - Implement the profile data model in MongoDB.
    - Create API endpoints for profile management.
    - Update the frontend to use the new API endpoints.
  - Definition of Done:
    - Users can create and update their profiles via the frontend.
    - User profiles are displayed correctly on the profile page.
  - Manual Test Checklist (Frontend):
    - Create a new profile, edit the profile, verify the changes are saved and displayed correctly.
  - User Test Prompt:
    - Short steps a tester can follow in the UI to confirm the flow.
  - Post-sprint:
    - Commit the changes and push to `main`.

- **S3 - Community Feed**
  - Objectives:
    - Implement the community feed functionality.
    - Allow users to create posts with text and/or media.
    - Display posts in the community feed.
    - Implement liking posts.
  - Endpoints:
    - `GET /api/v1/posts`
    - `POST /api/v1/posts`
    - `POST /api/v1/posts/{post_id}/likes`
  - Tasks:
    - Implement the post data model in MongoDB.
    - Create API endpoints for managing posts and likes.
    - Update the frontend to use the new API endpoints.
  - Definition of Done:
    - Users can create posts with text and/or media.
    - Posts are displayed in the community feed.
    - Users can like posts.
  - Manual Test Checklist (Frontend):
    - Create a new post with text, create a new post with media, like a post, verify the changes are displayed correctly.
  - User Test Prompt:
    - Short steps a tester can follow in the UI to confirm the flow.
  - Post-sprint:
    - Commit the changes and push to `main`.

- **S4…Sn - Remaining Features**
  - Derive sprints from the Feature Map by dependency and user value.
  - Keep each sprint small and focused.
  - For each sprint: Objectives, Stories, Tasks, DoD, Manual Test Checklist (Frontend), User Test Prompt, push to `main` on success.