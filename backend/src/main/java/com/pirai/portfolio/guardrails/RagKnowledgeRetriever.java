package com.pirai.portfolio.guardrails;

import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Lightweight RAG (Retrieval-Augmented Generation) Retriever.
 * Splits verified portfolio facts into discrete topical chunks.
 * Matches user query against chunk keywords to retrieve only relevant context,
 * drastically reducing LLM token usage and focusing Gemini's response context.
 */
@Component
public class RagKnowledgeRetriever {

    public record KnowledgeChunk(String id, String topic, List<String> keywords, String content) {}

    private final List<KnowledgeChunk> chunks = new ArrayList<>();

    public RagKnowledgeRetriever() {
        initializeChunks();
    }

    private void initializeChunks() {
        // 1. Role & Professional Experience
        chunks.add(new KnowledgeChunk(
                "exp_associate",
                "Purchasing Power Associate Software Engineer Experience",
                List.of("purchasing power", "role", "associate", "job", "work", "current", "company", "moderniz", "microservice", "java 17", "java 11", "spring boot 3", "experience"),
                """
                ROLE & EMPLOYMENT:
                - Pirai Soodan G. is an Associate Software Engineer at Purchasing Power (July 2025–Present).
                - Modernized 8 microservices from Java 11 to Java 17 and upgraded applications from Spring Boot 2.x to 3+.
                - Developed and integrated REST APIs, supported database integration, code reviews, and deployment readiness.
                - Implemented health-check monitoring for external vendor APIs.
                - Collaborated with QA and DevOps teams on production issue investigations and sprint planning.
                """
        ));

        chunks.add(new KnowledgeChunk(
                "exp_intern",
                "Purchasing Power Software Engineer Internship",
                List.of("intern", "internship", "purchasing power", "hibernate", "past experience"),
                """
                INTERNSHIP EXPERIENCE:
                - Software Engineer Intern at Purchasing Power (January 2025–July 2025).
                - Enhanced Java and Spring Boot backend functionality.
                - Worked with Hibernate persistence, REST APIs, bug fixes, integration testing, and legacy code improvements.
                """
        ));

        // 2. Projects
        chunks.add(new KnowledgeChunk(
                "proj_jpa",
                "DAO to Spring Data JPA Migration Project",
                List.of("dao", "jpa", "spring data jpa", "migration", "persistence", "hibernate", "database", "sql"),
                """
                PROJECT: DAO to Spring Data JPA Migration
                - Migrated enterprise data access from legacy DAO implementations toward declarative Spring Data JPA repositories.
                - Simplified persistence layer, eliminated boilerplate JDBC/Hibernate session code, and improved maintainability.
                - Technologies: Java, Spring Boot, Spring Data JPA, Hibernate, SQL.
                """
        ));

        chunks.add(new KnowledgeChunk(
                "proj_sap",
                "SAP Commerce Recycling Fee Integration Project",
                List.of("sap", "commerce", "hybris", "recycling", "fee", "0.15", "cart", "checkout", "order"),
                """
                PROJECT: SAP Commerce Recycling Fee Integration
                - Implemented backend recycling-fee calculation logic (0.15% fee based on item price) for SAP Commerce (Hybris).
                - Integrated calculation into cart, checkout, and order-processing workflows across 12+ targeted product categories.
                - Technologies: Java, SAP Commerce (Hybris), backend business logic, database integration, REST APIs.
                """
        ));

        chunks.add(new KnowledgeChunk(
                "proj_health",
                "Third-Party API Health Monitoring Project",
                List.of("health", "monitoring", "third-party", "vendor", "api health", "observability", "probe", "downtime"),
                """
                PROJECT: Third-Party API Health Monitoring
                - Implemented periodic automated health-check monitoring for external partner/vendor APIs.
                - Improved backend observability and accelerated troubleshooting of external integration outages.
                - Technologies: Java, Spring Boot, REST APIs, monitoring, and error handling.
                """
        ));

        chunks.add(new KnowledgeChunk(
                "proj_ai_ml",
                "Academic / Personal Machine Learning Projects",
                List.of("spotify", "music", "heart disease", "machine learning", "ml", "python", "recommendation", "prediction"),
                """
                PROJECTS (ACADEMIC / PERSONAL ML):
                1. Spotify Music Recommendation System: Explored song recommendation modeling using Spotify audio dataset and Python.
                2. Heart Disease Prediction: Explored cardiovascular classification modeling using clinical tabular data in Python.
                """
        ));

        // 3. Technical Skills
        chunks.add(new KnowledgeChunk(
                "skills_all",
                "Technical Skills & Tooling",
                List.of("skill", "skills", "technolog", "stack", "languages", "tools", "java", "python", "spring", "mysql", "docker", "jenkins", "git", "junit", "mockito", "dsa", "data structure"),
                """
                TECHNICAL SKILLS:
                - Programming: Java 8, Java 17, Python, SQL.
                - Backend: Spring Boot, Spring Framework, Microservices, REST APIs, Hibernate, Spring Data JPA, JDBC, OOP.
                - AI & Data Engineering: Machine Learning Concepts, Predictive Modeling, Data Preprocessing (Pandas), Feature Engineering, AI-Assisted Development.
                - Databases: MySQL, PostgreSQL, Relational DB concepts.
                - Testing & Tools: JUnit, Mockito, Git, GitHub, Maven, Jenkins, Docker, Postman.
                - Practices: Unit & integration testing, debugging, code reviews, Agile/Scrum, CI/CD.
                - DSA Note: Has foundational computer science knowledge from B.Tech degree; no arbitrary numeric ratings are listed.
                """
        ));

        // 4. Education
        chunks.add(new KnowledgeChunk(
                "education",
                "Academic Education & Degree",
                List.of("education", "degree", "college", "university", "amrita", "cgpa", "b.tech", "cce", "coimbatore", "study"),
                """
                EDUCATION:
                - Degree: B.Tech in Computer and Communication Engineering.
                - Institution: Amrita Vishwa Vidyapeetham, Coimbatore.
                - Period: 2021–2025.
                - CGPA: 8.3/10.
                - Core foundations: Computer science, data structures, algorithms, databases, communication networks.
                """
        ));

        // 5. Recognition
        chunks.add(new KnowledgeChunk(
                "recognition",
                "STAR Award & Recognition",
                List.of("award", "star", "recognition", "honor", "achievement", "performer", "best employee"),
                """
                AWARDS & RECOGNITION:
                - STAR Award — Q2 2026 at Purchasing Power.
                - Recognized as Best Employee and Star Performer of the Quarter for contributions to microservices modernization and backend engineering.
                """
        ));

        // 6. Contact Details
        chunks.add(new KnowledgeChunk(
                "contact",
                "Contact & Professional Links",
                List.of("contact", "email", "reach", "hire", "linkedin", "github", "portfolio", "profile", "connect"),
                """
                CONTACT & PUBLIC PROFILES:
                - Email: piraigps25@gmail.com
                - LinkedIn: https://www.linkedin.com/in/pirai-soodan-g-99a79722b/
                - GitHub: https://github.com/Pirai1421
                - Portfolio: https://portfolio-git-master-pirai-soodan-gs-projects.vercel.app
                """
        ));
    }

    /**
     * Retrieves the top 1-3 most relevant chunks based on query keywords.
     * Returns targeted context (~150-300 tokens) instead of the entire 2000-token knowledge base.
     */
    public String retrieveContext(String query) {
        if (query == null || query.isBlank()) {
            return chunks.get(0).content();
        }

        String lowerQuery = query.toLowerCase(Locale.ROOT);
        String[] queryWords = lowerQuery.split("\\W+");

        // Score each chunk
        Map<KnowledgeChunk, Integer> scoredChunks = new HashMap<>();

        for (KnowledgeChunk chunk : chunks) {
            int score = 0;
            for (String kw : chunk.keywords()) {
                if (lowerQuery.contains(kw)) {
                    score += 4;
                }
                for (String word : queryWords) {
                    if (word.length() > 2 && kw.contains(word)) {
                        score += 1;
                    }
                }
            }
            if (score > 0) {
                scoredChunks.put(chunk, score);
            }
        }

        // If no specific match, fallback to general role + skills chunks
        if (scoredChunks.isEmpty()) {
            return chunks.stream()
                    .filter(c -> c.id().equals("exp_associate") || c.id().equals("skills_all"))
                    .map(KnowledgeChunk::content)
                    .collect(Collectors.joining("\n---\n"));
        }

        // Retrieve top 3 highest scoring chunks
        return scoredChunks.entrySet().stream()
                .sorted(Map.Entry.<KnowledgeChunk, Integer>comparingByValue().reversed())
                .limit(3)
                .map(e -> e.getKey().content())
                .collect(Collectors.joining("\n---\n"));
    }
}
