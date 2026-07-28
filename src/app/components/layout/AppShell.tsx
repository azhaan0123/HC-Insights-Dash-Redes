import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ChevronDown, Search, PanelRight } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { RightAiSidebar } from "../ai/RightAiSidebar";
import { OnboardingTourProvider } from "../../contexts/OnboardingTourContext";
import { AiContextProvider, useAiContext } from "../../contexts/AiContext";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import soc2Badge from "../../../assets/soc2-compliance.png";
import hipaaBadge from "../../../assets/HIPPA-Compliance.png";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  LayoutDashboard,
  BarChart,
  ClipboardCheck,
  Stethoscope,
  LineChart,
  Sparkles,
  Users,
  Target,
  LayoutGrid,
  BookOpen,
} from "lucide-react";

const APPS_MENU = [
  { label: "Dashboards", icon: LayoutDashboard, to: "/engagement", matchPath: "/engagement" },
  { label: "SmartyPants Hub", icon: Users, to: "/smartypants/dashboard", matchPath: "/smartypants" },
  { label: "HCC Insights", icon: BarChart, to: "/hcc", matchPath: "/hcc" },
  { label: "ACO Insights", icon: ClipboardCheck, to: "/aco", matchPath: "/aco" },
  { label: "Patient Outcomes", icon: Stethoscope, to: "/outcomes", matchPath: "/outcomes" },
  { label: "Mips Nexus", icon: LineChart, to: "/mips/dashboard", matchPath: "/mips" },
  { label: "Helix", icon: Sparkles, to: "/ask-hc", matchPath: "/ask-hc" },
  { label: "Employer Insights", icon: Users, to: "/employer/overview", matchPath: "/employer" },
];

function TopBar() {
  const { pathname } = useLocation();
  const [isAppsMenuOpen, setIsAppsMenuOpen] = useState(false);
  const { isOpen: isAiSidebarOpen, setIsOpen: setIsAiSidebarOpen, pendingCount } = useAiContext();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card px-4">
      <SidebarTrigger className="text-muted-foreground" />
      <Separator orientation="vertical" className="!h-5" />

      {/* Search */}
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <input
          type="text"
          placeholder="Search patients, claims, reports…"
          className="h-9 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70 transition-[border-color] duration-150 focus:border-primary/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Popover open={isAppsMenuOpen} onOpenChange={setIsAppsMenuOpen}>
          <PopoverTrigger id="tour-step-12" className="grid size-9 place-items-center rounded-md text-primary outline-none hover:bg-accent transition-colors">
            <LayoutGrid className="size-5" />
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[320px] rounded-xl border bg-card p-4 shadow-lg" sideOffset={8}>
            <div className="grid grid-cols-2 gap-y-6 gap-x-2 py-2">
              {APPS_MENU.map((app) => {
                const isActive = (app.to && pathname.startsWith(app.to)) || (app.matchPath && pathname.startsWith(app.matchPath));
                
                const inner = (
                  <>
                    <app.icon className="size-6 text-foreground transition-colors group-hover:text-primary" strokeWidth={1.5} />
                    <div className="relative">
                      <span className="text-[13px] font-medium text-foreground">{app.label}</span>
                      {isActive && (
                        <div className="absolute -bottom-2 left-0 right-0 h-[3px] rounded-full bg-primary" />
                      )}
                    </div>
                  </>
                );

                const className = "group flex flex-col items-center justify-center gap-2 rounded-lg p-2 outline-none transition-colors hover:bg-accent/40 cursor-pointer";

                return app.to ? (
                  <Link 
                    key={app.label} 
                    to={app.to} 
                    onClick={() => setIsAppsMenuOpen(false)}
                    className={className}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button 
                    key={app.label} 
                    onClick={() => setIsAppsMenuOpen(false)}
                    className={className}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </PopoverContent>
        </Popover>


        <Button
          id="tour-step-17"
          variant="secondary"
          size="sm"
          className="h-9 gap-2 text-primary hover:bg-primary/10 pl-3 pr-3.5 transition-[background-color] duration-150 relative"
          onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
          title="Open Helix AI Copilot"
        >
          <Sparkles className="size-4" />
          <span className="font-medium">Helix</span>
          {pendingCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              {pendingCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t bg-card px-6 py-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-3">
        <img src={soc2Badge} alt="SOC 2 Compliance" className="h-9 w-auto object-contain" />
        <img src={hipaaBadge} alt="HIPAA Compliance" className="h-9 w-auto object-contain" />
      </div>
      <div className="flex items-center gap-2">
        <span>©2025 Healthcompiler, Inc.</span>
        <span className="text-border">·</span>
        <a className="hover:text-primary" href="#">Privacy Policy</a>
        <span className="text-border">·</span>
        <a className="hover:text-primary" href="#">Terms of Service</a>
        <span className="text-border">·</span>
        <a className="hover:text-primary" href="https://intercom.help/health-compiler-inc/en" target="_blank" rel="noopener noreferrer">Help</a>
      </div>
      <div className="flex items-center gap-1.5">
        <span>Powered by</span>
        <span className="text-primary" style={{ fontWeight: 600 }}>HealthCompiler</span>
      </div>
    </footer>
  );
}

function AppShellInner() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-muted/40 flex-row p-0 overflow-hidden relative h-svh max-h-svh">
        <div className="flex-1 flex flex-col min-w-0 h-full min-h-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 min-w-0 flex flex-col overflow-y-auto min-h-0">
            <Outlet />
          </main>
          <Footer />
        </div>
        <RightAiSidebar />
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppShell() {
  return (
    <OnboardingTourProvider>
      <AiContextProvider>
        <AppShellInner />
      </AiContextProvider>
    </OnboardingTourProvider>
  );
}

