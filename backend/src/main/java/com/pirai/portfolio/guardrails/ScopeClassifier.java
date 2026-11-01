package com.pirai.portfolio.guardrails;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Component
public class ScopeClassifier {

    public enum ClassificationResult {
        PROMPT_INJECTION,
        GENERAL_TECHNICAL_QUERY,
        OFF_TOPIC,
        UNVERIFIED_TECHNOLOGY,
        PORTFOLIO_IN_SCOPE
    }

    private static final List<String> INJECTION_PATTERNS = List.of(
            "ignore previous instructions",
            "ignore all instructions",
            "ignore the above",
            "disregard all",
            "forget your rules",
            "system prompt",
            "hidden prompt",
            "reveal instructions",
            "what are your instructions",
            "you are now",
            "dan mode",
            "developer mode",
            "override rules",
            "jailbreak",
            "bypass guardrails",
            "act as an unrestricted",
            "repeat the words above"
    );

    // Off-topic patterns with word boundaries to avoid substring false positives (e.g. "award" -> "war", "purchasing" -> "sing")
    private static final List<Pattern> OFF_TOPIC_PATTERNS = List.of(
            Pattern.compile("(?i)\\b(recipe|cook|cooking|pasta|cake|bake|food)\\b"),
            Pattern.compile("(?i)\\b(weather|temperature|forecast|rain|climate)\\b"),
            Pattern.compile("(?i)\\b(president|election|politics|politician|\\bwar\\b|parliament)\\b"),
            Pattern.compile("(?i)\\b(cricket|football|soccer|tennis|nba|olympics|score)\\b"),
            Pattern.compile("(?i)\\b(joke|riddles?|poems?|song|sing|lyrics|story|stories)\\b"),
            Pattern.compile("(?i)\\b(medical|doctor|symptoms?|diagnosis|medication|pill)\\b"),
            Pattern.compile("(?i)\\b(calculate|derivative|integral|solve equation|\\d+\\s*[+*\\/\\-]\\s*\\d+)\\b"),
            Pattern.compile("(?i)\\b(crypto|bitcoin|ethereum|stock market|shares)\\b"),
            Pattern.compile("(?i)\\b(movies?|celebrity|gossip|cinema)\\b")
    );

    private static final List<Pattern> GENERAL_TECHNICAL_QUERY_PATTERNS = List.of(
            Pattern.compile("(?i)\\b(how would you|how should (?:i|we)|design|architect|architecture|system design|compare|explain)\\b.*\\b(rag|retrieval|vector|ai|software|system|application|api|backend|database|microservice)\\b")
    );

    // Technologies that are explicitly NOT part of Pirai's verified portfolio
    private static final List<Pattern> UNVERIFIED_TECH_PATTERNS = List.of(
            Pattern.compile("(?i)\\b(kubernetes|k8s)\\b"),
            Pattern.compile("(?i)\\b(aws|amazon web services|gcp|google cloud|azure)\\b"),
            Pattern.compile("(?i)\\b(kafka|rabbitmq|redis)\\b"),
            Pattern.compile("(?i)\\b(langchain|rag|vector database|pinecone|chromadb)\\b"),
            Pattern.compile("(?i)\\b(graphql|elasticsearch)\\b"),
            Pattern.compile("(?i)\\b(c\\+\\+|c#|rust|golang|swift|flutter)\\b"),
            Pattern.compile("(?i)\\b(angular|vue|next\\.js|django|flask|terraform)\\b")
    );

    // Verified portfolio keywords indicating relevant inquiry
    private static final List<String> PORTFOLIO_KEYWORDS = List.of(
            "pirai", "soodan", "portfolio", "resume", "cv", "experience", "education",
            "purchasing power", "role", "job", "intern", "associate", "b.tech", "amrita",
            "cgpa", "degree", "star award", "award", "recognition", "microservice", "java 11",
            "java 17", "java 8", "spring boot", "spring data jpa", "jpa", "hibernate",
            "sap commerce", "hybris", "recycling fee", "health check", "api health",
            "spotify", "heart disease", "skills", "technologies", "contact", "email",
            "linkedin", "github", "junit", "mockito", "jenkins", "maven", "docker", "mysql", "postgresql"
    );

    private static final Pattern WORD_PATTERN = Pattern.compile("[\\p{L}\\p{N}]+");

    public ClassificationResult classify(String input) {
        if (input == null || input.isBlank()) {
            return ClassificationResult.OFF_TOPIC;
        }

        String lower = input.toLowerCase(Locale.ROOT).trim();

        // 1. Check for prompt injection / jailbreak attempts
        for (String pattern : INJECTION_PATTERNS) {
            if (lower.contains(pattern)) {
                return ClassificationResult.PROMPT_INJECTION;
            }
        }

        for (Pattern pattern : GENERAL_TECHNICAL_QUERY_PATTERNS) {
            if (pattern.matcher(lower).find()) {
                return ClassificationResult.GENERAL_TECHNICAL_QUERY;
            }
        }

        // Only clearly unrelated topics are rejected locally; coding requests go to the model.
        for (Pattern p : OFF_TOPIC_PATTERNS) {
            if (p.matcher(lower).find()) {
                return ClassificationResult.OFF_TOPIC;
            }
        }

        boolean asksAboutProfileExperience = Pattern.compile(
                "(?i)\\b(pirai|he|his|they|their)\\b.*\\b(experience|worked|know|skill|proficien(?:t|cy))\\b"
        ).matcher(lower).find();
        if (asksAboutProfileExperience) {
            for (Pattern p : UNVERIFIED_TECH_PATTERNS) {
                if (p.matcher(lower).find()) {
                    return ClassificationResult.UNVERIFIED_TECHNOLOGY;
                }
            }
        }

        // Check if query touches on Pirai's verified portfolio, allowing small typos.
        boolean containsPortfolioTerm = PORTFOLIO_KEYWORDS.stream().anyMatch(keyword ->
                lower.contains(keyword) || Stream.of(keyword.split("\\s+"))
                        .anyMatch(word -> word.length() >= 5
                                && hasApproximateWord(lower, word, word.length() >= 8 ? 3 : 1))
        );
        if (containsPortfolioTerm) {
            return ClassificationResult.PORTFOLIO_IN_SCOPE;
        }

        // Common polite greetings and assistant queries
        if (lower.matches("(?i)^(hi|hello|hey|help|who are you|what can you do|about you)[!?.]*$")) {
            return ClassificationResult.PORTFOLIO_IN_SCOPE;
        }

        // Unknown questions should remain eligible for general model assistance.
        return ClassificationResult.GENERAL_TECHNICAL_QUERY;
    }

    public boolean hasApproximateWord(String input, String target, int maxDistance) {
        if (input == null || target == null || input.isBlank() || target.isBlank()) {
            return false;
        }

        var matcher = WORD_PATTERN.matcher(input.toLowerCase(Locale.ROOT));
        String normalizedTarget = target.toLowerCase(Locale.ROOT);
        while (matcher.find()) {
            String word = matcher.group();
            if (word.equals(normalizedTarget)
                    || Math.abs(word.length() - normalizedTarget.length()) <= maxDistance
                    && editDistanceAtMost(word, normalizedTarget, maxDistance)) {
                return true;
            }
        }
        return false;
    }

    private boolean editDistanceAtMost(String left, String right, int maxDistance) {
        int[] previous = new int[right.length() + 1];
        int[] current = new int[right.length() + 1];
        for (int column = 0; column <= right.length(); column++) {
            previous[column] = column;
        }

        for (int row = 1; row <= left.length(); row++) {
            current[0] = row;
            int minimum = current[0];
            for (int column = 1; column <= right.length(); column++) {
                int substitutionCost = left.charAt(row - 1) == right.charAt(column - 1) ? 0 : 1;
                current[column] = Math.min(
                        Math.min(current[column - 1] + 1, previous[column] + 1),
                        previous[column - 1] + substitutionCost
                );
                minimum = Math.min(minimum, current[column]);
            }
            if (minimum > maxDistance) {
                return false;
            }

            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[right.length()] <= maxDistance;
    }
}
