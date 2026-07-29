import { useNavigate } from "react-router";
import {
  Sparkles,
  Users,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  BarChart3,
  HeartPulse,
  LineChart,
  Megaphone,
  Workflow,
  HelpCircle,
  Sun,
  Moon,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { useThemeContext } from "../contexts/ThemeContext";
import soc2Badge from "../../assets/soc2-compliance.png";
import hipaaBadge from "../../assets/HIPPA-Compliance.png";

export default function PortalSelection() {
  const navigate = useNavigate();
  const { isDarkMode, setIsDarkMode } = useThemeContext();

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex flex-col justify-between selection:bg-primary selection:text-white font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Ambient Glows (Apple-style Event Mesh) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[800px] rounded-full bg-gradient-to-tr from-primary/10 via-rose-500/5 to-blue-500/10 blur-3xl opacity-70 dark:opacity-40" />
      <div className="pointer-events-none absolute top-1/3 -left-40 size-[500px] rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/5 blur-3xl opacity-60 dark:opacity-30" />
      <div className="pointer-events-none absolute bottom-10 -right-40 size-[600px] rounded-full bg-gradient-to-l from-primary/10 to-amber-500/5 blur-3xl opacity-60 dark:opacity-30" />

      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-card/60 backdrop-blur-xl px-6 py-4 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary via-rose-500 to-rose-600 text-primary-foreground font-black text-lg shadow-md shadow-primary/20 ring-1 ring-white/20">
            HC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-foreground">
                HealthCompiler
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary tracking-wide uppercase">
                <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                Workspace Portal
              </span>
            </div>
            <p className="text-xs text-muted-foreground/80 font-normal">Select your operational environment</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-700" />}
          </Button>

          <a
            href="https://intercom.help/health-compiler-inc/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all px-3.5 py-1.5 rounded-full border border-border/60 bg-card/50 hover:bg-card shadow-2xs backdrop-blur-md"
          >
            <HelpCircle className="size-3.5" />
            <span>Help Center</span>
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        
        {/* Apple Event Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card/80 border border-border/50 text-foreground text-xs font-semibold shadow-xs backdrop-blur-md">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>Unified Healthcare Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
            Where would you like to work?
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            Choose your tailored experience below to access redesigned analytics, SmartyPants DPC workflows, or legacy interfaces.
          </p>
        </div>

        {/* 3 Sleek Apple-inspired Workspace Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Insights Redesigned */}
          <div
            onClick={() => navigate("/home")}
            className="group relative flex flex-col justify-between rounded-[28px] border border-border/50 bg-card/70 backdrop-blur-xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_50px_rgba(227,33,104,0.18)] hover:border-primary/50 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

            <div>
              {/* Card Header: Icon + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="grid size-14 place-items-center rounded-[20px] bg-gradient-to-br from-primary via-rose-500 to-rose-600 text-white shadow-lg shadow-primary/25 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-500">
                  <Sparkles className="size-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/25 px-3 py-1 text-[11px] font-bold text-primary tracking-wide">
                  <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                  Recommended
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                Insights Redesigned
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                Next-generation, AI-augmented healthcare intelligence platform. Stratify population risk, track ACO & HCC care gaps, monitor MIPS compliance, and leverage Helix Copilot.
              </p>

              {/* Included Modules Section */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 border-b border-border/40 pb-1.5">
                  <span>Included Modules</span>
                  <span>6 Views</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Engagement & Utilization", icon: BarChart3 },
                    { label: "Utilization Gaps", icon: Activity },
                    { label: "Chronic Risk", icon: HeartPulse },
                    { label: "ACO & HCC Insights", icon: ShieldCheck },
                    { label: "MIPS Nexus", icon: LineChart },
                    { label: "Helix AI Copilot", icon: Sparkles },
                  ].map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-muted/40 hover:bg-muted/70 text-foreground/90 border border-border/40 transition-colors shadow-2xs"
                    >
                      <m.icon className="size-3 text-primary" />
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Apple Action Button */}
            <div className="pt-2">
              <Button
                className="w-full h-12 rounded-2xl text-xs font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 group-hover:shadow-lg transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/home");
                }}
              >
                <span>Launch Insights Redesigned</span>
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Card 2: SmartyPants DPC Hub */}
          <div
            onClick={() => navigate("/smartypants/dashboard")}
            className="group relative flex flex-col justify-between rounded-[28px] border border-border/50 bg-card/70 backdrop-blur-xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.18)] hover:border-blue-500/50 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />

            <div>
              {/* Card Header: Icon + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="grid size-14 place-items-center rounded-[20px] bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-500">
                  <Users className="size-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-wide">
                  <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                  DPC Suite
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                SmartyPants DPC Hub
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                Dedicated Direct Primary Care operating system. Manage patient memberships, community & employer lead pipelines, automated marketing campaigns, and task queues.
              </p>

              {/* Included Modules Section */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 border-b border-border/40 pb-1.5">
                  <span>Included Modules</span>
                  <span>6 Views</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Internal Member CRM", icon: Users },
                    { label: "External Lead Funnel", icon: Zap },
                    { label: "Campaign Center", icon: Megaphone },
                    { label: "Automation Builder", icon: Workflow },
                    { label: "Employer Analytics", icon: BarChart3 },
                    { label: "Tasks & Reminders", icon: Activity },
                  ].map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-muted/40 hover:bg-muted/70 text-foreground/90 border border-border/40 transition-colors shadow-2xs"
                    >
                      <m.icon className="size-3 text-blue-500" />
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Apple Action Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl text-xs font-bold gap-2 border-blue-500/40 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/smartypants/dashboard");
                }}
              >
                <span>Open SmartyPants Hub</span>
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Card 3: Legacy UI Pages */}
          <div
            onClick={() => navigate("/utilization-gaps-classic")}
            className="group relative flex flex-col justify-between rounded-[28px] border border-border/50 bg-card/70 backdrop-blur-xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_50px_rgba(100,116,139,0.18)] hover:border-slate-500/50 hover:-translate-y-2 cursor-pointer overflow-hidden"
          >
            {/* Ambient Background Glow on Hover */}
            <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-slate-500/10 blur-2xl group-hover:bg-slate-500/20 transition-all duration-500" />

            <div>
              {/* Card Header: Icon + Badge */}
              <div className="flex items-center justify-between mb-6">
                <div className="grid size-14 place-items-center rounded-[20px] bg-gradient-to-br from-slate-600 via-zinc-700 to-slate-800 text-white shadow-lg shadow-slate-500/25 ring-1 ring-white/30 group-hover:scale-105 transition-transform duration-500">
                  <Layers className="size-7" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/10 border border-slate-500/25 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-wide">
                  <span className="size-1.5 rounded-full bg-slate-500" />
                  Classic UI
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl font-black text-foreground tracking-tight mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors flex items-center gap-2">
                Legacy UI Pages
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed font-normal mb-6">
                Access classic Action Centre layouts, legacy utilization gap tracking tables, and original home dashboard interfaces for historical compatibility.
              </p>

              {/* Included Modules Section */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70 border-b border-border/40 pb-1.5">
                  <span>Included Modules</span>
                  <span>4 Views</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "Classic Gaps Tracker", icon: Layers },
                    { label: "Classic Action Centre", icon: Activity },
                    { label: "Classic Home Dashboard", icon: BarChart3 },
                    { label: "Cohort Detail View", icon: Users },
                  ].map((m) => (
                    <span
                      key={m.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-muted/40 hover:bg-muted/70 text-foreground/90 border border-border/40 transition-colors shadow-2xs"
                    >
                      <m.icon className="size-3 text-slate-500" />
                      {m.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Apple Action Button */}
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl text-xs font-bold gap-2 border-slate-500/40 text-slate-700 dark:text-slate-300 hover:bg-slate-800 hover:text-white transition-all shadow-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/utilization-gaps-classic");
                }}
              >
                <span>Launch Legacy UI</span>
                <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 bg-card/60 backdrop-blur-xl px-6 py-4 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={soc2Badge} alt="SOC 2 Compliance" className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
          <img src={hipaaBadge} alt="HIPAA Compliance" className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex items-center gap-2">
          <span>©{new Date().getFullYear()} Healthcompiler, Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-normal text-muted-foreground">Powered by</span>
          <span className="text-primary font-extrabold tracking-tight">HealthCompiler</span>
        </div>
      </footer>
    </div>
  );
}
