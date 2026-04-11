import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CloudCog,
  Database,
  LineChart,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const sectionLabelClass =
  "text-[11px] uppercase tracking-[0.22em] text-[#4aab6f] font-medium";

const cardClass = "rounded-2xl border border-white/10 bg-[#1a1c1a]";

const trustLogos = ["AWS", "Stripe", "Notion", "Datadog", "Vercel", "MongoDB"];

const features = [
  {
    icon: CloudCog,
    title: "Automated rightsizing",
    description:
      "Continuously finds oversized compute and storage footprints, then prioritizes recommendations by actual savings potential.",
  },
  {
    icon: Shield,
    title: "Risk-aware recommendations",
    description:
      "Every optimization includes reliability and security impact checks before rollout guidance is generated.",
  },
  {
    icon: Database,
    title: "Coverage across AWS stack",
    description:
      "EC2, RDS, S3, ECS, Lambda, and data services are analyzed in one consistent decision layer.",
  },
];

const steps = [
  {
    title: "Connect AWS accounts",
    description:
      "Use read-only IAM roles to ingest utilization, spend, and reservation data with encrypted transfer.",
  },
  {
    title: "CloudSage models workload behavior",
    description:
      "Signals are normalized and scored to identify low-risk opportunities with measurable cost impact.",
  },
  {
    title: "Ship optimizations with confidence",
    description:
      "Export action plans into your workflow and track savings realized over time in a single dashboard.",
  },
];

const testimonials = [
  {
    quote:
      "CloudSage surfaced 22% savings in our first month without increasing incident risk.",
    name: "Priya Raman",
    role: "Staff Platform Engineer, FinchOps",
  },
  {
    quote:
      "The recommendations are opinionated, technically sound, and easy for senior engineers to trust.",
    name: "Daniel Moore",
    role: "Director of Infrastructure, Northbay",
  },
  {
    quote:
      "We replaced ad-hoc cost reviews with a repeatable operating rhythm the whole team follows.",
    name: "Iris Chen",
    role: "Engineering Manager, ArcScale",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$299",
    subtitle: "per month",
    description: "For growing teams managing one AWS organization.",
    items: ["Up to $100k monthly spend", "Core optimization engine", "Email support"],
  },
  {
    name: "Growth",
    price: "$899",
    subtitle: "per month",
    description: "For multi-team environments shipping cost controls weekly.",
    items: [
      "Up to $500k monthly spend",
      "Advanced policy controls",
      "Slack + Jira integrations",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    subtitle: "annual contract",
    description: "For large organizations with governance and compliance requirements.",
    items: ["Unlimited spend coverage", "Dedicated architect", "SSO/SAML + audit exports"],
  },
];

export default function Home() {
  const navLinks = [
    { label: "Product", href: "#product-demo" },
    { label: "Integrations", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Docs", to: "/settings" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="min-h-screen bg-[#111211] text-[#f3f4f3]">
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111211]/95 backdrop-blur">
          <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 lg:px-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-[#1a1c1a]">
                <Sparkles className="h-4 w-4 text-[#4aab6f]" />
              </div>
              <span className="text-sm font-semibold tracking-wide">CloudSage AI</span>
            </Link>

            <ul className="hidden items-center gap-10 text-sm text-[#c5c8c5] md:flex">
              {navLinks.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link className="border-b border-transparent pb-1 transition hover:border-[#4aab6f] hover:text-[#f3f4f3]" to={item.to}>
                      {item.label}
                    </Link>
                  ) : (
                    <a className="border-b border-transparent pb-1 transition hover:border-[#4aab6f] hover:text-[#f3f4f3]" href={item.href}>
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <Link to="/analyze" className="rounded-md border border-[#3a8c5c] px-4 py-2 text-sm font-medium text-[#4aab6f] transition hover:scale-[1.02] hover:bg-[#3a8c5c]/10">
              Request access
            </Link>
          </nav>
        </header>

        <main>
          <section id="hero" className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-12 lg:px-10">
            <div className="lg:col-span-7">
              <p className={sectionLabelClass}>/ AWS COST INTELLIGENCE</p>
              <h1
                className="mt-6 max-w-3xl text-5xl leading-tight text-[#f5f6f5] md:text-6xl"
                style={{ fontFamily: "'IBM Plex Serif', serif" }}
              >
                Make cloud spend
                <br />
                operationally precise.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#a3a8a3]">
                CloudSage AI helps platform teams eliminate AWS waste with senior-level rigor:
                measurable savings, low-risk changes, and clear implementation pathways.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/analyze" className="inline-flex items-center gap-2 rounded-md bg-[#3a8c5c] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#347e52]">
                  Start analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#product-demo" className="rounded-md border border-[#3a8c5c] px-6 py-3 text-sm font-semibold text-[#4aab6f] transition hover:scale-[1.02] hover:bg-[#3a8c5c]/10">
                  View demo
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`${cardClass} animate-float p-6`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <p className="text-sm font-medium text-[#c3c8c3]">AWS Monthly Cost Breakdown</p>
                  <p className="font-mono text-xs text-[#7c867c]">Updated 2m ago</p>
                </div>
                <div className="space-y-4 pt-5">
                  {[
                    ["EC2", "$48,270", "44%"],
                    ["RDS", "$21,940", "20%"],
                    ["S3", "$16,300", "15%"],
                    ["ECS + Lambda", "$23,810", "21%"],
                  ].map(([name, value, pct]) => (
                    <div key={name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-xl border border-white/10 bg-[#151715] px-4 py-3">
                      <p className="text-sm text-[#c5c9c5]">{name}</p>
                      <p className="font-mono text-sm text-[#f1f3f1]">{value}</p>
                      <p className="font-mono text-xs text-[#4aab6f]">{pct}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-[#3a8c5c]/50 bg-[#3a8c5c]/10 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#7cb58f]">Projected savings</p>
                  <p className="mt-1 font-mono text-2xl text-[#eaf4ed]">$18,420/mo</p>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-white/10">
            <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-6 px-6 py-8 text-sm text-[#8f968f] md:grid-cols-3 lg:grid-cols-6 lg:px-10">
              {trustLogos.map((logo) => (
                <div key={logo} className="border border-white/10 bg-[#1a1c1a] px-4 py-3 text-center tracking-wide">
                  {logo}
                </div>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-10">
            <p className={sectionLabelClass}>/ FEATURES</p>
            <h2 className="mt-4 text-4xl text-[#f3f4f3]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
              Built for production-minded teams
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className={`${cardClass} p-6`}>
                  <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#3a8c5c]/40 bg-[#161816] text-[#4aab6f]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#eff1ef]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#9da39d]">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="product-demo" className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
            <div className={`${cardClass} grid gap-0 overflow-hidden lg:grid-cols-5`}>
              <div className="border-b border-white/10 p-8 lg:col-span-2 lg:border-b-0 lg:border-r">
                <p className={sectionLabelClass}>/ PRODUCT DEMO</p>
                <h3 className="mt-4 text-3xl text-[#f2f3f2]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
                  One dashboard. Clear financial control.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#a0a6a0]">
                  Move from raw billing exports to prioritized actions with a single operational view.
                </p>
              </div>
              <div className="lg:col-span-3 p-8">
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Current run-rate", "$110,320", BarChart3],
                    ["Optimized run-rate", "$91,900", LineChart],
                    ["Savings confidence", "92%", CheckCircle2],
                  ].map(([label, value, Icon]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-[#141614] p-4">
                      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-[#1a1c1a] text-[#4aab6f]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#879087]">{label}</p>
                      <p className="mt-2 font-mono text-2xl text-[#f2f4f2]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="how-it-works" className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
            <p className={sectionLabelClass}>/ HOW IT WORKS</p>
            <h2 className="mt-4 text-4xl text-[#f3f4f3]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
              Structured, risk-aware optimization workflow
            </h2>
            <div className={`${cardClass} mt-10 grid overflow-hidden lg:grid-cols-2`}>
              <div className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
                <div className="grid h-full min-h-[280px] place-content-center rounded-xl border border-white/10 bg-[#141614] p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-2 w-2 rounded-full bg-[#4aab6f]" />
                    <div className="h-px w-20 bg-[#3a8c5c]/60" />
                    <div className="h-2 w-2 rounded-full bg-[#4aab6f]" />
                    <div className="h-px w-20 bg-[#3a8c5c]/60" />
                    <div className="h-2 w-2 rounded-full bg-[#4aab6f]" />
                  </div>
                  <p className="mt-6 text-center text-sm text-[#97a097]">Ingestion → Modeling → Action</p>
                </div>
              </div>
              <div className="divide-y divide-white/10">
                {steps.map((step, index) => (
                  <article key={step.title} className="flex gap-4 p-6">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#161816] font-mono text-xs text-[#7fbf96]">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#edf0ed]">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#9ca39c]">{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
            <p className={sectionLabelClass}>/ TESTIMONIALS</p>
            <h2 className="mt-4 text-4xl text-[#f3f4f3]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
              Trusted by engineering leaders
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {testimonials.map((item) => (
                <article key={item.name} className={`${cardClass} p-6`}>
                  <p className="text-sm leading-relaxed text-[#d3d7d3]">“{item.quote}”</p>
                  <div className="mt-6 border-t border-white/10 pt-4">
                    <p className="text-sm font-semibold text-[#f2f4f2]">{item.name}</p>
                    <p className="text-xs text-[#94a094]">{item.role}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
            <p className={sectionLabelClass}>/ PRICING</p>
            <h2 className="mt-4 text-4xl text-[#f3f4f3]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
              Plans aligned to cloud spend
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pricing.map((plan) => (
                <article
                  key={plan.name}
                  className={`${cardClass} p-6 ${plan.featured ? "border-[#3a8c5c]" : ""}`}
                >
                  <h3 className="text-lg font-semibold text-[#f2f4f2]">{plan.name}</h3>
                  <p className="mt-3 font-mono text-3xl text-[#f4f6f4]">{plan.price}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[#8f968f]">{plan.subtitle}</p>
                  <p className="mt-4 text-sm text-[#a1a8a1]">{plan.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-[#cad0ca]">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-[#4aab6f]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/analyze"
                    className={`mt-8 w-full rounded-md px-4 py-2.5 text-sm font-semibold transition hover:scale-[1.02] ${
                      plan.featured
                        ? "bg-[#3a8c5c] text-white hover:bg-[#347e52]"
                        : "border border-[#3a8c5c] text-[#4aab6f] hover:bg-[#3a8c5c]/10"
                    }`}
                  >
                    Choose {plan.name}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-10">
            <div className={`${cardClass} px-8 py-12 text-center`}>
              <p className={sectionLabelClass}>/ GET STARTED</p>
              <h2 className="mx-auto mt-4 max-w-3xl text-4xl text-[#f3f4f3]" style={{ fontFamily: "'IBM Plex Serif', serif" }}>
                Bring editorial clarity to your cloud cost strategy.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-[#9da49d]">
                Start with one AWS account, validate quick wins, then scale governance across every team.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/analyze" className="rounded-md bg-[#3a8c5c] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-[#347e52]">
                  Book a walkthrough
                </Link>
                <Link to="/settings" className="rounded-md border border-[#3a8c5c] px-6 py-3 text-sm font-semibold text-[#4aab6f] transition hover:scale-[1.02] hover:bg-[#3a8c5c]/10">
                  Read documentation
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-[#8f968f] md:flex-row md:items-center md:justify-between lg:px-10">
            <p>© {new Date().getFullYear()} CloudSage AI. Built for resilient cloud engineering.</p>
            <div className="flex items-center gap-6">
              <a className="transition hover:text-[#d6dbd6]" href="#hero">Security</a>
              <a className="transition hover:text-[#d6dbd6]" href="#hero">Privacy</a>
              <a className="transition hover:text-[#d6dbd6]" href="#hero">Terms</a>
              <Link className="transition hover:text-[#d6dbd6]" to="/history">Status</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
