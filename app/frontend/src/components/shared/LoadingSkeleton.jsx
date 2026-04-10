export function CardSkeleton({ className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
      <div className="skeleton h-7 w-32 rounded mb-2" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className={`skeleton h-4 rounded`} style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function ChartSkeleton({ height = 200, className = '' }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="skeleton h-4 w-32 rounded mb-4" />
      <div
        className="flex items-end gap-3 justify-around"
        style={{ height }}
      >
        {[70, 45, 85, 60, 40, 90].map((h, i) => (
          <div
            key={i}
            className="skeleton rounded-t flex-1"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

export default CardSkeleton;
