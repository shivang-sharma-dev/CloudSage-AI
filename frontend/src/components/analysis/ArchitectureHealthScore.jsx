import { useEffect, useRef, useState } from 'react';
import { getScoreColor, getScoreLabel } from '../../utils/formatters';

function GaugeCircle({ score, label, commentary, color, size = 120 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const duration = 1200;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={8}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* Score label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl font-bold font-mono-numbers leading-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {animatedScore}
          </span>
          <span
            className="text-xs font-medium mt-0.5"
            style={{ color }}
          >
            {getScoreLabel(animatedScore)}
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </p>
        {commentary && (
          <p
            className="text-xs mt-1 leading-relaxed max-w-32"
            style={{ color: 'var(--text-secondary)' }}
          >
            {commentary.length > 80 ? commentary.slice(0, 80) + '…' : commentary}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ArchitectureHealthScore({ healthScores }) {
  if (!healthScores) return null;

  const {
    overall,
    cost_efficiency,
    reliability,
    security_posture,
    scalability,
    commentary = {},
  } = healthScores;

  const subScores = [
    { key: 'cost_efficiency', label: 'Cost Efficiency', score: cost_efficiency, commentary: commentary.cost_efficiency },
    { key: 'reliability', label: 'Reliability', score: reliability, commentary: commentary.reliability },
    { key: 'security_posture', label: 'Security', score: security_posture, commentary: commentary.security_posture },
    { key: 'scalability', label: 'Scalability', score: scalability, commentary: commentary.scalability },
  ];

  return (
    <div className="card p-6" id="architecture-health-score-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className="font-display font-bold text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            Architecture Health Score
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            AI-generated composite score across 4 dimensions
          </p>
        </div>
        {/* Overall score badge */}
        <div
          className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl"
          style={{
            background: `${getScoreColor(overall)}15`,
            border: `2px solid ${getScoreColor(overall)}30`,
          }}
        >
          <span
            className="text-3xl font-bold font-mono-numbers leading-none"
            style={{ color: getScoreColor(overall) }}
          >
            {overall}
          </span>
          <span
            className="text-xs font-semibold mt-0.5"
            style={{ color: getScoreColor(overall) }}
          >
            Overall
          </span>
        </div>
      </div>

      {/* Sub-score gauges */}
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {subScores.map((item) => (
          <GaugeCircle
            key={item.key}
            score={item.score || 0}
            label={item.label}
            commentary={item.commentary}
            color={getScoreColor(item.score || 0)}
            size={116}
          />
        ))}
      </div>
    </div>
  );
}
