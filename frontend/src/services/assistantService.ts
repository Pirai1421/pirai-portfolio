import { AssistantStatus } from '../types/portfolio';
import { retrieveRelevantContext } from './ragRetriever';

export interface ChatApiResponse {
  answer: string;
  mode: 'LIVE_AI' | 'VERIFIED_KNOWLEDGE_BASE';
  offTopic: boolean;
  responseTimeMs: number;
}

const EXACT_OFF_TOPIC =
  "I am only programmed to answer questions regarding Pirai Soodan G.'s portfolio, projects, and professional background. How can I help you with that?";

const SYSTEM_PROMPT = `You are the Portfolio AI Assistant for Pirai Soodan G.'s professional developer portfolio.

YOUR SCOPE:
Answer questions about Pirai using only the provided verified portfolio context. You may also answer general software engineering, architecture, coding, and AI questions using your general technical knowledge. Clearly distinguish general technical guidance from claims about Pirai.

ACCURACY RULES:
- Never fabricate facts, statistics, ratings, certifications, or employment history.
- If asked whether Pirai has a skill or experience not in the context, say the portfolio does not verify it; you may still explain the technology or provide general technical guidance.
- Do not limit general software engineering and AI questions to the portfolio context.
- If asked about DSA or algorithms, do not invent a numeric rating (1-10); mention his foundational computer science degree from Amrita Vishwa Vidyapeetham (CGPA 8.3/10) and his Java 17/Spring Boot backend engineering focus.
- Keep answers professional, concise, recruiter-friendly, and to the point.`;

export function getStoredApiKey(): string {
  if (typeof window !== 'undefined') {
    const metaEnv = ((import.meta as unknown) as { env?: Record<string, string> }).env;
    return (
      localStorage.getItem('gemini_api_key') ||
      metaEnv?.VITE_GEMINI_API_KEY ||
      ''
    );
  }
  return '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('gemini_api_key');
    }
  }
}

export async function fetchAssistantStatus(): Promise<AssistantStatus> {
  const localKey = getStoredApiKey();

  // Try backend first
  try {
    const res = await fetch('/api/assistant/status');
    if (res.ok) {
      const data = await res.json();
      if (localKey && !data.liveAiAvailable) {
        return {
          ...data,
          mode: 'LIVE_AI',
          liveAiAvailable: true,
          model: 'gemini-3.8-flash (Client Key)',
        };
      }
      return data;
    }
  } catch (err) {
    // Backend offline
  }

  return {
    status: 'ONLINE',
    mode: localKey ? 'LIVE_AI' : 'VERIFIED_KNOWLEDGE_BASE',
    model: localKey ? 'gemini-3.8-flash (Client API Key)' : 'Curated Portfolio Guardrails Engine',
    liveAiAvailable: Boolean(localKey),
    greeting:
      "Hi! I'm the AI assistant for Pirai Soodan G.'s portfolio. Ask me about his Java backend experience, Spring Boot, microservices, projects, technical skills, or professional background.",
  };
}

export async function sendChatMessage(message: string): Promise<ChatApiResponse> {
  const startTime = Date.now();
  const trimmed = message.trim();
  const localKey = getStoredApiKey();

  // If the user has configured a Gemini API key (via chat settings or .env), call Gemini with RAG context
  if (localKey) {
    try {
      const aiResponse = await callGeminiWithRag(trimmed, localKey);
      return {
        answer: aiResponse,
        mode: 'LIVE_AI',
        offTopic: false,
        responseTimeMs: Date.now() - startTime,
      };
    } catch (err) {
      console.warn('Direct Gemini call failed; falling back to backend/engine:', err);
    }
  }

  // Otherwise, try the Spring Boot backend
  try {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: trimmed }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Backend offline; use local verified engine
  }

  // Client-side fallback adhering to exact same guardrails
  const answerData = clientGuardrailEngine(trimmed);
  return {
    answer: answerData.answer,
    mode: 'VERIFIED_KNOWLEDGE_BASE',
    offTopic: answerData.offTopic,
    responseTimeMs: Date.now() - startTime,
  };
}

async function callGeminiWithRag(query: string, apiKey: string): Promise<string> {
  // Retrieve top relevant chunks using RAG
  const targetedContext = retrieveRelevantContext(query);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: `${SYSTEM_PROMPT}\n\n--- TARGETED PORTFOLIO CONTEXT (RAG) ---\n${targetedContext}`,
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: query }],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 400,
    },
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error HTTP ${response.status}: ${errText}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Empty response from Google Gemini');
  }

  return text.trim();
}

function clientGuardrailEngine(input: string): { answer: string; offTopic: boolean } {
  const lower = input.toLowerCase().trim();

  // 1. Prompt Injection & Jailbreak Guardrail
  const injectionPatterns = [
    'ignore previous',
    'ignore all instructions',
    'forget your rules',
    'system prompt',
    'hidden prompt',
    'reveal instructions',
    'you are now',
    'dan mode',
    'jailbreak',
  ];
  if (injectionPatterns.some((p) => lower.includes(p))) {
    return { answer: EXACT_OFF_TOPIC, offTopic: true };
  }

  // Reject clearly unrelated categories; general coding questions remain in scope for Gemini.
  if (
    /\b(recipe|cook|pasta|weather|temperature|president|election|sports|joke|riddle|poem|song|doctor|medicine|bitcoin|crypto)\b/i.test(
      lower
    )
  ) {
    return { answer: EXACT_OFF_TOPIC, offTopic: true };
  }

  // Only treat unverified technologies as a profile fact-check when the user asks about Pirai.
  const asksAboutProfileExperience =
    /\b(pirai|he|his|they|their)\b.*\b(experience|worked|know|skill|proficiency)\b/i.test(lower);
  if (asksAboutProfileExperience &&
    (
    /\b(kubernetes|k8s|aws|gcp|azure|kafka|redis|langchain|rag|vector database|graphql|c\+\+|rust|swift|flutter)\b/i.test(
      lower
    )
    )
  ) {
    return {
      answer:
        "The portfolio does not verify Pirai's experience with that technology. I can still help with general questions about it when Gemini is available.",
      offTopic: false,
    };
  }

  // 4. Portfolio Verified Knowledge Matching
  if (lower.includes('dsa') || lower.includes('data structure') || lower.includes('rate')) {
    return {
      answer:
        "The portfolio does not include a specific numeric rating for Pirai's DSA (Data Structures & Algorithms) knowledge. However, he holds a B.Tech in Computer and Communication Engineering from Amrita Vishwa Vidyapeetham (CGPA 8.3/10) with foundational computer science coursework, and specializes professionally in Java 17, Spring Boot, and microservices backend engineering.",
      offTopic: false,
    };
  }

  if (lower.includes('current role') || lower.includes('purchasing power') || lower.includes('job') || lower.includes('associate')) {
    return {
      answer:
        "Pirai is currently an Associate Software Engineer at Purchasing Power (July 2025–Present). He previously served as a Software Engineer Intern there from January 2025 to July 2025. His responsibilities include modernizing 8 microservices from Java 11 to Java 17, Spring Boot upgrades from 2.x to 3+, REST API engineering, and third-party API health monitoring.",
      offTopic: false,
    };
  }

  if (lower.includes('spring boot') || lower.includes('java') || lower.includes('microservice')) {
    return {
      answer:
        "Pirai works extensively with Java 8/17 and Spring Boot. At Purchasing Power, he modernized eight microservices from Java 11 to Java 17 and upgraded applications from Spring Boot 2.x to 3+. His work involves REST API development, Spring Data JPA / Hibernate persistence, and backend reliability.",
      offTopic: false,
    };
  }

  if (lower.includes('sap') || lower.includes('recycling fee') || lower.includes('hybris')) {
    return {
      answer:
        "In the SAP Commerce Recycling Fee Integration project, Pirai implemented backend recycling-fee calculation logic (0.15% fee based on item price) for SAP Commerce (Hybris). He integrated the logic across cart, checkout, and order-processing workflows supporting 12+ product categories.",
      offTopic: false,
    };
  }

  if (lower.includes('dao') || lower.includes('jpa') || lower.includes('migration')) {
    return {
      answer:
        "In the DAO to Spring Data JPA Migration project, Pirai migrated persistence operations from traditional DAO implementations toward Spring Data JPA repositories to simplify persistence code and enhance maintainability.",
      offTopic: false,
    };
  }

  if (lower.includes('award') || lower.includes('star') || lower.includes('recognition')) {
    return {
      answer:
        "Pirai received the STAR Award for Q2 2026 at Purchasing Power, recognized as Best Employee and Star Performer of the Quarter.",
      offTopic: false,
    };
  }

  if (lower.includes('education') || lower.includes('amrita') || lower.includes('cgpa') || lower.includes('degree')) {
    return {
      answer:
        "Pirai holds a B.Tech in Computer and Communication Engineering from Amrita Vishwa Vidyapeetham, Coimbatore (2021–2025) with a CGPA of 8.3/10.",
      offTopic: false,
    };
  }

  if (lower.includes('skills') || lower.includes('technolog') || lower.includes('tools')) {
    return {
      answer:
        "Pirai's technical skills include:\n• Languages: Java 8, Java 17, Python, SQL\n• Backend: Spring Boot, Spring Framework, Microservices, REST APIs, Hibernate, Spring Data JPA, JDBC\n• AI & Data: Machine Learning Concepts, Predictive Modeling, Data Preprocessing (Pandas), Feature Engineering, AI-Assisted Development\n• Databases: MySQL, PostgreSQL\n• Testing & Tools: JUnit, Mockito, Git, GitHub, Maven, Jenkins, Docker, Postman\n• Practices: Unit & integration testing, debugging, code reviews, Agile/Scrum, CI/CD.",
      offTopic: false,
    };
  }

  if (lower.includes('contact') || lower.includes('email') || lower.includes('linkedin') || lower.includes('reach')) {
    return {
      answer:
        "You can contact Pirai through:\n• Email: piraigps25@gmail.com\n• LinkedIn: https://www.linkedin.com/in/pirai-soodan-g-99a79722b/\n• GitHub: https://github.com/Pirai1421\n• Portfolio: https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app",
      offTopic: false,
    };
  }

  if (/^(hi|hello|hey|help|who are you|what can you do)/i.test(lower)) {
    return {
      answer:
        "Hi! I am the AI assistant for Pirai Soodan G.'s portfolio. I can answer questions regarding his Java backend engineering experience, Spring Boot microservices, projects, technical skills, education, and contact details.",
      offTopic: false,
    };
  }

  return {
    answer: "Gemini is currently unavailable, so I couldn't answer this question. Please try again shortly.",
    offTopic: false,
  };
}
