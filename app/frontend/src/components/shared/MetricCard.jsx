import { useEffect, useRef, useState } from 'react';

function useCountUp(target, duration = 1200, start = 0) {
  const [value, setValue] = useState(start);
  const frameRef = useRef(null);

  useEffect(() => {
    if (target === undefined || target === null) return;
    const startTime = performance.now();
    const diff = target - start;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) ** 2;
      setValue(start + diff * eased);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, start]);

  return value;
}

export default function MetricCard({
  title,
  value,
  prefix = '',
  suffix = '',
  delta,
  deltaLabel,
  icon: Icon,
  iconBg = '#3a8c5c',
  iconColor = 'white',
  className = '',
  animate = true,
  formatValue,
  id,
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animatedValue = useCountUp(animate ? numericValue : null, 1200);
  const displayValue = animate ? animatedValue : numericValue;

  const formattedValue = formatValue
    ? formatValue(displayValue)
    : `${prefix}${Math.round(displayValue).toLocaleString()}${suffix}`;

  return (
    <div
      className="card p-5 flex flex-col gap-3 card-hover"
      id={id}
    >
      <div className="flex items-start justify-between">
        <p
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {title}
        </p>
        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${iconBg}15` }}
          >
            <Icon size={20} style={{ color: iconBg }} />
          </div>
        )}
      </div>

      <div>
        <p
          className="text-2xl font-bold font-mono-numbers leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {formattedValue}
        </p>
        {(delta !== undefined || deltaLabel) && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {delta !== undefined && (
              <span
                className="font-semibold"
                style={{ color: delta >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}
              >
                {delta >= 0 ? '+' : ''}{delta}%{' '}
              </span>
            )}
            {deltaLabel}
          </p>
        )}
      </div>
    </div>
  );
}
