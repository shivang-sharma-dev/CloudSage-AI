import { useState } from 'react';
import { AlertCircle, CheckCircle, Copy } from 'lucide-react';

const SAMPLE_JSON = `{
  "resources": [
    {
      "type": "ec2",
      "name": "prod-api-server",
      "instance_type": "m5.4xlarge",
      "count": 6,
      "region": "us-east-1",
      "usage_hours": 744
    },
    {
      "type": "rds",
      "name": "prod-postgres-db",
      "instance_type": "db.r6g.2xlarge",
      "storage_gb": 500,
      "multi_az": false,
      "region": "us-east-1"
    },
    {
      "type": "s3",
      "name": "prod-assets-bucket",
      "storage_gb": 49152,
      "requests_k": 500,
      "transfer_gb": 200,
      "storage_class": "standard"
    }
  ]
}`;

export default function JsonConfigInput({ onSubmit, isLoading }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [copied, setCopied] = useState(false);

  const validate = (json) => {
    if (!json.trim()) {
      setError(null);
      setIsValid(false);
      return;
    }
    try {
      const parsed = JSON.parse(json);
      if (!parsed.resources && !Array.isArray(parsed)) {
        setError('JSON must contain a "resources" array');
        setIsValid(false);
      } else {
        setError(null);
        setIsValid(true);
      }
    } catch (e) {
      setError(`Invalid JSON: ${e.message}`);
      setIsValid(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    validate(e.target.value);
  };

  const handleLoadSample = () => {
    setValue(SAMPLE_JSON);
    validate(SAMPLE_JSON);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(SAMPLE_JSON);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    try {
      const parsed = JSON.parse(value);
      onSubmit({ ...parsed, input_type: 'json' });
    } catch {
      setError('Failed to parse JSON');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">
            Paste your infrastructure JSON config below
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            id="json-copy-sample-btn"
          >
            {copied ? <CheckCircle size={13} className="text-green-500" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy Sample'}
          </button>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors"
            style={{
              background: 'rgba(79,110,247,0.06)',
              borderColor: 'rgba(79,110,247,0.2)',
              color: 'var(--accent-primary)',
            }}
            id="json-load-sample-btn"
          >
            Load Sample
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={handleChange}
          rows={14}
          placeholder={`Paste JSON or YAML config here...\n\nExample:\n{\n  "resources": [\n    { "type": "ec2", "instance_type": "m5.xlarge", ... }\n  ]\n}`}
          className="w-full p-4 rounded-xl border-1.5 font-mono text-xs leading-relaxed resize-none outline-none transition-all"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            lineHeight: '1.7',
            background: '#0f172a',
            color: '#e2e8f0',
            border: error
              ? '1.5px solid #ef4444'
              : isValid
              ? '1.5px solid #10b981'
              : '1.5px solid #1e293b',
          }}
          id="json-config-textarea"
          spellCheck="false"
        />
        {/* Valid indicator */}
        {(isValid || error) && (
          <div className="absolute top-3 right-3">
            {isValid ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <AlertCircle size={16} className="text-red-400" />
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div
          className="flex items-start gap-2 p-3 rounded-lg text-sm"
          style={{ background: '#fef2f2', color: '#dc2626' }}
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span className="font-mono text-xs">{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || isLoading}
        className="btn-primary w-full justify-center py-3 text-sm"
        id="json-analyze-submit-btn"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing with AI...
          </>
        ) : (
          'Analyze with AI'
        )}
      </button>
    </form>
  );
}
