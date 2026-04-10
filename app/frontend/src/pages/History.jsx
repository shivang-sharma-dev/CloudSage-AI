import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Trash2, ChevronRight, Plus, Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { ScoreBadge } from '../components/shared/Badge';
import { useAnalysis } from '../context/AnalysisContext';
import { formatCurrency, formatRelativeTime, formatPercent } from '../utils/formatters';

export default function History() {
  const { sessions, deleteSession } = useAnalysis();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    document.title = 'Session History — CloudSage AI';
  }, []);

  const filtered = useMemo(() => {
    let data = [...sessions];
    if (search) {
      data = data.filter((s) =>
        s.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sortBy === 'date') {
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'savings') {
      data.sort((a, b) => (b.total_savings || 0) - (a.total_savings || 0));
    } else if (sortBy === 'health') {
      data.sort((a, b) => (b.overall_health_score || 0) - (a.overall_health_score || 0));
    }
    return data;
  }, [sessions, search, sortBy]);

  const totalSavingsIdentified = sessions.reduce((s, sess) => s + (sess.total_savings || 0), 0);

  const handleDelete = (id) => {
    deleteSession(id);
    setConfirmDelete(null);
  };

  return (
    <Layout title="Session History" breadcrumb="History">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Stats banner */}
        <div
          className="grid grid-cols-3 gap-4 mb-8 p-5 rounded-2xl"
          style={{ background: '#1a1c1a', color: 'white', border: '1px solid var(--border-color)' }}
          id="history-stats-banner"
        >
          {[
            { label: 'Total Analyses', value: sessions.length, suffix: '' },
            { label: 'Savings Identified', value: formatCurrency(totalSavingsIdentified, 0), suffix: '/mo' },
            { label: 'Avg. Health Score', value: Math.round(sessions.reduce((s, sess) => s + (sess.overall_health_score || 0), 0) / (sessions.length || 1)), suffix: '/100' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl font-bold font-mono-numbers">
                {stat.value}{stat.suffix}
              </p>
              <p className="text-[#8f968f] text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7e857e]" />
            <input
              type="text"
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9 w-full"
              id="history-search"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#7e857e]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input py-2 text-sm w-auto"
              id="history-sort"
            >
              <option value="date">Sort by Date</option>
              <option value="savings">Sort by Savings</option>
              <option value="health">Sort by Health Score</option>
            </select>
          </div>
          <Link
            to="/analyze"
            className="btn-primary text-sm gap-1.5"
            id="history-new-btn"
          >
            <Plus size={15} />
            New Analysis
          </Link>
        </div>

        {/* Sessions list */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <Clock size={36} className="mx-auto mb-3 text-[#7e857e]" />
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {search ? 'No sessions match your search' : 'No analyses yet'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Run your first analysis to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((session) => (
              <div
                key={session.id}
                className="card p-5 card-hover relative"
                id={`history-session-${session.id}`}
              >
                <div className="flex items-start gap-4">
                  {/* Score */}
                  <div className="shrink-0 pt-0.5">
                    <ScoreBadge score={session.overall_health_score || 0} />
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3
                          className="font-display font-bold text-base truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {session.title}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {formatRelativeTime(session.created_at)} ·{' '}
                          {session.recommendation_count} recommendations
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {confirmDelete === session.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-500">Delete?</span>
                            <button
                              onClick={() => handleDelete(session.id)}
                              className="px-2.5 py-1 rounded text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                            >
                              Yes
                            </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-2.5 py-1 rounded text-xs font-semibold"
                                style={{ background: '#1a1c1a', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                              >
                                No
                              </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(session.id)}
                            className="p-1.5 rounded-lg text-[#7e857e] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            id={`delete-session-${session.id}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                        <Link
                          to={`/session/${session.id}`}
                          className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                          style={{
                            background: 'rgba(58,140,92,0.08)',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(58,140,92,0.2)',
                          }}
                          id={`view-session-${session.id}`}
                        >
                          View
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-6 mt-3">
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Current Spend</p>
                        <p className="font-mono-numbers font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(session.total_monthly_cost || 0, 0)}/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Savings Found</p>
                        <p className="font-mono-numbers font-semibold text-sm" style={{ color: 'var(--accent-success)' }}>
                          {formatCurrency(session.total_savings || 0, 0)}/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reduction</p>
                        <p className="font-mono-numbers font-semibold text-sm" style={{ color: 'var(--accent-primary)' }}>
                          {formatPercent(session.savings_percentage || 0)}
                        </p>
                      </div>

                      {/* Savings bar */}
                      <div className="flex-1 hidden md:block">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#252925' }}>
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${session.savings_percentage || 0}%`,
                                background: 'var(--accent-primary)',
                              }}
                            />
                          </div>
                          <span className="text-xs font-mono-numbers" style={{ color: 'var(--text-muted)' }}>
                            {formatPercent(session.savings_percentage || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
