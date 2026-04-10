import { Bell, Search, HelpCircle } from 'lucide-react';

export default function TopNav({ title, breadcrumb }) {
  return (
    <header
      className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b"
      style={{
        background: 'rgba(248, 250, 252, 0.95)',
        borderColor: 'var(--border-color)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left: breadcrumb + title */}
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-400 mb-0.5">{breadcrumb}</p>
        )}
        <h1
          className="font-display font-bold text-lg leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {title || 'CloudSage AI'}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search sessions..."
            className="form-input pl-9 pr-4 py-2 text-sm w-52"
            id="topnav-search"
          />
        </div>

        {/* Help */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
          title="Help"
          id="topnav-help-btn"
        >
          <HelpCircle size={18} className="text-slate-500" />
        </button>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
          title="Notifications"
          id="topnav-notifications-btn"
        >
          <Bell size={18} className="text-slate-500" />
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{ background: 'var(--accent-danger)' }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer"
          style={{ background: 'var(--accent-primary)' }}
          title="Profile"
          id="topnav-avatar"
        >
          SA
        </div>
      </div>
    </header>
  );
}
