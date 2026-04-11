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
        background: 'rgba(255,255,255,0.05)',
        color: '#a3aaa3',
        border: '1px solid rgba(255,255,255,0.1)',
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
  const color = score >= 80 ? '#4aab6f' : score >= 60 ? '#b58b4b' : '#c45858';
  const bg = score >= 80 ? 'rgba(74,171,111,0.14)' : score >= 60 ? 'rgba(181,139,75,0.14)' : 'rgba(196,88,88,0.14)';
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-bold font-mono-numbers"
      style={{ background: bg, color, border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {score}
    </span>
  );
}

export default PriorityBadge;
