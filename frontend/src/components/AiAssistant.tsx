import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  X,
  Send,
  Copy,
  Check,
  RotateCcw,
  Shield,
  Minimize2,
  Maximize2,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import { SUGGESTED_QUESTIONS } from '../data/portfolioData';
import {
  fetchAssistantStatus,
  sendChatMessage,
  getStoredApiKey,
  setStoredApiKey,
} from '../services/assistantService';
import { AssistantStatus, ChatMessage } from '../types/portfolio';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AssistantStatus | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySavedToast, setKeySavedToast] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize status and welcome message
  useEffect(() => {
    fetchAssistantStatus().then((s) => {
      setStatus(s);
      setApiKeyInput(getStoredApiKey());
      if (messages.length === 0) {
        setMessages([
          {
            id: 'welcome',
            sender: 'assistant',
            text: s.greeting,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mode: s.liveAiAvailable ? 'LIVE_AI' : 'VERIFIED_KNOWLEDGE_BASE',
          },
        ]);
      }
    });
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized && !showKeyModal) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, showKeyModal]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await sendChatMessage(query);
      const assistantMsg: ChatMessage = {
        id: 'msg-res-' + Date.now(),
        sender: 'assistant',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: result.mode,
        isOffTopic: result.offTopic,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        sender: 'assistant',
        text: "I encountered an error connecting to the AI backend. Please verify your Gemini API key or ask another portfolio question.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: 'VERIFIED_KNOWLEDGE_BASE',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setStoredApiKey(apiKeyInput);
    fetchAssistantStatus().then((s) => setStatus(s));
    setKeySavedToast(true);
    setTimeout(() => {
      setKeySavedToast(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleClearApiKey = () => {
    setStoredApiKey('');
    setApiKeyInput('');
    fetchAssistantStatus().then((s) => setStatus(s));
    setShowKeyModal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text:
          status?.greeting ||
          "Hi! I'm the AI assistant for Pirai Soodan G.'s portfolio. Ask me about his Java backend experience, Spring Boot, microservices, projects, technical skills, or professional background.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: status?.liveAiAvailable ? 'LIVE_AI' : 'VERIFIED_KNOWLEDGE_BASE',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          aria-label="Open Portfolio AI Assistant"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-white dark:bg-dark-900 border-2 border-electric-cyan text-slate-900 dark:text-white shadow-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 group focus:outline-none focus:ring-4 focus:ring-electric-cyan/40"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-electric-cyan"></span>
          </span>
          <Bot className="w-5 h-5 text-electric-cyan group-hover:rotate-12 transition-transform" />
          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline">
            Ask AI Assistant
          </span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 w-[calc(100vw-2rem)] sm:w-[440px] md:w-[480px] bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden ${
            isMinimized ? 'h-14' : 'h-[620px] max-h-[85vh]'
          }`}
          role="region"
          aria-label="Portfolio AI Assistant Chat"
        >
          {/* Header */}
          <div className="bg-slate-100 dark:bg-dark-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-dark-950 border border-electric-cyan/40 flex items-center justify-center text-electric-cyan">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                    Portfolio AI Assistant
                  </span>
                  {/* Mode Badge */}
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      status?.liveAiAvailable
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                        : 'bg-sky-100 dark:bg-sky-950/60 border-sky-500 text-sky-800 dark:text-sky-300'
                    }`}
                  >
                    {status?.liveAiAvailable ? 'LIVE AI' : 'VERIFIED KB'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  RAG-powered portfolio context
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              {/* API Key settings trigger */}
              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                className={`p-1.5 rounded transition-colors ${
                  showKeyModal || status?.liveAiAvailable
                    ? 'text-electric-cyan bg-electric-cyan/10'
                    : 'hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Google Gemini API Key Settings"
                aria-label="Google Gemini API Key Settings"
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleClearHistory}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Restart Session"
                aria-label="Restart Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
                aria-label={isMinimized ? 'Expand Chat' : 'Minimize Chat'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* API Key Modal / Drawer */}
              {showKeyModal && (
                <div className="bg-slate-50 dark:bg-dark-900 p-4 border-b border-slate-200 dark:border-slate-800 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-electric-cyan" />
                      Google Gemini API Key
                    </span>
                    <button
                      onClick={() => setShowKeyModal(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Enter your Gemini API key to activate <strong>Live AI responses</strong> with RAG-retrieved portfolio context. Your key is kept only in your local browser session.
                  </p>
                  <div className="space-y-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-dark-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-electric-cyan"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveApiKey}
                        className="flex-1 py-1.5 rounded-lg bg-electric-cyan text-dark-950 font-semibold text-xs hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1"
                      >
                        {keySavedToast ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </>
                        ) : (
                          <span>Save &amp; Activate Live AI</span>
                        )}
                      </button>
                      {apiKeyInput && (
                        <button
                          onClick={handleClearApiKey}
                          className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-red-500 text-xs transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Scope Disclaimer Banner */}
              <div className="bg-slate-100/60 dark:bg-dark-900/40 border-b border-slate-200 dark:border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-electric-cyan shrink-0" />
                  <span>RAG Contextual Grounding</span>
                </span>
                <span>Optimized Token Usage</span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-500">
                      {msg.sender === 'user' ? (
                        <>
                          <span>You</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-electric-cyan" />
                          <span>AI Assistant</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </>
                      )}
                    </div>

                    <div
                      className={`relative max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed group ${
                        msg.sender === 'user'
                          ? 'bg-electric-blue text-white rounded-br-none shadow-md'
                          : msg.isOffTopic
                          ? 'bg-amber-50 dark:bg-dark-900 border border-amber-300 dark:border-amber-500/30 text-amber-900 dark:text-amber-200 rounded-bl-none'
                          : 'bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Assistant copy button */}
                      {msg.sender === 'assistant' && (
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                          <span className="text-[9px]">
                            {msg.mode === 'LIVE_AI' ? 'Google Gemini (Live)' : 'Verified Knowledge Base'}
                          </span>
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors p-1"
                            title="Copy Answer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 text-[10px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[10px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono text-slate-500">
                      <Bot className="w-3 h-3 text-electric-cyan" />
                      <span>Formulating response with verified context...</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-bl-none p-3.5 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-electric-cyan animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-electric-cyan animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 rounded-full bg-electric-cyan animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions Chips (horizontal scrollable) */}
              <div className="border-t border-slate-200 dark:border-slate-800/80 p-2.5 bg-slate-50 dark:bg-dark-900/60 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 px-1">
                  <span>Suggested portfolio questions:</span>
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      disabled={loading}
                      className="whitespace-nowrap px-2.5 py-1 rounded-md bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-800 hover:border-electric-cyan text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-[11px] transition-colors shrink-0 disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Box */}
              <div className="p-3 bg-white dark:bg-dark-950 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Pirai's Java, Spring Boot, or projects... (Enter to send)"
                  rows={2}
                  maxLength={1000}
                  className="flex-1 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan resize-none"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-xl bg-electric-cyan text-dark-950 hover:bg-cyan-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle-cyan shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
