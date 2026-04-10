import { DollarSign, TrendingDown, Zap, Percent } from 'lucide-react';
import MetricCard from '../shared/MetricCard';
import { formatCurrency } from '../../utils/formatters';

export default function SummaryCards({ analysis }) {
  if (!analysis) return null;

  const {
    total_monthly_cost_usd,
    optimized_monthly_cost_usd,
    total_savings_usd,
    savings_percentage,
  } = analysis;

  const cards = [
    {
      id: 'card-current-spend',
      title: 'Current Monthly Spend',
      value: total_monthly_cost_usd || 0,
      formatValue: (v) => formatCurrency(v),
      icon: DollarSign,
      iconBg: '#f59e0b',
      deltaLabel: 'on-demand pricing',
    },
    {
      id: 'card-potential-savings',
      title: 'Potential Savings',
      value: total_savings_usd || 0,
      formatValue: (v) => formatCurrency(v),
      icon: TrendingDown,
      iconBg: '#10b981',
      deltaLabel: `$${Math.round((total_savings_usd || 0) * 12).toLocaleString()}/year`,
    },
    {
      id: 'card-optimized-spend',
      title: 'Optimized Spend',
      value: optimized_monthly_cost_usd || 0,
      formatValue: (v) => formatCurrency(v),
      icon: Zap,
      iconBg: '#4f6ef7',
      deltaLabel: 'after all recommendations',
    },
    {
      id: 'card-savings-percent',
      title: 'Savings Percentage',
      value: savings_percentage || 0,
      formatValue: (v) => `${v.toFixed(1)}%`,
      icon: Percent,
      iconBg: '#8b5cf6',
      deltaLabel: 'cost reduction potential',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4" id="summary-cards">
      {cards.map((card) => (
        <MetricCard key={card.id} {...card} />
      ))}
    </div>
  );
}
