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
    case 'high': return { bg: 'rgba(196,88,88,0.14)', text: '#d18484', border: 'rgba(196,88,88,0.32)' };
    case 'medium': return { bg: 'rgba(181,139,75,0.14)', text: '#c5a167', border: 'rgba(181,139,75,0.32)' };
    case 'low': return { bg: 'rgba(74,171,111,0.14)', text: '#8fd0a8', border: 'rgba(74,171,111,0.32)' };
    default: return { bg: 'rgba(255,255,255,0.05)', text: '#a3aaa3', border: 'rgba(255,255,255,0.12)' };
  }
};

export const getEffortColor = (effort) => {
  switch (effort?.toLowerCase()) {
    case 'easy': return { bg: 'rgba(74,171,111,0.14)', text: '#8fd0a8', border: 'rgba(74,171,111,0.32)' };
    case 'medium': return { bg: 'rgba(163,170,163,0.12)', text: '#b9c0b9', border: 'rgba(163,170,163,0.3)' };
    case 'hard': return { bg: 'rgba(126,133,126,0.18)', text: '#d1d6d1', border: 'rgba(126,133,126,0.35)' };
    default: return { bg: 'rgba(255,255,255,0.05)', text: '#a3aaa3', border: 'rgba(255,255,255,0.12)' };
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
