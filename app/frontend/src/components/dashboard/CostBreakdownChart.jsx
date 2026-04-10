import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const COLORS = ['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="card px-4 py-3"
        style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: data.fill || payload[0].fill }}
          />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {data.service}
          </span>
        </div>
        <p className="text-lg font-bold font-mono-numbers" style={{ color: 'var(--text-primary)' }}>
          {formatCurrency(data.monthly_cost)}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {formatPercent(data.percentage)} of total spend
        </p>
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload }) => (
  <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center mt-2">
    {payload?.map((entry, i) => (
      <div key={i} className="flex items-center gap-1.5">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: entry.color }}
        />
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {entry.value}
        </span>
      </div>
    ))}
  </div>
);

export default function CostBreakdownChart({ costBreakdown }) {
  if (!costBreakdown || costBreakdown.length === 0) return null;

  const data = costBreakdown.map((item, i) => ({
    ...item,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="card p-5" id="cost-breakdown-chart">
      <div className="mb-4">
        <h3
          className="font-display font-bold text-base"
          style={{ color: 'var(--text-primary)' }}
        >
          Cost by Service
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
          Monthly spend distribution
        </p>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="48%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            dataKey="monthly_cost"
            nameKey="service"
            animationBegin={0}
            animationDuration={900}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.fill} stroke="none" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Service breakdown list */}
      <div className="border-t pt-3 mt-1 space-y-2" style={{ borderColor: 'var(--border-color)' }}>
        {data.slice(0, 6).map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.fill }}
              />
              <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {item.service}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-16 h-1.5 rounded-full overflow-hidden"
                style={{ background: '#f1f5f9' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.percentage}%`,
                    background: item.fill,
                    transition: 'width 0.8s ease',
                  }}
                />
              </div>
              <span
                className="text-xs font-mono-numbers tabular-nums w-14 text-right"
                style={{ color: 'var(--text-secondary)' }}
              >
                {formatCurrency(item.monthly_cost, 0)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
