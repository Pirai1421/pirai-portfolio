package com.pirai.portfolio;

import com.pirai.portfolio.guardrails.ScopeClassifier;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ScopeClassifierTest {

    private final ScopeClassifier classifier = new ScopeClassifier();

    @Test
    void recognizesExperienceQuestionDespiteMultipleTypos() {
        assertEquals(
                ScopeClassifier.ClassificationResult.PORTFOLIO_IN_SCOPE,
                classifier.classify("howw manyy yearr yearrr of expernce he has")
        );
    }

    @Test
    void leavesGeneralAiQuestionsInScopeForTheModel() {
        assertEquals(
                ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY,
                classifier.classify("What are the trade-offs of RAG and fine-tuning for a small assistant?")
        );
    }

    @Test
    void shortCommonWordsDoNotCauseFalsePortfolioMatches() {
        assertEquals(
                ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY,
                classifier.classify("What are the trade-offs of RAG and fine-tuning for a small assistant?")
        );
        assertEquals(
                ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY,
                classifier.classify("How to build a web scraper in Python?")
        );
    }

    @Test
    void doesNotRejectGeneralCodingHowToRequests() {
        assertEquals(
                ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY,
                classifier.classify("How to build a web scraper in Python?")
        );
        assertEquals(
                ScopeClassifier.ClassificationResult.GENERAL_TECHNICAL_QUERY,
                classifier.classify("Howw should I desgn a production RAG system?")
        );
    }
}
