---
title: Product Requirements Document
app: wise-parrot-play
created: 2025-09-17T05:04:56.754Z
version: 1
source: Deep Mode PRD Generation
---

# Product Requirements Document (PRD)
**Product:** Next Cinema Playground - Actor/Filmmaker Online Community Platform  
**Prepared by:** Joy Huang

## Product Vision
Build an AI-powered online community for actors and filmmakers to grow, learn, network, and collaborate on creative projects. The platform provides structured learning resources, curated industry insights, and personalized career development tools, all while fostering a supportive community that lowers the barrier of entry into acting and filmmaking.

## Goals & Objectives
- Lower barriers of entry into acting/filmmaking by providing structured, affordable, and accessible resources
- Provide exposure for members by giving them profile pages and opportunities to showcase work
- Enable collaboration & feedback through community-driven engagement (feed, comments, Discord integration)
- Differentiate from expensive introductory classes (avg. $550) by offering a structured and affordable membership

## Target Audience
- Aspiring actors with little to no formal training
- Working actors who want community support and exposure

## Key Features

### Public-Facing Pages (Free)
- **Home / Landing Page:** Highlights mission, value proposition, call to action
- **What We Offer:** Clear breakdown of membership benefits
- **Our Mission:** Vision, values, and community goals
- **Free Guides:** Introductory resources (e.g., "How to Build an Acting Resume," "Top 10 Free Self-Tape Tools")

### Membership-Only (Paid Subscription)

#### Learn Section
**Content Sourcing & Curation:**
- Videos are handpicked from YouTube, Vimeo, interviews, and professional sources
- Only high-quality, professional, relevant content that aligns with professional training standards
- Avoid random vlog-style advice to maintain consistent professional tone

**Consistent Video Guide Design:**
Each entry in the library features a standardized card layout:
- **Thumbnail:** Customized to brand (not random YouTube screenshots)
- **Title:** Clear, professional with standardized casing
- **Source Credit:** "From [Creator/Channel/Studio]"
- **Duration:** e.g., "10 min"
- **Category/Level:** Foundations, Intermediate, Advanced
- **Short Curated Summary:** 2-3 sentences explaining relevance
- **Action CTA:** "Watch Video" → opens in embedded player or new tab

**Organization Structure:**
- **By Level:** Foundations → Intermediate → Advanced courses
- **By Topic:** Acting technique, auditions, reels, industry knowledge
- **Progress Tracker:** Checkmarks to show completed videos (future enhancement)
- **Resource Libraries:** Tools, templates, and expert breakdowns (curated from internet)

#### Magazines Section
- Curated actor/filmmaker advice from trusted websites
- **AI summarization** of articles into digestible guides
- Recommended books/resources with affiliate links

#### Latest News Section
- Plug-in/API integration with IMDb for real-time industry news
- **AI-curated commentary** ("Top 3 insights this week for actors")

#### Worksheets Section
- Interactive checklists (resume, demo reel, headshot prep)
- Downloadable templates
- Progress tracking dashboard

#### Actor/Filmmaker Profiles

**Profile Builder Survey Flow:**
The profile builder serves three critical functions:
1. **Standardizes information** actors normally scatter across headshots, resumes, reels
2. **Makes talent discoverable** via filters/search (like a mini IMDbPro for emerging actors)
3. **Enables AI personalization** (lookalike suggestions, script recommendations, headshot advice)

**Guided Onboarding Process:**
- **Step 1:** Guided onboarding with bite-sized steps
  - "Let's build your actor profile. Think of this as your digital calling card for casting and collaboration."
  - Broken into: Basic Info → Physical Profile → Training & Skills → Media Uploads → Interests/Aspirations

- **Step 2:** Core Data Collection
  - **Personal/Demographic Info:** Name, pronouns, age range you can play, ethnicity/cultural background (optional), height, build, eye color, hair color, location + willingness to travel/relocate
  - **Training & Experience:** Acting school(s), workshops, coaches, stage vs. film experience, special skills (languages, accents, singing, dancing, combat, instruments), union status (SAG/AFTRA, ACTRA, Equity)
  - **Interests & Aspirations:** Preferred genres, types of projects, career goals
  - **Media Uploads:** Headshots (min 1 required), resume (PDF upload or builder), demo reel/monologues, optional social media links

**AI-Powered Profile Enhancements:**
1. **Actor Lookalikes:** Based on age, ethnicity, height, look → "You share a similar profile to [Actor Name]. Here are the types of roles and projects they built early on."
2. **Script Recommendations:** Pulls monologues or scenes from public domain + indie works matched to actor's profile
3. **Headshot Guidance:** Suggests looks/styles matched to market expectations
4. **Profile Completeness Tracker:** Gamified progress bar with completion incentives

**Public-Facing Profile Features:**
- Shareable URL (e.g., `nextcinema.com/actor/jane-smith`)
- Hero banner with headshot + name + tagline
- Bio section, resume/training, reel/media gallery
- Skills + tags (auto-generated from survey)
- Privacy controls: actor decides what's public vs. members-only

#### Community Feed & Social Features

**MVP Feed Functionality:**
- **Content Types:**
  - Uploads: new reels, headshots, or monologues
  - Text Posts: simple status updates ("Looking for feedback on my resume")

- **Core User Interactions:**
  - Like ❤️ – quick encouragement
  - Comment 💬 – feedback or discussion
  - Follow ➕ – subscribe to someone's updates

- **Actor-Specific Organization:**
  - Tag Post Type selection when posting:
    - 🎭 Monologue
    - 🎬 Reel/Clip
    - 📸 Headshot
    - 📄 Resume
  - Helps organize feed without needing hashtags, algorithms, or AI initially

- **Profile Integration:**
  - Posts show: actor's name, headshot thumbnail, and link to their profile
  - Direct click-through from feed posts to full profiles

## Membership Funnel Flow

### Step 1: Public Site (Free Access, No Login)
- Home/Landing Page
- What We Offer
- Our Mission
- Free Guides (resume basics, self-tape tools)
- Calls-to-Action: "Create Your Profile → Join the Community"

### Step 2: Sign Up/Login
- User signs up with email + password (or Google/Apple login)
- Choose Membership Plan (monthly/yearly)
- Payment processing (Stripe/Memberstack)
- Redirect to onboarding

### Step 3: Profile Builder Survey (Required)
Before accessing community or resources, users must complete:
- Core identity (name, pronouns, age range, union status, location)
- Physical profile/look description
- Training & experience
- Interests & goals
- Media uploads (at least 1 headshot)
- Ensures every member has a discoverable presence

## Technical Requirements

### Core Functional Requirements

**Authentication & Membership:**
- Free tier (public pages) vs. Paid tier (members-only)
- Subscription management (Stripe/Memberstack)

**Content Management System (CMS):**
- Upload, organize, and categorize videos, guides, templates
- Admin/editor dashboard for curating external content

**AI Integrations:**
- **AI-powered actor recommendations** based on written profile descriptions
- **AI-summarized industry articles** for digestible content consumption
- Curated 'personalized' learning playlists based on self-surveyed stage of acting experience
- IMDb real-time integrations

**Profile Builder:**
- Survey → Profile auto-generated → Public-facing URL
- Media uploads (video, images, PDF resume)

**Feed & Social Features:**
- Basic activity feed (uploads/comments)
- Following handles, algorithmic recommendations
- Post categorization system

### Use Cases & Differentiation

**Casting & Community Applications:**
- **Casting directors/filmmakers:** Filter database by age range, look, skills
- **Peers:** Follow handles, leave comments/feedback
- **AI agent:** Matches actors to scripts, projects, and recommended peers

**Competitive Advantages:**
- Standardizes data → easier to filter/search than traditional resumes
- AI layer provides personalized career scaffolding
- Modern, interactive, and dynamic vs. static PDFs
- Makes global talent visible, not just those with representation
- Significantly more affordable than traditional acting classes ($550 average)

This comprehensive platform creates a structured pathway for actors and filmmakers to develop their careers while building a supportive, discoverable community that leverages AI to provide personalized guidance and opportunities.