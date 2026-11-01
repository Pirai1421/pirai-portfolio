# Pirai Soodan G. — Java Backend Developer Portfolio & AI Personal Assistant

[![Java 17+](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot 3+](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini-3.8_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/Vitest-Passed-729B1B?logo=vitest&logoColor=white)](https://vitest.dev)
[![JUnit 5](https://img.shields.io/badge/JUnit_5-Passed-25A162?logo=junit5&logoColor=white)](https://junit.org/junit5/)

A modern, production-oriented personal portfolio website for **Pirai Soodan G.**, a Java Backend Engineer, featuring an integrated AI personal assistant powered by **Google Gemini API** with an in-memory **RAG (Retrieval-Augmented Generation)** pipeline.

Live Portfolio: [https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app](https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app)

---

## 🏛️ RAG-Powered AI Assistant Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                    User Browser / Recruiter                     │
│               React 18 + TypeScript + Tailwind CSS              │
└────────────────┬───────────────────────────────┬────────────────┘
                 │                               │
                 │ HTTP /api/assistant/chat      │ Direct Gemini (Client Key)
                 ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│              RAG Knowledge Retriever (Backend & Frontend)       │
│  - Chunks: Experience, JPA Migration, SAP Fee, Health Check,    │
│            AI/ML Projects, Skills, Education, STAR Award        │
│  - Semantic/Keyword scoring selects top 1-3 targeted chunks     │
│  - Reduces token usage by 75-80% (~150-250 tokens per call)     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                   ScopeClassifier (Guardrails)
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
 [Off-Topic / Jailbreak]  [Unverified Skill]   [Verified In-Scope Context]
 Returns exact Rule 2     Returns Rule 3       ┌────────────────────────┐
 mandated response        missing info notice  │ GEMINI_API_KEY set?    │
                                               ├───────────┬────────────┤
                                               │ Yes:      │ No:        │
                                               │ Google    │ Verified   │
                                               │ Gemini API│ Knowledge  │
                                               │ (1.5 Flash│ Engine     │
                                               │ / Pro)    │ (Demo)     │
                                               └───────────┴────────────┘
```

---

## 📋 Verified Profile Highlights

- **Role:** Associate Software Engineer / Java Backend Software Engineer
- **Current Employer:** Purchasing Power (July 2025–Present; Intern: Jan 2025–July 2025)
- **Education:** B.Tech in Computer and Communication Engineering, Amrita Vishwa Vidyapeetham, Coimbatore (2021–2025), CGPA: 8.3/10
- **Honors:** STAR Award for Q2 2026, recognized as Best Employee and Star Performer of the Quarter at Purchasing Power
- **Core Stack:** Java 8/17, Spring Boot 3+, REST APIs, Microservices, Hibernate, Spring Data JPA, JDBC, MySQL, PostgreSQL, JUnit, Mockito, Git, Maven, Jenkins, Docker
- **AI & Data Stack:** Machine Learning Concepts, Predictive Modeling, Data Preprocessing (Pandas), Feature Engineering, Model Evaluation, AI-Assisted Development

---

## 🚀 How to Run Locally

### 1. Spring Boot Backend Setup

```bash
cd backend

# Run automated JUnit tests (All 14 tests passing)
mvn clean test

# Build production JAR
mvn package -DskipTests

# Start Spring Boot (Port 8080)
mvn spring-boot:run
```

To enable Live AI via backend:
```powershell
$env:GEMINI_API_KEY="AIzaSy..."
mvn spring-boot:run
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run automated tests (12 Vitest tests passing)
npm test

# Build production bundle
npm run build

# Start local Vite dev server (Port 3000)
npm run dev
```

Visit **http://localhost:3000**.
- **Dark/Light Theme Toggle:** Click the Sun/Moon icon in the navbar.
- **Activate Live Gemini Directly:** Click the key icon (`🔑`) in the AI Assistant chat header and paste your Gemini API key. It saves locally to your browser session and immediately activates **LIVE AI** mode!

---

## 🌐 Complete Vercel & Cloud Deployment Guide

### Part 1: Deploying the Frontend to Vercel (1-Click)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: complete java portfolio with rag gemini ai assistant"
   git remote add origin https://github.com/your-username/pirai-portfolio.git
   git push -u origin main
   ```

2. **Import Project into Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - **Root Directory:** Click `Edit` and select `frontend`.
   - **Framework Preset:** `Vite` (automatically detected).
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Configure Environment Variables on Vercel:**
   - Under **Settings > Environment Variables**, add:
     - `VITE_GEMINI_API_KEY` = `your_google_gemini_api_key_here`
       *(Optional local/browser-only mode; this exposes the key to the browser. For production, configure `GEMINI_API_KEY` on the backend instead.)*
     - *(Optional)* `VITE_API_BASE_URL` = `https://your-backend.onrender.com` *(If connecting to your hosted Spring Boot service)*

4. **Click Deploy:**
   Your frontend is live globally with high-speed CDN and automatic HTTPS!

---

### Part 2: Deploying the Spring Boot Backend (Render / Railway)

> **Important Note:** Vercel is a serverless platform for Node.js/Edge functions and static sites; it does not run long-running Java/JVM `.jar` applications. To host your Java Spring Boot backend, use a free cloud provider like **Render** or **Railway**.

#### Deploying on Render (Free Java / Docker Hosting)
1. Sign up at [render.com](https://render.com).
2. Click **"New" > "Web Service"**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name:** `pirai-portfolio-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Docker` *(Uses the included multi-stage `Dockerfile`)*
   - **Branch:** `main`
5. **Environment Variables:**
   - `GEMINI_API_KEY`: `your_google_gemini_api_key`
   - `CORS_ALLOWED_ORIGINS`: `https://your-portfolio-frontend.vercel.app`
6. Click **"Create Web Service"**.
   Render builds the Docker image and gives you a public HTTPS URL (e.g. `https://pirai-portfolio-backend.onrender.com`).

---

## 📄 License & Attribution

All portfolio content is the verified professional intellectual property of **Pirai Soodan G.**
Website design and RAG-grounded AI guardrail architecture engineered with React, TypeScript, Tailwind CSS, and Spring Boot.
