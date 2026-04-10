import { useState, useMemo, Fragment } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Filter } from 'lucide-react';
import { PriorityBadge, EffortBadge, CategoryBadge } from '../shared/Badge';
import { formatCurrency } from '../../utils/formatters';

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export default function RecommendationsTable({ recommendations = [] }) {
  const [sortKey, setSortKey] = useState('priority');
  const [sortDir, setSortDir] = useState('asc');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterEffort, setFilterEffort] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = useMemo(() => {
    let data = [...recommendations];

    // Filter
    if (filterPriority !== 'all') data = data.filter((r) => r.priority === filterPriority);
    if (filterEffort !== 'all') data = data.filter((r) => r.effort === filterEffort);

    // Sort
    data.sort((a, b) => {
      let aVal, bVal;
      if (sortKey === 'priority') {
        aVal = PRIORITY_ORDER[a.priority] ?? 9;
        bVal = PRIORITY_ORDER[b.priority] ?? 9;
      } else if (sortKey === 'savings') {
        aVal = a.estimated_savings_usd;
        bVal = b.estimated_savings_usd;
      } else if (sortKey === 'effort') {
        const effortOrder = { easy: 0, medium: 1, hard: 2 };
        aVal = effortOrder[a.effort] ?? 9;
        bVal = effortOrder[b.effort] ?? 9;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return data;
  }, [recommendations, sortKey, sortDir, filterPriority, filterEffort]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ChevronsUpDown size={13} className="text-slate-400" />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} style={{ color: 'var(--accent-primary)' }} />
      : <ChevronDown size={13} style={{ color: 'var(--accent-primary)' }} />;
  };

  const totalSavings = sorted.reduce((sum, r) => sum + (r.estimated_savings_usd || 0), 0);

  return (
    <div className="card" id="recommendations-table">
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
              Optimization Recommendations
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {sorted.length} recommendation{sorted.length !== 1 ? 's' : ''} · 
              {' '}Total savings: <span className="font-semibold" style={{ color: 'var(--accent-success)' }}>
                {formatCurrency(totalSavings)}/mo
              </span>
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-input py-1.5 text-xs pr-7 w-auto"
              id="rec-filter-priority"
            >
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterEffort}
              onChange={(e) => setFilterEffort(e.target.value)}
              className="form-input py-1.5 text-xs pr-7 w-auto"
              id="rec-filter-effort"
            >
              <option value="all">All effort</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
              {[
                { key: 'priority', label: 'Priority' },
                { key: null, label: 'Resource' },
                { key: null, label: 'Issue' },
                { key: 'savings', label: 'Monthly Savings' },
                { key: 'effort', label: 'Effort' },
                { key: null, label: 'Category' },
              ].map(({ key, label }, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  onClick={key ? () => handleSort(key) : undefined}
                  style={{ cursor: key ? 'pointer' : 'default', whiteSpace: 'nowrap' }}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {key && <SortIcon col={key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">
                  No recommendations match your filters.
                </td>
              </tr>
            ) : (
              sorted.map((rec) => (
                <Fragment key={rec.id}>
                  <tr
                    onClick={() => setExpandedId(expandedId === rec.id ? null : rec.id)}
                    className="border-b cursor-pointer transition-colors"
                    style={{
                      borderColor: 'var(--border-color)',
                      background: expandedId === rec.id ? '#f8fafc' : 'white',
                    }}
                    onMouseEnter={(e) => {
                      if (expandedId !== rec.id) e.currentTarget.style.background = '#fafbfc';
                    }}
                    onMouseLeave={(e) => {
                      if (expandedId !== rec.id) e.currentTarget.style.background = 'white';
                    }}
                  >
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={rec.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>
                          {rec.resource_type}
                        </p>
                        <p className="text-xs truncate max-w-32" style={{ color: 'var(--text-secondary)' }}>
                          {rec.resource_name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs">
                      <p className="text-xs line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                        {rec.issue}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="font-bold text-sm font-mono-numbers"
                        style={{ color: 'var(--accent-success)' }}
                      >
                        {formatCurrency(rec.estimated_savings_usd, 0)}/mo
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <EffortBadge effort={rec.effort} />
                    </td>
                    <td className="px-4 py-3.5">
                      <CategoryBadge category={rec.category} />
                    </td>
                  </tr>

                  {expandedId === rec.id && (
                    <tr style={{ background: '#f8fafc' }}>
                      <td colSpan={6} className="px-6 py-4">
                        <div
                          className="rounded-xl p-4"
                          style={{ background: 'white', border: '1px solid var(--border-color)' }}
                        >
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                Issue Detected
                              </h4>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {rec.issue}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                                AI Recommendation
                              </h4>
                              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                                {rec.recommendation}
                              </p>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-4 mt-3 pt-3 border-t"
                            style={{ borderColor: 'var(--border-color)' }}
                          >
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-slate-400">Est. savings:</span>
                              <span
                                className="text-sm font-bold font-mono-numbers"
                                style={{ color: 'var(--accent-success)' }}
                              >
                                {formatCurrency(rec.estimated_savings_usd)}/mo
                              </span>
                              <span className="text-xs text-slate-400">
                                ({formatCurrency(rec.estimated_savings_usd * 12)}/yr)
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
