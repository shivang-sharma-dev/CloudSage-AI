import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash2, MessageSquare, AlertTriangle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ArchitectureHealthScore from '../components/analysis/ArchitectureHealthScore';
import SummaryCards from '../components/dashboard/SummaryCards';
import CostBreakdownChart from '../components/dashboard/CostBreakdownChart';
import BeforeAfterChart from '../components/dashboard/BeforeAfterChart';
import RecommendationsTable from '../components/dashboard/RecommendationsTable';
import ChatPanel from '../components/chat/ChatPanel';
import { SeverityBadge } from '../components/shared/Badge';
import { useAnalysis } from '../context/AnalysisContext';
import { mockAnalysisResult } from '../data/mockData';
import { formatDateTime } from '../utils/formatters';

export default function SessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadSession, deleteSession, setCurrentAnalysis, setChatMessages } = useAnalysis();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    document.title = 'Session Detail — CloudSage AI';
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await loadSession(id);
        setSession(data);
        setCurrentAnalysis(data);
        setChatMessages([]);
      } catch {
        setSession(mockAnalysisResult);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    await deleteSession(id);
    navigate('/history');
  };

  if (loading) {
    return (
      <Layout title="Loading..." breadcrumb="History / Session">
        <div className="flex items-center justify-center h-64">
          <div
            className="w-8 h-8 border-3 rounded-full animate-spin"
            style={{ borderColor: 'var(--border-color)', borderTopColor: 'var(--accent-primary)', borderWidth: '3px' }}
          />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout title="Session Not Found" breadcrumb="History / Session">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p style={{ color: 'var(--text-secondary)' }}>Session not found.</p>
          <Link to="/history" className="btn-primary">Back to History</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={session.title} breadcrumb="History / Session Detail">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/history"
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={16} style={{ color: 'var(--text-secondary)' }} />
            </Link>
            <div>
              <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                {session.title}
              </h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Analyzed on {formatDateTime(session.created_at)} ·{' '}
                {session.recommendations?.length} recommendations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setChatOpen(true)}
              className="btn-outline text-sm gap-1.5"
              id="session-chat-btn"
            >
              <MessageSquare size={15} />
              Chat
            </button>
            <button
              onClick={() => window.print()}
              className="btn-outline text-sm gap-1.5"
              id="session-export-btn"
            >
              <Download size={15} />
              Export PDF
            </button>
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-500">Delete this session?</span>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                  id="confirm-delete-btn"
                >
                  Delete
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                  style={{ background: '#f1f5f9', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="btn-outline text-sm gap-1.5 text-red-400 border-red-200 hover:bg-red-50"
                id="delete-session-btn"
              >
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Risk flags */}
        {session.risk_flags?.length > 0 && (
          <div className="card p-4" id="detail-risk-flags">
            <h3
              className="font-semibold text-sm mb-3 flex items-center gap-2"
              style={{ color: 'var(--text-primary)' }}
            >
              <AlertTriangle size={15} style={{ color: '#f59e0b' }} />
              Risk Flags
            </h3>
            <div className="space-y-2">
              {session.risk_flags.map((flag, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-sm py-2.5 px-3 rounded-lg"
                  style={{ background: '#fafbfc', border: '1px solid var(--border-color)' }}
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

        <SummaryCards analysis={session} />

        <div className="grid lg:grid-cols-2 gap-5">
          <CostBreakdownChart costBreakdown={session.cost_breakdown} />
          <BeforeAfterChart beforeAfterData={session.before_after} />
        </div>

        <ArchitectureHealthScore healthScores={session.health_scores} />
        <RecommendationsTable recommendations={session.recommendations} />
      </div>

      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20"
          style={{ background: 'var(--accent-primary)', boxShadow: '0 4px 20px rgba(79,110,247,0.4)' }}
          id="floating-chat-btn"
        >
          <MessageSquare size={22} color="white" />
        </button>
      )}
    </Layout>
  );
}
