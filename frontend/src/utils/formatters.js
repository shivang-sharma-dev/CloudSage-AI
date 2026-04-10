// ─── Currency ──────────────────────────────────────────────────────
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatCurrencyShort = (value) => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return formatCurrency(value, 0);
};

// ─── Percentages ───────────────────────────────────────────────────
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

// ─── Dates ─────────────────────────────────────────────────────────
export const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(isoString));
};

export const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};

export const formatRelativeTime = (isoString) => {
  if (!isoString) return '—';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(isoString);
};

// ─── Numbers ───────────────────────────────────────────────────────
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

// ─── Priority Colors ───────────────────────────────────────────────
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
    case 'medium': return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
    case 'low': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
    default: return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
  }
};

export const getEffortColor = (effort) => {
  switch (effort?.toLowerCase()) {
    case 'easy': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
    case 'medium': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
    case 'hard': return { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe' };
    default: return { bg: '#f8fafc', text: '#64748b', border: '#e2e8f0' };
  }
};

export const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

export const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Attention';
};
