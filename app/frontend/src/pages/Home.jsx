import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Check, Star, ChevronRight,
  Brain, PieChart, Activity, MessageSquare, History, FileText,
  Upload, Cpu, TrendingDown, ExternalLink, Link2, Globe, Zap, Cloud
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  mockTestimonials, pricingTiers, featureItems,
  trustCompanies, howItWorksSteps, heroChartData
} from '../data/mockData';

// ─── Icon map ──────────────────────────────────────────────────────────
const ICON_MAP = {
  Brain, PieChart, Activity, MessageSquare, History, FileText,
  Upload, Cpu, TrendingDown,
};

// ─── Intersection Observer Hook ────────────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15, ...options }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ─── Navbar ────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #e2e8f0' : 'none',
        boxShadow: scrolled ? '0 1px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" id="nav-logo">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
            <Cloud size={16} color="white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
            CloudSage <span style={{ color: 'var(--accent-primary)' }}>AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Pricing', 'Docs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link to="/analyze" className="hidden md:block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Sign in
          </Link>
          <Link
            to="/analyze"
            className="btn-primary text-sm px-5 py-2.5"
            id="nav-cta-btn"
          >
            Start Free Analysis
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────
function HeroSection() {
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setChartVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative overflow-hidden grid-pattern"
      style={{
        background: 'linear-gradient(160deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      {/* Gradient blobs */}
      <div
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4f6ef7, transparent)' }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="animate-fade-up">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: 'rgba(79,110,247,0.08)',
                border: '1px solid rgba(79,110,247,0.2)',
                color: 'var(--accent-primary)',
              }}
            >
              <Zap size={12} />
              Powered by Claude AI · claude-sonnet-4
            </div>

            <h1
              className="font-display font-extrabold leading-[1.1] mb-6"
              style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)' }}
            >
              Optimize Your{' '}
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #4f6ef7, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AWS Costs
              </span>{' '}
              with AI
            </h1>

            <p
              className="text-lg leading-relaxed mb-8 max-w-xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              CloudSage AI analyzes your infrastructure configs, identifies cost inefficiencies, and delivers
              actionable optimization recommendations — all in under 30 seconds.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link
                to="/analyze"
                className="btn-primary text-base px-7 py-3.5"
                id="hero-primary-cta"
              >
                Start Free Analysis
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="btn-outline text-base px-7 py-3.5"
                id="hero-secondary-cta"
              >
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['#4f6ef7', '#10b981', '#f59e0b', '#8b5cf6'].map((bg, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: bg }}
                  >
                    {['SA', 'CE', 'DO', 'PE'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                  ))}
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Loved by <strong style={{ color: 'var(--text-primary)' }}>500+</strong> Solutions Architects
                </p>
              </div>
            </div>
          </div>

          {/* Right: Floating dashboard card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="animate-float"
              style={{
                width: '100%',
                maxWidth: '420px',
                filter: 'drop-shadow(0 24px 48px rgba(79,110,247,0.18))',
              }}
            >
              <div className="card p-6" style={{ borderRadius: '20px' }}>
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      AWS Monthly Spend
                    </p>
                    <p
                      className="text-3xl font-bold font-mono-numbers mt-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      $12,480
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded-full text-xs font-bold"
                    style={{ background: '#f0fdf4', color: '#16a34a' }}
                  >
                    ↓ 30% potential
                  </div>
                </div>

                {/* Bar chart */}
                {chartVisible && (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={heroChartData} barGap={8}>
                      <XAxis
                        dataKey="service"
                        tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip
                        formatter={(v) => [`$${v.toLocaleString()}`, 'Spend']}
                        contentStyle={{
                          background: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontFamily: 'Plus Jakarta Sans',
                        }}
                        cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                      />
                      <Bar
                        dataKey="cost"
                        radius={[6, 6, 0, 0]}
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {heroChartData.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {/* Mini stats row */}
                <div
                  className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  {[
                    { label: 'Savings', value: '$3,744', color: '#10b981' },
                    { label: 'Optimized', value: '$8,736', color: '#4f6ef7' },
                    { label: 'Health', value: '62/100', color: '#f59e0b' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center">
                      <p
                        className="font-bold font-mono-numbers text-sm"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ─────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="py-10" style={{ background: 'white', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
          Trusted by engineers at
        </p>
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-14">
          {trustCompanies.map((company) => (
            <span
              key={company}
              className="font-display font-bold text-xl opacity-30 hover:opacity-60 transition-opacity cursor-default"
              style={{ color: 'var(--text-primary)' }}
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────────────────
function FeaturesSection() {
  const [ref, inView] = useInView();

  return (
    <section id="features" className="py-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,110,247,0.08)', color: 'var(--accent-primary)' }}
          >
            Features
          </span>
          <h2
            className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Everything you need to{' '}
            <span style={{ color: 'var(--accent-primary)' }}>cut AWS costs</span>
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            CloudSage AI combines real-time analysis, AI recommendations, and beautiful visualizations into one platform.
          </p>
        </div>

        {/* Feature cards grid */}
        <div ref={ref} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureItems.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon] || Zap;
            return (
              <div
                key={feature.id}
                className="card p-6 card-hover opacity-0-init"
                style={{
                  animation: inView ? `fadeUp 0.6s ease-out ${i * 100}ms forwards` : 'none',
                }}
                id={`feature-card-${feature.id}`}
              >
                <div
                  className="feature-icon mb-4"
                  style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}cc)` }}
                >
                  <Icon size={22} color="white" />
                </div>
                <h3
                  className="font-display font-bold text-lg mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Product Demo Section ──────────────────────────────────────────────
function ProductDemoSection() {
  const [ref, inView] = useInView();

  const bulletPoints = [
    'AI-powered recommendations prioritized by dollar impact',
    'Before vs. after cost comparison charts',
    'Architecture health scoring across 4 dimensions',
    'Natural language follow-up chat with full context',
    'Session history and PDF export for stakeholders',
    'Supports EC2, RDS, S3, ECS, NAT GW, ALB',
  ];

  return (
    <section className="py-24" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div
            className="opacity-0-init"
            style={{ animation: inView ? 'fadeUp 0.6s ease-out forwards' : 'none' }}
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
              style={{ background: 'rgba(79,110,247,0.08)', color: 'var(--accent-primary)' }}
            >
              Product Demo
            </span>
            <h2
              className="font-display font-extrabold text-4xl leading-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Discover the power of{' '}
              <span style={{ color: 'var(--accent-primary)' }}>
                real-time cost intelligence
              </span>
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Paste your infrastructure config and get a complete cost optimization analysis in seconds.
              No AWS credentials required — just the resource specs.
            </p>
            <ul className="space-y-3 mb-8">
              {bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'var(--accent-success)' }}
                  >
                    <Check size={12} color="white" strokeWidth={3} />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{point}</span>
                </li>
              ))}
            </ul>
            <Link to="/analyze" className="btn-primary" id="demo-cta-btn">
              Try It Free — No Sign Up
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Dashboard mockup */}
          <div
            className="opacity-0-init"
            style={{ animation: inView ? 'fadeUp 0.6s ease-out 200ms forwards' : 'none' }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: '1px solid var(--border-color)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              }}
            >
              {/* Mock browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}
              >
                <div className="w-3 h-3 rounded-full" style={{ background: '#ef4444' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
                <div
                  className="flex-1 h-6 rounded text-xs font-mono flex items-center px-3 ml-2"
                  style={{ background: 'white', color: '#94a3b8' }}
                >
                  cloudsage.ai/analyze
                </div>
              </div>

              {/* Mock dashboard content */}
              <div style={{ background: 'var(--bg-primary)', padding: '16px' }}>
                {/* Summary cards */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[
                    { label: 'Monthly Spend', value: '$12,480', color: '#f59e0b' },
                    { label: 'Savings', value: '$3,744', color: '#10b981' },
                    { label: 'Optimized', value: '$8,736', color: '#4f6ef7' },
                    { label: 'Saved %', value: '30%', color: '#8b5cf6' },
                  ].map((card, i) => (
                    <div key={i} className="card p-2.5">
                      <p className="text-xs text-slate-400 truncate">{card.label}</p>
                      <p className="font-bold font-mono-numbers text-sm mt-0.5" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 card p-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Before vs After</p>
                    <div className="flex items-end gap-1.5 h-16">
                      {[['#4f6ef7', 80], ['#10b981', 48], ['#4f6ef7', 60], ['#10b981', 43], ['#4f6ef7', 26], ['#10b981', 20]].map(([color, h], i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t"
                          style={{ height: `${h}%`, background: color, opacity: 0.85 }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-3 mt-2">
                      {[['#4f6ef7', 'Current'], ['#10b981', 'Projected']].map(([c, l]) => (
                        <div key={l} className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded" style={{ background: c }} />
                          <span className="text-xs text-slate-400">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card p-3">
                    <p className="text-xs font-semibold text-slate-400 mb-2">Health Score</p>
                    <div className="text-center">
                      <p className="text-3xl font-bold font-mono-numbers" style={{ color: '#f59e0b' }}>62</p>
                      <p className="text-xs text-slate-400 mt-1">Fair</p>
                    </div>
                    {['Cost', 'Reliability', 'Security', 'Scale'].map((label, i) => (
                      <div key={label} className="mt-1.5">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-xs text-slate-400">{label}</span>
                          <span className="text-xs font-mono-numbers">{[45, 70, 78, 65][i]}</span>
                        </div>
                        <div className="h-1 rounded-full" style={{ background: '#f1f5f9' }}>
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${[45, 70, 78, 65][i]}%`,
                              background: ['#f59e0b', '#10b981', '#10b981', '#f59e0b'][i],
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────
function HowItWorksSection() {
  const [ref, inView] = useInView();

  return (
    <section id="how-it-works" className="py-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,110,247,0.08)', color: 'var(--accent-primary)' }}
          >
            How It Works
          </span>
          <h2
            className="font-display font-extrabold text-4xl leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            From config to savings in{' '}
            <span style={{ color: 'var(--accent-primary)' }}>30 seconds</span>
          </h2>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div
            className="absolute top-10 left-1/3 right-1/3 h-0.5 hidden md:block"
            style={{ background: 'linear-gradient(90deg, var(--accent-primary), #818cf8)' }}
          />

          {howItWorksSteps.map((step, i) => {
            const Icon = ICON_MAP[step.icon] || Zap;
            return (
              <div
                key={step.step}
                className="flex flex-col items-center text-center opacity-0-init"
                style={{ animation: inView ? `fadeUp 0.6s ease-out ${i * 150}ms forwards` : 'none' }}
              >
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'white',
                      border: '2px solid var(--border-color)',
                      boxShadow: '0 4px 20px rgba(79,110,247,0.1)',
                    }}
                  >
                    <Icon size={30} style={{ color: 'var(--accent-primary)' }} />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white font-mono-numbers"
                    style={{ background: 'var(--accent-primary)' }}
                  >
                    {step.step}
                  </div>
                </div>
                <h3
                  className="font-display font-bold text-xl mb-3"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const [ref, inView] = useInView();
  const rows = [mockTestimonials.slice(0, 3), mockTestimonials.slice(3, 6)];

  return (
    <section className="py-24" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,110,247,0.08)', color: 'var(--accent-primary)' }}
          >
            Testimonials
          </span>
          <h2
            className="font-display font-extrabold text-4xl leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Loved by Solutions Architects worldwide
          </h2>
        </div>

        <div ref={ref} className="space-y-6">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="grid md:grid-cols-3 gap-6">
              {row.map((testimonial, i) => (
                <div
                  key={testimonial.id}
                  className="card p-6 relative card-hover opacity-0-init"
                  style={{
                    animation: inView
                      ? `fadeUp 0.6s ease-out ${(rowIdx * 3 + i) * 80}ms forwards`
                      : 'none',
                  }}
                  id={`testimonial-${testimonial.id}`}
                >
                  {/* Quote mark */}
                  <div
                    className="absolute top-4 right-5 font-display font-black text-6xl leading-none select-none"
                    style={{ color: '#f1f5f9' }}
                  >
                    "
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-sm leading-relaxed mb-5 relative z-10"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                      style={{ background: testimonial.avatarBg }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                        {testimonial.name}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {testimonial.role} · {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ───────────────────────────────────────────────────
function PricingSection() {
  const [ref, inView] = useInView();

  return (
    <section id="pricing" className="py-24" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{ background: 'rgba(79,110,247,0.08)', color: 'var(--accent-primary)' }}
          >
            Pricing
          </span>
          <h2
            className="font-display font-extrabold text-4xl leading-tight mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Plans that pay for themselves
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            The average CloudSage user saves $3,500/month. The math is easy.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <div
              key={tier.name}
              className="card p-7 relative opacity-0-init flex flex-col"
              style={{
                animation: inView ? `fadeUp 0.6s ease-out ${i * 100}ms forwards` : 'none',
                border: tier.highlighted
                  ? '2px solid var(--accent-primary)'
                  : '1px solid var(--border-color)',
                boxShadow: tier.highlighted ? '0 8px 30px rgba(79,110,247,0.15)' : 'var(--shadow-card)',
              }}
              id={`pricing-tier-${tier.name.toLowerCase()}`}
            >
              {tier.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: 'var(--accent-primary)' }}
                >
                  {tier.badge}
                </div>
              )}

              <div className="mb-5">
                <p className="font-display font-bold text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  {tier.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-6">
                {tier.price === 0 ? (
                  <p className="font-display font-extrabold text-4xl" style={{ color: 'var(--text-primary)' }}>
                    Free
                  </p>
                ) : (
                  <div className="flex items-end gap-1">
                    <span className="font-display font-extrabold text-4xl" style={{ color: 'var(--text-primary)' }}>
                      ${tier.price}
                    </span>
                    <span className="text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      /{tier.period}
                    </span>
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: tier.highlighted ? 'var(--accent-primary)' : '#f1f5f9',
                      }}
                    >
                      <Check
                        size={10}
                        color={tier.highlighted ? 'white' : '#64748b'}
                        strokeWidth={3}
                      />
                    </div>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/analyze"
                className={tier.highlighted ? 'btn-primary w-full justify-center' : 'btn-outline w-full justify-center'}
                id={`pricing-cta-${tier.name.toLowerCase()}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section
      className="py-20"
      style={{
        background: 'linear-gradient(135deg, #3b5bdb 0%, #4f6ef7 50%, #818cf8 100%)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2
          className="font-display font-extrabold text-white mb-4"
          style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', lineHeight: 1.2 }}
        >
          Start optimizing your AWS spend today
        </h2>
        <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
          Join hundreds of Solutions Architects who've already reduced their AWS bills by 30% or more.
          No credit card required.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 bg-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
            style={{ color: 'var(--accent-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
            id="cta-banner-btn"
          >
            Start Free Analysis — No Sign Up
            <ArrowRight size={18} />
          </Link>
        </div>
        <p className="text-indigo-200 text-xs mt-4">
          Free forever · No AWS credentials needed · Results in under 30 seconds
        </p>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────
function Footer() {
  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Docs: ['Getting Started', 'API Reference', 'Examples', 'FAQ'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
  };

  return (
    <footer style={{ background: 'var(--bg-sidebar)' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-primary)' }}>
                <Cloud size={16} color="white" />
              </div>
              <span className="font-display font-bold text-white">CloudSage AI</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              AI-powered AWS cost optimization for Solutions Architects.
            </p>
            <div className="flex gap-3">
              {[ExternalLink, Link2, Globe].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  <Icon size={15} className="text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <p className="text-sm text-slate-500">
            © 2026 CloudSage AI. Built with React + FastAPI + Claude AI.
          </p>
          <p className="text-xs text-slate-600">
            Stack: React · Vite · TailwindCSS · Python FastAPI · PostgreSQL · AWS ECS
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    document.title = 'CloudSage AI — AWS Cost Optimization Platform';
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      <Navbar />
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <ProductDemoSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTABanner />
      <Footer />
    </div>
  );
}
