import { Cloud } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

function renderContent(content) {
  // Basic markdown-ish rendering
  const lines = content.split('\n');
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      // inline code
      if (part.includes('`') && !part.startsWith('```')) {
        const codeParts = part.split(/(`[^`]+`)/g);
        return codeParts.map((cp, k) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return (
              <code
                key={k}
                className="px-1 py-0.5 rounded text-xs font-mono-numbers"
                style={{ background: '#f1f5f9', color: '#4f6ef7' }}
              >
                {cp.slice(1, -1)}
              </code>
            );
          }
          return cp;
        });
      }
      return part;
    });

    if (line.startsWith('# ')) {
      return <p key={i} className="font-bold text-base mb-1">{rendered}</p>;
    }
    if (line.match(/^\d+\.\s/)) {
      return <li key={i} className="ml-4 list-decimal">{rendered}</li>;
    }
    if (line.startsWith('- ')) {
      return <li key={i} className="ml-4 list-disc">{rendered}</li>;
    }
    if (!line) {
      return <div key={i} className="h-2" />;
    }
    return <p key={i}>{rendered}</p>;
  });
}

export function UserMessage({ message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div
          className="px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
          style={{
            background: 'var(--accent-primary)',
            color: 'white',
          }}
        >
          {message.content}
        </div>
        <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
          {formatDateTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export function AssistantMessage({ message }) {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1"
        style={{ background: 'rgba(79,110,247,0.1)' }}
      >
        <Cloud size={15} style={{ color: 'var(--accent-primary)' }} />
      </div>

      <div className="max-w-[85%]">
        <div
          className="card px-4 py-3 text-sm leading-relaxed space-y-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {renderContent(message.content)}
        </div>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          CloudSage AI · {formatDateTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(79,110,247,0.1)' }}
      >
        <Cloud size={15} style={{ color: 'var(--accent-primary)' }} />
      </div>
      <div
        className="card px-4 py-3 flex items-center gap-1.5"
        style={{ height: '44px' }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: 'var(--accent-primary)',
              animation: `float 1.2s ease-in-out infinite`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default UserMessage;
