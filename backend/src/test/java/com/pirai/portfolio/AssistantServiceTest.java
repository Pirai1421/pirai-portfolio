package com.pirai.portfolio;

import com.pirai.portfolio.guardrails.PortfolioKnowledgeBase;
import com.pirai.portfolio.guardrails.RagKnowledgeRetriever;
import com.pirai.portfolio.guardrails.ScopeClassifier;
import com.pirai.portfolio.model.ChatResponse;
import com.pirai.portfolio.service.AssistantService;
import com.pirai.portfolio.service.GeminiClientService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AssistantServiceTest {

    @Test
    void sendsGeneralAiArchitectureQuestionToConfiguredGemini() {
        PortfolioKnowledgeBase knowledgeBase = new PortfolioKnowledgeBase();
        RagKnowledgeRetriever ragRetriever = new RagKnowledgeRetriever();
        GeminiClientService geminiClientService = mock(GeminiClientService.class);
        String message = "How should I architect a production AI knowledge-base project?";
        when(geminiClientService.isConfigured()).thenReturn(true);
        when(geminiClientService.generateCompletion(anyString(), anyString(), eq(message)))
                .thenReturn("Use a retrieval-augmented generation architecture.");

        AssistantService assistantService = new AssistantService(
                knowledgeBase,
                new ScopeClassifier(),
                geminiClientService,
                ragRetriever
        );

        ChatResponse response = assistantService.processChat(message);

        assertEquals("LIVE_AI", response.mode());
        assertEquals("Use a retrieval-augmented generation architecture.", response.answer());
        verify(geminiClientService).generateCompletion(
                eq(knowledgeBase.getSystemPrompt()),
                anyString(),
                eq(message)
        );
    }

    @Test
    void doesNotMislabelGeneralArchitectureQuestionAsUnverifiedPortfolioExperienceWhenGeminiFails() {
        GeminiClientService geminiClientService = mock(GeminiClientService.class);
        when(geminiClientService.isConfigured()).thenReturn(true);
        when(geminiClientService.generateCompletion(anyString(), anyString(), anyString()))
                .thenThrow(new RuntimeException("Gemini API request failed"));

        AssistantService assistantService = new AssistantService(
                new PortfolioKnowledgeBase(),
                new ScopeClassifier(),
                geminiClientService,
                new RagKnowledgeRetriever()
        );

        ChatResponse response = assistantService.processChat(
                "How would you design a production RAG system for a portfolio assistant?"
        );

        assertTrue(response.answer().contains("Check the backend logs"));
        assertEquals("VERIFIED_KNOWLEDGE_BASE", response.mode());
        assertEquals(false, response.offTopic());
    }

    @Test
    void typoInExperienceDurationQuestionStillReachesGeminiAndUsesVerifiedDatesOnFallback() {
        String message = "howw manyy yearr yearrr of expernce he has";
        GeminiClientService geminiClientService = mock(GeminiClientService.class);
        when(geminiClientService.isConfigured()).thenReturn(true);
        when(geminiClientService.generateCompletion(anyString(), anyString(), eq(message)))
                .thenThrow(new RuntimeException("Gemini API temporarily unavailable"));

        AssistantService assistantService = new AssistantService(
                new PortfolioKnowledgeBase(),
                new ScopeClassifier(),
                geminiClientService,
                new RagKnowledgeRetriever()
        );

        ChatResponse response = assistantService.processChat(message);

        verify(geminiClientService).generateCompletion(anyString(), anyString(), eq(message));
        assertTrue(response.answer().contains("of professional experience as of"));
        assertTrue(response.answer().contains("Software Engineer Intern"));
        assertEquals("VERIFIED_KNOWLEDGE_BASE", response.mode());
        assertEquals(false, response.offTopic());
    }

    @Test
    void treatsUnmatchedGeneralQuestionsAsModelEligibleInsteadOfOffTopic() {
        GeminiClientService geminiClientService = mock(GeminiClientService.class);
        when(geminiClientService.isConfigured()).thenReturn(false);

        AssistantService assistantService = new AssistantService(
                new PortfolioKnowledgeBase(),
                new ScopeClassifier(),
                geminiClientService,
                new RagKnowledgeRetriever()
        );

        ChatResponse response = assistantService.processChat(
                "What are the trade-offs of RAG and fine-tuning for a small assistant?"
        );

        assertTrue(response.answer().contains("Set GEMINI_API_KEY"));
        assertEquals("VERIFIED_KNOWLEDGE_BASE", response.mode());
        assertEquals(false, response.offTopic());
    }

    @Test
    void sendsMisspelledGeneralQuestionToGeminiWithoutRewritingIt() {
        String message = "Howw should I desgn a production RAG system?";
        GeminiClientService geminiClientService = mock(GeminiClientService.class);
        when(geminiClientService.isConfigured()).thenReturn(true);
        when(geminiClientService.generateCompletion(anyString(), anyString(), eq(message)))
                .thenReturn("Use retrieval, grounding, evaluation, and observability.");

        AssistantService assistantService = new AssistantService(
                new PortfolioKnowledgeBase(),
                new ScopeClassifier(),
                geminiClientService,
                new RagKnowledgeRetriever()
        );

        ChatResponse response = assistantService.processChat(message);

        assertEquals("LIVE_AI", response.mode());
        assertEquals("Use retrieval, grounding, evaluation, and observability.", response.answer());
        verify(geminiClientService).generateCompletion(anyString(), anyString(), eq(message));
    }
}
