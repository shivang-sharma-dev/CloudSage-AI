import { createContext, useContext, useState, useCallback } from 'react';
import { api } from '../api/client';
import { mockAnalysisResult, mockSessions, mockChatMessages } from '../data/mockData';

const AnalysisContext = createContext(null);

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(mockAnalysisResult);
  const [sessions, setSessions] = useState(mockSessions);
  const [chatMessages, setChatMessages] = useState(mockChatMessages);
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
      // Simulate step progression
      await delay(800);
      setAnalysisStep(2);
      await delay(1200);
      setAnalysisStep(3);

      let result;
      try {
        const response = await api.analyze(payload);
        result = response.data;
        setAnalysisStep(4);
        await delay(600);
      } catch {
        // Backend not available — use mock data with simulated delay
        await delay(1500);
        setAnalysisStep(4);
        await delay(600);
        result = {
          ...mockAnalysisResult,
          id: `session_${Date.now()}`,
          title: `Analysis — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
          created_at: new Date().toISOString(),
        };
      }

      setCurrentAnalysis(result);
      setChatMessages([]);

      // Prepend to sessions list
      setSessions((prev) => [
        {
          id: result.id,
          title: result.title,
          created_at: result.created_at,
          status: 'completed',
          total_monthly_cost: result.total_monthly_cost_usd,
          optimized_monthly_cost: result.optimized_monthly_cost_usd,
          total_savings: result.total_savings_usd,
          savings_percentage: result.savings_percentage,
          overall_health_score: result.health_scores?.overall,
          recommendation_count: result.recommendations?.length,
        },
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

    try {
      let assistantContent;
      try {
        const response = await api.sendChatMessage(currentAnalysis.id, message);
        assistantContent = response.data.content;
      } catch {
        // Mock response
        await delay(1500);
        assistantContent = generateMockChatResponse(message, currentAnalysis);
      }

      const assistantMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: assistantContent,
        created_at: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [currentAnalysis]);

  // ─── Load Sessions ────────────────────────────────────────────────
  const loadSessions = useCallback(async () => {
    try {
      const response = await api.getSessions();
      setSessions(response.data.sessions || response.data);
    } catch {
      setSessions(mockSessions);
    }
  }, []);

  // ─── Load specific session ────────────────────────────────────────
  const loadSession = useCallback(async (id) => {
    const local = sessions.find((s) => s.id === id);
    if (id === mockAnalysisResult.id || !id.startsWith('session_demo')) {
      return mockAnalysisResult;
    }
    try {
      const response = await api.getSession(id);
      return response.data;
    } catch {
      return mockAnalysisResult;
    }
  }, [sessions]);

  // ─── Delete session ───────────────────────────────────────────────
  const deleteSession = useCallback(async (id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    try {
      await api.deleteSession(id);
    } catch {
      // Silently fail for demo
    }
  }, []);

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

const generateMockChatResponse = (message, analysis) => {
  const lowerMsg = message.toLowerCase();
  const savings = analysis.total_savings_usd?.toFixed(0);
  const highRecs = analysis.recommendations?.filter((r) => r.priority === 'high') || [];

  if (lowerMsg.includes('high priority') || lowerMsg.includes('high-priority')) {
    return `Here are your **${highRecs.length} high-priority recommendations**:\n\n${highRecs
      .map((r, i) => `${i + 1}. 🔴 **${r.resource_type} — ${r.resource_name}**\n   ${r.recommendation}\n   💰 Saves **$${r.estimated_savings_usd?.toFixed(0)}/mo**`)
      .join('\n\n')}\n\nThese alone account for most of your potential savings. I'd tackle the easiest ones first to build momentum.`;
  }

  if (lowerMsg.includes('savings plan') || lowerMsg.includes('reserved')) {
    return `**Savings Plans vs Reserved Instances:**\n\n- **Compute Savings Plans** — 35-40% discount, apply across instance families and regions. Most flexible.\n- **EC2 Instance Savings Plans** — up to 40% discount, locked to a specific instance family + region.\n- **Standard RIs** — up to 40% discount, least flexible, but can be sold on the RI Marketplace.\n\nFor your current setup, **Compute Savings Plans** are the best fit since you're planning to rightsize (change instance types). Lock in 60% of your baseline at the current family, keep 40% On-Demand for peak flexibility.`;
  }

  if (lowerMsg.includes('graviton') || lowerMsg.includes('arm')) {
    return 'Migrating to **Graviton3 (ARM)** instances would give you:\n\n- **~20% better performance** per dollar vs. x86 equivalents\n- **~10% lower cost** for same workloads\n- Supported by: ECS Fargate, EC2 (C7g, M7g, R7g families), RDS, Lambda\n\nFor your "m5.xlarge" fleet (after rightsizing), the equivalent is **m7g.xlarge** at ~$0.161/hr vs $0.192/hr — saving approximately **$220/month** additional. Most modern containerized apps work without changes.';
  }

  return `Based on your current infrastructure analysis:\n\n- **Total monthly spend:** $${(analysis.total_monthly_cost_usd || 0).toFixed(0)}\n- **Potential savings:** $${savings}/month ($${(analysis.total_savings_usd * 12).toFixed(0)}/year)\n- **${analysis.recommendations?.length || 0} recommendations** across ${new Set(analysis.recommendations?.map((r) => r.resource_type)).size || 0} service types\n\nWhat specific aspect would you like me to dive deeper into? I can explain any recommendation, model different commitment options, or help you prioritize your optimization roadmap.`;
};
