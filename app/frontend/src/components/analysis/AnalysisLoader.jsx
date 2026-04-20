import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Parsing configuration', sublabel: 'Reading AWS resource definitions...' },
  { id: 2, label: 'Calling AI analysis engine', sublabel: 'Sending to Claude AI for analysis...' },
  { id: 3, label: 'Computing cost estimates', sublabel: 'Calculating monthly spend per service...' },
  { id: 4, label: 'Generating recommendations', sublabel: 'Building optimization roadmap...' },
];

export default function AnalysisLoader({ currentStep = 1 }) {
  const [progressWidths, setProgressWidths] = useState({});

  useEffect(() => {
    // Animate progress bar for current step
    if (currentStep >= 1) {
      const timeout = setTimeout(() => {
        setProgressWidths(prev => ({
          ...prev,
          [currentStep]: '100%',
        }));
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentStep]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{ background: 'rgba(12, 14, 12, 0.78)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="card p-8 w-full max-w-md animate-scale-in pointer-events-auto"
        style={{ boxShadow: 'none' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(58, 140, 92, 0.16)' }}
          >
            <div
              className="w-6 h-6 rounded-full border-[3px] animate-spin"
              style={{ borderColor: 'transparent', borderTopColor: 'var(--accent-primary)' }}
            />
          </div>
          <div>
            <h3
              className="font-display font-bold text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              Analyzing Infrastructure
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Claude AI is reviewing your config...
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <div key={step.id}>
                <div className="flex items-center gap-3 mb-1.5">
                  {/* Step indicator */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center animate-check-in"
                        style={{ background: 'var(--accent-success)' }}
                      >
                        <CheckCircle size={14} color="white" strokeWidth={2.5} />
                      </div>
                    ) : isActive ? (
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center animate-spin"
                        style={{ borderColor: 'transparent', borderTopColor: 'var(--accent-primary)', background: 'rgba(58,140,92,0.12)' }}
                      />
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full border-2"
                        style={{ borderColor: 'var(--border-color)' }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color: isCompleted
                          ? 'var(--accent-success)'
                          : isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-muted)',
                      }}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {step.sublabel}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar for active step */}
                {isActive && (
                  <div
                    className="ml-9 h-1 rounded-full overflow-hidden"
                    style={{ background: 'var(--border-color)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: progressWidths[step.id] || '0%',
                        background: 'var(--accent-primary)',
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p
          className="text-xs mt-6 text-center"
          style={{ color: 'var(--text-muted)' }}
        >
          Powered by Claude AI · Typically completes in 10–20 seconds
        </p>
      </div>
    </div>
  );
}
