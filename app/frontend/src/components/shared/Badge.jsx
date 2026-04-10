import { getPriorityColor, getEffortColor } from '../../utils/formatters';

export function PriorityBadge({ priority }) {
  const colors = getPriorityColor(priority);
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: colors.text }}
      />
      {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
    </span>
  );
}

export function EffortBadge({ effort }) {
  const colors = getEffortColor(effort);
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {effort?.charAt(0).toUpperCase() + effort?.slice(1)}
    </span>
  );
}

export function CategoryBadge({ category }) {
  const labels = {
    rightsizing: 'Rightsizing',
    reserved: 'Commitments',
    scheduling: 'Scheduling',
    architecture: 'Architecture',
    storage: 'Storage',
  };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: '#f1f5f9',
        color: '#64748b',
        border: '1px solid #e2e8f0',
      }}
    >
      {labels[category] || category}
    </span>
  );
}

export function SeverityBadge({ severity }) {
  const map = {
    high: { bg: '#fef2f2', text: '#dc2626', label: 'High' },
    medium: { bg: '#fffbeb', text: '#d97706', label: 'Medium' },
    low: { bg: '#f0fdf4', text: '#16a34a', label: 'Low' },
  };
  const s = map[severity?.toLowerCase()] || map.low;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      {s.label}
    </span>
  );
}

export function ScoreBadge({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const bg = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2';
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold font-mono-numbers"
      style={{ background: bg, color }}
    >
      {score}
    </span>
  );
}

export default PriorityBadge;
