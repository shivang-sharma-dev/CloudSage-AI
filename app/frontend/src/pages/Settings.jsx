import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Save, Trash2, Download, Moon, Sun, Bell } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { api } from '../api/client';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState(true);
  const [backendHealthy, setBackendHealthy] = useState(null);

  useEffect(() => {
    document.title = 'Settings — CloudSage AI';
    const savedKey = localStorage.getItem('cloudsage_api_key') || '';
    setApiKey(savedKey);
    api.health()
      .then(() => setBackendHealthy(true))
      .catch(() => setBackendHealthy(false));
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('cloudsage_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will clear all local session data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const Section = ({ title, description, children }) => (
    <div className="card p-6">
      <div className="mb-5 pb-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange, id }) => (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-6 rounded-full transition-colors"
      style={{ background: checked ? 'var(--accent-primary)' : '#d1d5db' }}
      id={id}
    >
      <div
        className="absolute w-4 h-4 bg-white rounded-full top-1 transition-all"
        style={{ left: checked ? '22px' : '4px' }}
      />
    </button>
  );

  return (
    <Layout title="Settings" breadcrumb="Settings">
      <div className="p-6 max-w-2xl mx-auto space-y-5">

        {/* API Configuration */}
        <Section
          title="API Configuration"
          description="Configure your Anthropic API key to use live AI analysis."
        >
          <div className="space-y-4">
            <div>
              <label className="form-label flex items-center gap-2">
                <Key size={13} />
                Anthropic API Key
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-ant-api03-..."
                    className="form-input pr-10 font-mono text-sm"
                    id="api-key-input"
                  />
                    <button
                      type="button"
                      onClick={() => setShowKey((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e857e] hover:text-[#d7dbd7] transition-colors"
                    >
                    {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <button
                  onClick={handleSaveApiKey}
                  className="btn-primary px-4 text-sm gap-1.5"
                  id="save-api-key-btn"
                >
                  <Save size={14} />
                  {saved ? 'Saved!' : 'Save'}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Your key is stored locally in your browser. It's never sent to our servers.
                Get your key from{' '}
                <a
                  href="https://console.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  console.anthropic.com
                </a>
              </p>
            </div>

            <div
              className="p-3 rounded-xl text-sm"
              style={{ background: 'rgba(58,140,92,0.08)', border: '1px solid rgba(58,140,92,0.2)' }}
            >
              <p className="font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>
                Backend Status
              </p>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: backendHealthy ? '#4aab6f' : '#c45858' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {backendHealthy === null
                    ? 'Checking backend connectivity...'
                    : backendHealthy
                    ? 'Backend connected and healthy.'
                    : 'Backend unavailable. Check API URL / server status.'}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Display Preferences */}
        <Section
          title="Display Preferences"
          description="Customize the look and feel of CloudSage AI."
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'light' ? <Sun size={16} className="text-[#7e857e]" /> : <Moon size={16} className="text-[#7e857e]" />}
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Theme
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Currently: {theme === 'light' ? 'Light' : 'Dark'} mode
                  </p>
                </div>
              </div>
              <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                {['light', 'dark'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className="px-4 py-1.5 text-sm font-medium capitalize transition-colors"
                    style={{
                      background: theme === t ? 'var(--accent-primary)' : '#151715',
                      color: theme === t ? 'white' : 'var(--text-secondary)',
                    }}
                    id={`theme-${t}-btn`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={16} className="text-[#7e857e]" />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Analysis Notifications
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Show browser notifications when analysis completes
                  </p>
                </div>
              </div>
              <Toggle checked={notifications} onChange={setNotifications} id="notifications-toggle" />
            </div>
          </div>
        </Section>

        {/* Data Management */}
        <Section
          title="Data Management"
          description="Export or clear your local session data."
        >
          <div className="space-y-3">
            <button
              onClick={() => {
                const data = JSON.stringify({ exported: new Date().toISOString() }, null, 2);
                const blob = new Blob([data], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cloudsage-sessions.json';
                a.click();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border transition-all hover:shadow-card"
              style={{ border: '1px solid var(--border-color)', background: '#1a1c1a' }}
              id="export-data-btn"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#151715', border: '1px solid var(--border-color)' }}>
                <Download size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Export All Sessions
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Download all session data as JSON
                </p>
              </div>
            </button>

            {/* Danger zone */}
            <div
              className="p-4 rounded-xl"
              style={{ border: '1px solid rgba(196,88,88,0.4)', background: 'rgba(196,88,88,0.12)' }}
            >
              <p className="text-sm font-bold mb-2" style={{ color: '#dc2626' }}>
                Danger Zone
              </p>
              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: '#a54545' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#8d3a3a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#a54545'}
                id="clear-data-btn"
              >
                <Trash2 size={14} />
                Clear All Local Data
              </button>
              <p className="text-xs mt-2" style={{ color: '#ef4444' }}>
                This will clear all session history and API keys stored in your browser. Cannot be undone.
              </p>
            </div>
          </div>
        </Section>

        {/* About */}
        <Section title="About CloudSage AI">
          <div className="space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {[
              ['Version', '1.0.0'],
              ['Frontend', 'React 18 + Vite + TailwindCSS'],
              ['Backend', 'Python FastAPI + PostgreSQL'],
              ['AI Model', 'claude-sonnet-4-20250514'],
              ['Charts', 'Recharts'],
              ['Icons', 'Lucide React'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{label}</span>
                <span className="font-mono text-xs">{value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
}
