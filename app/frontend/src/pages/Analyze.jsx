import { useState, useEffect } from 'react';
import { MessageSquare, RefreshCw, Download, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ResourceInputForm from '../components/analysis/ResourceInputForm';
import JsonConfigInput from '../components/analysis/JsonConfigInput';
import AnalysisLoader from '../components/analysis/AnalysisLoader';
import ArchitectureHealthScore from '../components/analysis/ArchitectureHealthScore';
import SummaryCards from '../components/dashboard/SummaryCards';
import CostBreakdownChart from '../components/dashboard/CostBreakdownChart';
import BeforeAfterChart from '../components/dashboard/BeforeAfterChart';
import RecommendationsTable from '../components/dashboard/RecommendationsTable';
import ChatPanel from '../components/chat/ChatPanel';
import { SeverityBadge } from '../components/shared/Badge';
import { useAnalysis } from '../context/AnalysisContext';
import { formatDate } from '../utils/formatters';

export default function Analyze() {
  const {
    currentAnalysis,
    sessions,
    isAnalyzing,
    analysisStep,
    error,
    submitAnalysis,
    loadSessions,
  } = useAnalysis();

  const [inputTab, setInputTab] = useState('form');
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    document.title = 'Analysis Dashboard — CloudSage AI';
    if (!currentAnalysis && sessions.length === 0) {
      loadSessions().catch(() => {});
    }
  }, [currentAnalysis, sessions.length, loadSessions]);

  const handleSubmit = async (payload) => {
    await submitAnalysis(payload);
  };

  return (
    <Layout title="Analysis Dashboard" breadcrumb="Analysis">
      <div className="flex h-full">
        {/* ─── Left Panel: Input ──────────────────────────────── */}
        <div
          className="w-[380px] shrink-0 flex flex-col border-r overflow-y-auto"
          style={{ borderColor: 'var(--border-color)', background: '#141614' }}
        >
          <div className="p-5">
            {/* Input tabs */}
            <div
              className="flex rounded-lg p-1 mb-5"
              style={{ background: '#1a1c1a', border: '1px solid var(--border-color)' }}
            >
              {[
                { id: 'form', label: 'Form Input' },
                { id: 'json', label: 'JSON / YAML' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInputTab(tab.id)}
                  className="flex-1 py-2 text-sm font-semibold rounded-md transition-all"
                    style={{
                      background: inputTab === tab.id ? '#111211' : 'transparent',
                      color: inputTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      boxShadow: 'none',
                    }}
                  id={`input-tab-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {inputTab === 'form' ? (
              <ResourceInputForm onSubmit={handleSubmit} isLoading={isAnalyzing} />
            ) : (
              <JsonConfigInput onSubmit={handleSubmit} isLoading={isAnalyzing} />
            )}

            {error && (
              <div
                className="mt-4 p-3 rounded-xl flex items-start gap-2 text-sm"
                style={{ background: 'rgba(196,88,88,0.12)', color: '#d18484', border: '1px solid rgba(196,88,88,0.24)' }}
              >
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}
          </div>

        </div>

        {/* ─── Right Panel: Results ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          {currentAnalysis ? (
            <div className="p-6 space-y-6">
              {/* Results header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className="font-display font-bold text-xl"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {currentAnalysis.title}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Analyzed on {formatDate(currentAnalysis.created_at)} ·{' '}
                    {currentAnalysis.recommendations?.length} recommendations
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="btn-outline text-xs px-3 py-2 gap-1.5"
                    id="export-pdf-btn"
                  >
                    <Download size={14} />
                    Export PDF
                  </button>
                  <button
                    onClick={() => setChatOpen(true)}
                    className="btn-primary text-xs px-3 py-2 gap-1.5"
                    id="open-chat-btn"
                  >
                    <MessageSquare size={14} />
                    Ask CloudSage
                  </button>
                </div>
              </div>

              {/* Risk flags */}
              {currentAnalysis.risk_flags && currentAnalysis.risk_flags.length > 0 && (
                <div className="card p-4" id="risk-flags-card">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
                    Risk Flags
                  </h3>
                  <div className="space-y-2">
                    {currentAnalysis.risk_flags.map((flag, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-sm py-2.5 px-3 rounded-lg"
                        style={{ background: '#151715', border: '1px solid var(--border-color)' }}
                      >
                        <SeverityBadge severity={flag.severity} />
                        <div>
                          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                            {flag.resource}
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}> — {flag.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary cards */}
              <SummaryCards analysis={currentAnalysis} />

              {/* Charts row */}
              <div className="grid lg:grid-cols-2 gap-5">
                <CostBreakdownChart costBreakdown={currentAnalysis.cost_breakdown} />
                <BeforeAfterChart beforeAfterData={currentAnalysis.before_after} />
              </div>

              {/* Architecture health */}
              <ArchitectureHealthScore healthScores={currentAnalysis.health_scores} />

              {/* Recommendations */}
              <RecommendationsTable recommendations={currentAnalysis.recommendations} />
            </div>
          ) : !isAnalyzing ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-10">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(58,140,92,0.1)' }}
              >
                <RefreshCw size={32} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                  Submit your infrastructure config
                </p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Fill out the form on the left and click "Analyze with AI" to get your cost optimization analysis.
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Analysis loader overlay */}
      {isAnalyzing && <AnalysisLoader currentStep={analysisStep} />}

      {/* Chat panel */}
      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Floating chat button */}
      {!chatOpen && currentAnalysis && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 z-20 border border-white/10"
          style={{ background: 'var(--accent-primary)' }}
          id="floating-chat-btn"
        >
          <MessageSquare size={22} color="white" />
        </button>
      )}
    </Layout>
  );
}
