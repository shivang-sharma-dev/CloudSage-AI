import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Zap, History, Settings, ChevronRight,
  Cloud, Plus, LogOut, Bell
} from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

const navItems = [
  { to: '/analyze', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analyze', icon: Zap, label: 'New Analysis', isAction: true },
  { to: '/history', icon: History, label: 'Session History' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { sessions } = useAnalysis();

  return (
    <aside
      className="flex flex-col h-screen w-64 shrink-0 sticky top-0"
      style={{ background: 'var(--bg-sidebar)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent-primary)' }}
        >
          <Cloud size={18} color="white" />
        </div>
        <div>
          <span className="font-display font-bold text-white text-base leading-none">
            CloudSage
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">AI Platform</span>
        </div>
      </div>

      {/* New Analysis CTA */}
      <div className="px-4 pt-4">
        <button
          onClick={() => navigate('/analyze')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white text-sm font-semibold transition-all"
          style={{ background: 'var(--accent-primary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#3b5bdb'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent-primary)'; }}
          id="sidebar-new-analysis-btn"
        >
          <Plus size={16} />
          New Analysis
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-4 space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        <NavLink
          to="/analyze"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
          id="nav-dashboard"
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
          id="nav-history"
        >
          <History size={18} />
          <span>Session History</span>
          {sessions.length > 0 && (
            <span
              className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: 'rgba(79,110,247,0.2)', color: '#818cf8' }}
            >
              {sessions.length}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar-nav-item ${isActive ? 'active' : ''}`
          }
          id="nav-settings"
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              Recent
            </p>
            {sessions.slice(0, 3).map((session) => (
              <NavLink
                key={session.id}
                to={`/session/${session.id}`}
                className="sidebar-nav-item text-xs"
                id={`nav-session-${session.id}`}
              >
                <Zap size={14} className="shrink-0" />
                <span className="truncate">{session.title}</span>
              </NavLink>
            ))}
            <NavLink
              to="/history"
              className="sidebar-nav-item text-xs text-indigo-400"
            >
              <ChevronRight size={14} />
              <span>View all sessions</span>
            </NavLink>
          </div>
        )}
      </nav>

      {/* User Section */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: 'var(--accent-primary)' }}
          >
            SA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Solutions Architect</p>
            <p className="text-xs text-slate-400 truncate">Pro Plan</p>
          </div>
          <LogOut size={15} className="text-slate-500 hover:text-slate-300 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
