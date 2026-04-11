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
      iconBg: '#4aab6f',
      deltaLabel: 'on-demand pricing',
    },
    {
      id: 'card-potential-savings',
      title: 'Potential Savings',
      value: total_savings_usd || 0,
      formatValue: (v) => formatCurrency(v),
      icon: TrendingDown,
      iconBg: '#4aab6f',
      deltaLabel: `$${Math.round((total_savings_usd || 0) * 12).toLocaleString()}/year`,
    },
    {
      id: 'card-optimized-spend',
      title: 'Optimized Spend',
      value: optimized_monthly_cost_usd || 0,
      formatValue: (v) => formatCurrency(v),
      icon: Zap,
      iconBg: '#3a8c5c',
      deltaLabel: 'after all recommendations',
    },
    {
      id: 'card-savings-percent',
      title: 'Savings Percentage',
      value: savings_percentage || 0,
      formatValue: (v) => `${v.toFixed(1)}%`,
      icon: Percent,
      iconBg: '#7e857e',
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
