import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrencyShort, formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const savings = payload[0]?.value - payload[1]?.value;
    return (
      <div className="card px-4 py-3" style={{ boxShadow: 'none' }}>
        <p className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs mb-1">
            <div className="w-2.5 h-2.5 rounded" style={{ background: p.fill }} />
            <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
            <span className="font-bold font-mono-numbers" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(p.value, 0)}
            </span>
          </div>
        ))}
        {savings > 0 && (
          <div
            className="mt-2 pt-2 border-t text-xs font-semibold"
            style={{ borderColor: 'var(--border-color)', color: 'var(--accent-success)' }}
          >
            Saves {formatCurrency(savings, 0)}/mo
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function BeforeAfterChart({ beforeAfterData }) {
  if (!beforeAfterData || beforeAfterData.length === 0) return null;

  return (
    <div className="card p-5" id="before-after-chart">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            Before vs After Optimization
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Projected cost savings by service
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: '#3a8c5c' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ background: '#4aab6f' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Projected</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={beforeAfterData} barGap={4} barCategoryGap="25%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#252925"
            vertical={false}
          />
          <XAxis
            dataKey="service"
            tick={{ fontSize: 12, fill: '#8f968f', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrencyShort}
            tick={{ fontSize: 11, fill: '#7e857e', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="current"
            name="Current"
            fill="#3a8c5c"
            radius={[6, 6, 0, 0]}
            animationBegin={0}
            animationDuration={900}
          />
          <Bar
            dataKey="projected"
            name="Projected"
            fill="#4aab6f"
            radius={[6, 6, 0, 0]}
            animationBegin={0}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
