import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sendChatMessage } from '../services/assistantService';

describe('assistantService Gemini routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends general AI architecture questions to Gemini with the current model and RAG context', async () => {
    localStorage.setItem('gemini_api_key', 'test-api-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Use retrieval-augmented generation.' }] } }],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const response = await sendChatMessage(
      'How would you design a production RAG system for a portfolio assistant?'
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toContain('/models/gemini-3.8-flash:generateContent');
    const requestBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(requestBody.system_instruction.parts[0].text).toContain(
      'Do not limit general software engineering and AI questions to the portfolio context.'
    );
    expect(response).toMatchObject({
      answer: 'Use retrieval-augmented generation.',
      mode: 'LIVE_AI',
      offTopic: false,
    });
  });

  it('does not classify a general RAG question as an unverified Pirai skill when Gemini is offline', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Backend offline')));

    const response = await sendChatMessage(
      'How would you design a production RAG system for a portfolio assistant?'
    );

    expect(response.mode).toBe('VERIFIED_KNOWLEDGE_BASE');
    expect(response.offTopic).toBe(false);
    expect(response.answer).toContain('Gemini is currently unavailable');
  });
});
