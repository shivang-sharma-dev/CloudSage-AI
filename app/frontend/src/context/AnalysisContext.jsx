import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../api/client';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState(null);

  // ─── Submit Analysis ──────────────────────────────────────────────
  const submitAnalysis = useCallback(async (payload) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisStep(1);

    try {
      await delay(200);
      setAnalysisStep(2);
      const response = await api.analyze(payload);
      const result = response.data;
      setAnalysisStep(3);
      await delay(120);
      setAnalysisStep(4);
      await delay(120);

      setCurrentAnalysis(result);
      setChatMessages([]);

      // Prepend to sessions list
      setSessions((prev) => [
        toSessionListItem(result),
        ...prev,
      ]);

      return result;
    } catch (err) {
      setError(err.userMessage || 'Analysis failed. Please try again.');
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // ─── Send Chat Message ────────────────────────────────────────────
  const sendChatMessage = useCallback(async (message) => {
    if (!currentAnalysis) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: message,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMessage]);
    setIsChatLoading(true);
    setError(null);

    try {
      const response = await api.sendChatMessage(currentAnalysis.id, message);
      const payload = response.data;
      const assistantContent = payload?.assistant_message?.content || payload?.content;
      if (!assistantContent) {
        throw new Error('Chat response was empty');
      }

      const assistantMessage = {
        id: payload?.assistant_message?.id || `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: assistantContent,
        created_at: payload?.assistant_message?.created_at || new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.userMessage || err.message || 'Chat failed. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  }, [currentAnalysis]);

  // ─── Load Sessions ────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    try {
      const response = await api.getSessions();
      const payload = response.data.sessions || response.data || [];
      setSessions(Array.isArray(payload) ? payload.map(toSessionListItem) : []);
    } catch (err) {
      setError(err.userMessage || 'Failed to load sessions.');
      throw err;
    }
  }, []);

  // ─── Load specific session ────────────────────────────────────────
  const loadSession = useCallback(async (id) => {
    try {
      const response = await api.getSession(id);
      return response.data;
    } catch (err) {
      setError(err.userMessage || 'Failed to load session.');
      throw err;
    }
  }, []);

  // ─── Delete session ───────────────────────────────────────────────
  const deleteSession = useCallback(async (id) => {
    try {
      await api.deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err.userMessage || 'Failed to delete session.');
      throw err;
    }
  }, []);

  useEffect(() => {
    loadSessions().catch(() => {});
  }, [loadSessions]);

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        sessions,
        chatMessages,
        isAnalyzing,
        isChatLoading,
        analysisStep,
        error,
        submitAnalysis,
        sendChatMessage,
        loadSessions,
        loadSession,
        deleteSession,
        setCurrentAnalysis,
        setChatMessages,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error('useAnalysis must be used within AnalysisProvider');
  return ctx;
};

// ─── Helpers ──────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toSessionListItem = (session) => ({
  id: session.id,
  title: session.title,
  created_at: session.created_at,
  status: session.status || 'completed',
  total_monthly_cost: session.total_monthly_cost ?? session.total_monthly_cost_usd ?? 0,
  optimized_monthly_cost: session.optimized_monthly_cost ?? session.optimized_monthly_cost_usd ?? 0,
  total_savings: session.total_savings ?? session.total_savings_usd ?? 0,
  savings_percentage: session.savings_percentage ?? 0,
  overall_health_score: session.overall_health_score ?? session.health_scores?.overall ?? 0,
  recommendation_count: session.recommendation_count ?? session.recommendations?.length ?? 0,
});
