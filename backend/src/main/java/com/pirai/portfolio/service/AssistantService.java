package com.pirai.portfolio.service;

import com.pirai.portfolio.guardrails.PortfolioKnowledgeBase;
import com.pirai.portfolio.guardrails.RagKnowledgeRetriever;
import com.pirai.portfolio.guardrails.ScopeClassifier;
import com.pirai.portfolio.model.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.time.Period;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

@Service
public class AssistantService {

    private static final Logger log = LoggerFactory.getLogger(AssistantService.class);

    private final PortfolioKnowledgeBase knowledgeBase;
    private final ScopeClassifier scopeClassifier;
    private final GeminiClientService geminiClientService;
    private final RagKnowledgeRetriever ragRetriever;

    public AssistantService(
            PortfolioKnowledgeBase knowledgeBase,
            ScopeClassifier scopeClassifier,
            GeminiClientService geminiClientService,
            RagKnowledgeRetriever ragRetriever
    ) {
        this.knowledgeBase = knowledgeBase;
        this.scopeClassifier = scopeClassifier;
        this.geminiClientService = geminiClientService;
        this.ragRetriever = ragRetriever;
    }

    public boolean isLiveAiConfigured() {
        return geminiClientService.isConfigured();
    }

    public String getAiModel() {
        return geminiClientService.getModel();
    }

    public ChatResponse processChat(String userMessage) {
        long startTime = System.currentTimeMillis();

        if (userMessage == null || userMessage.trim().isBlank()) {
            return ChatResponse.of(
                    knowledgeBase.getExactOffTopicResponse(),
                    "VERIFIED_KNOWLEDGE_BASE",
                    true,
                    System.currentTimeMillis() - startTime
            );
        }

        String trimmed = userMessage.trim();

        // Let Gemini handle intent and scope with RAG-retrieved targeted context
        if (geminiClientService.isConfigured()) {
            try {
                // RAG: retrieve top relevant knowledge chunks to minimize token usage
                String targetedContext = ragRetriever.retrieveContext(trimmed);

                String aiAnswer = geminiClientService.generateCompletion(
                        knowledgeBase.getSystemPrompt(),
                        targetedContext,
                        trimmed
                );
                return ChatResponse.of(
                        aiAnswer,
                        "LIVE_AI",
                        false,
                        System.currentTimeMillis() - startTime
                );
            } catch (Exception e) {
                log.warn("Live Google Gemini generation failed; falling back to curated verified knowledge base: {}", e.getMessage());
            }
        }

        // The local classifier is only used when Gemini is unavailable.
        ScopeClassifier.ClassificationResult classification = scopeClassifier.classify(trimmed);
        if (classification == ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY) {
            String message = geminiClientService.isConfigured()
                    ? "Gemini could not answer this question right now. Check the backend logs for the provider error and try again."
                    : "Live Gemini is not configured. Set GEMINI_API_KEY on the backend and restart it to answer general questions.";
            return ChatResponse.of(
                    message,
                    "VERIFIED_KNOWLEDGE_BASE",
                    false,
                    System.currentTimeMillis() - startTime
            );
        }

        if (classification == ScopeClassifier.ClassificationResult.PROMPT_INJECTION ||
                classification == ScopeClassifier.ClassificationResult.OFF_TOPIC) {
            return ChatResponse.of(
                    knowledgeBase.getExactOffTopicResponse(),
                    "VERIFIED_KNOWLEDGE_BASE",
                    true,
                    System.currentTimeMillis() - startTime
            );
        }

        if (classification == ScopeClassifier.ClassificationResult.UNVERIFIED_TECHNOLOGY) {
            String missingSkillResponse = "I don't have information regarding that specific experience in Pirai Soodan G.'s profile, but I can tell you about their work with Java and Spring Boot microservices.";
            return ChatResponse.of(
                    missingSkillResponse,
                    "VERIFIED_KNOWLEDGE_BASE",
                    false,
                    System.currentTimeMillis() - startTime
            );
        }

        String verifiedAnswer = resolveVerifiedKnowledgeBaseAnswer(trimmed);
        return ChatResponse.of(
                verifiedAnswer,
                "VERIFIED_KNOWLEDGE_BASE",
                false,
                System.currentTimeMillis() - startTime
        );
    }

    private String resolveVerifiedKnowledgeBaseAnswer(String message) {
        String lower = message.toLowerCase(Locale.ROOT);

        if (isExperienceDurationQuestion(message)) {
            Period experience = Period.between(
                    YearMonth.of(2025, 1).atDay(1),
                    YearMonth.now().atDay(1)
            );
            String duration = experience.getYears() + " year"
                    + (experience.getYears() == 1 ? "" : "s") + " and "
                    + experience.getMonths() + " month"
                    + (experience.getMonths() == 1 ? "" : "s");
            return "Based on the dates in his profile, Pirai has about "
                    + duration + " of professional experience as of "
                    + YearMonth.now().format(DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH))
                    + ". He was a Software Engineer Intern from January 2025 to July 2025 "
                    + "and has been an Associate Software Engineer from July 2025 to present.";
        }

        if (lower.contains("dsa") || lower.contains("data structure") || lower.contains("rate")) {
            return "The portfolio does not include a specific numeric rating for Pirai's DSA (Data Structures & Algorithms) knowledge. However, he holds a B.Tech in Computer and Communication Engineering from Amrita Vishwa Vidyapeetham (CGPA 8.3/10) with foundational computer science coursework, and specializes professionally in Java 17, Spring Boot, and microservices backend engineering.";
        }

        if (lower.contains("current role") || lower.contains("purchasing power") || lower.contains("experience") || lower.contains("work as")) {
            return "Pirai is currently an Associate Software Engineer at Purchasing Power (July 2025–Present). He previously served as a Software Engineer Intern there from January 2025 to July 2025. His work focuses on Java backend development, modernizing 8 microservices from Java 11 to 17, Spring Boot upgrades (2.x to 3+), REST APIs, and third-party health monitoring.";
        }

        if (lower.contains("spring boot") || lower.contains("java") || lower.contains("microservice")) {
            return "Pirai specializes in Java (8 and 17) and Spring Boot. At Purchasing Power, he modernized eight microservices from Java 11 to Java 17 and upgraded applications from Spring Boot 2.x to 3+. He develops and integrates REST APIs, implements persistence with Spring Data JPA and Hibernate, and builds reliable backend services.";
        }

        if (lower.contains("sap") || lower.contains("recycling fee") || lower.contains("hybris")) {
            return "In the SAP Commerce Recycling Fee Integration project, Pirai implemented backend recycling-fee calculation logic (0.15% fee based on product price) for SAP Commerce (Hybris). He integrated the calculation across cart, checkout, and order-processing workflows supporting 12+ product categories.";
        }

        if (lower.contains("dao") || lower.contains("jpa") || lower.contains("migration") || lower.contains("hibernate")) {
            return "In the DAO to Spring Data JPA Migration project, Pirai migrated persistence operations from traditional DAO implementations toward Spring Data JPA repositories, significantly simplifying the persistence layer and improving long-term maintainability.";
        }

        if (lower.contains("health") || lower.contains("third-party") || lower.contains("vendor") || lower.contains("monitoring")) {
            return "Pirai implemented health-check monitoring for external third-party vendor APIs at Purchasing Power. This helps identify integration and availability issues early to improve backend service observability and troubleshooting.";
        }

        if (lower.contains("award") || lower.contains("star") || lower.contains("achievement") || lower.contains("recognition")) {
            return "Pirai received the STAR Award for Q2 2026 at Purchasing Power, recognized as Best Employee and Star Performer of the Quarter.";
        }

        if (lower.contains("education") || lower.contains("degree") || lower.contains("amrita") || lower.contains("college") || lower.contains("cgpa")) {
            return "Pirai holds a B.Tech in Computer and Communication Engineering from Amrita Vishwa Vidyapeetham, Coimbatore (2021–2025) with a CGPA of 8.3/10.";
        }

        if (lower.contains("technolog") || lower.contains("skills") || lower.contains("tools") || lower.contains("stack")) {
            return "Pirai's technical skills include:\n• Languages: Java 8, Java 17, Python, SQL\n• Backend: Spring Boot, Spring Framework, Microservices, REST APIs, Hibernate, Spring Data JPA, JDBC\n• AI & Data: Machine Learning Concepts, Predictive Modeling, Data Preprocessing (Pandas), Feature Engineering, AI-Assisted Development\n• Databases: MySQL, PostgreSQL\n• Testing & Tools: JUnit, Mockito, Git, GitHub, Maven, Jenkins, Docker, Postman\n• Practices: Unit & integration testing, debugging, code reviews, Agile/Scrum, CI/CD.";
        }

        if (lower.contains("contact") || lower.contains("email") || lower.contains("reach") || lower.contains("hire") || lower.contains("linkedin") || lower.contains("github")) {
            return "You can contact Pirai through:\n• Email: piraigps25@gmail.com\n• LinkedIn: https://www.linkedin.com/in/pirai-soodan-g-99a79722b/\n• GitHub: https://github.com/Pirai1421\n• Portfolio: https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app";
        }

        if (lower.contains("spotify") || lower.contains("music") || lower.contains("heart") || lower.contains("ml") || lower.contains("machine learning")) {
            return "Pirai has worked on academic/personal machine learning projects using Python, including a Spotify Music Recommendation System exploring recommendation algorithms, and a Heart Disease Prediction classification project.";
        }

        if (lower.matches("(?i)^(hi|hello|hey|help|who are you|what can you do).*")) {
            return "Hi! I am Pirai Soodan G.'s AI portfolio assistant. I can answer questions about his Java backend experience, Spring Boot microservices, projects, technical skills, education, and contact details.";
        }

        return "Pirai Soodan G. is an Associate Software Engineer specializing in Java and Spring Boot backend development. You can ask me about his work at Purchasing Power, microservices modernization, projects like SAP Commerce and Spring Data JPA migration, technical skills, or contact info.";
    }

    private boolean isExperienceDurationQuestion(String message) {
        return scopeClassifier.hasApproximateWord(message, "experience", 3)
                && scopeClassifier.hasApproximateWord(message, "year", 2);
    }
}
