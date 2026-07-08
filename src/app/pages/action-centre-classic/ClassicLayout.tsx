import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  HelpCircle,
  ChevronDown,
  LayoutGrid,
  Filter,
  Download,
  Share2,
  ArrowLeftRight,
  Users,
  Activity,
  FileText,
  BadgeDollarSign,
  ClipboardCheck,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";

interface ClassicLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitleNote?: string | null;
  onBack?: () => void;
  backTitle?: string;
  showSwitchToModern?: boolean;
  modernRoute?: string;
  activeNavIndex?: number;
  filterPills?: { label: string; val: string }[];
  filterBar?: React.ReactNode;
  headerActions?: React.ReactNode;
}

export function ClassicLayout({
  children,
  title,
  subtitleNote = "Note: Click a card to view details, cards without data are not clickable.",
  onBack,
  backTitle,
  showSwitchToModern = true,
  modernRoute = "/utilization-gaps",
  activeNavIndex = 0,
  filterPills,
  filterBar,
  headerActions,
}: ClassicLayoutProps) {
  const navigate = useNavigate();

  const navIcons = [
    { icon: Users, label: "Utilization Gaps", path: "/utilization-gaps-classic" },
    { icon: Activity, label: "Engagement & Utilization", path: "/engagement" },
    { icon: FileText, label: "Claims Utilization", path: "/claims" },
    { icon: BadgeDollarSign, label: "Cost Savings", path: "/cost-savings" },
    { icon: ClipboardCheck, label: "Outcomes", path: "/outcomes/dashboard" },
    { icon: MessageSquare, label: "Communication", path: "/communication" },
    { icon: LayoutDashboard, label: "ACO Insights", path: "/aco/overview" },
    { icon: Share2, label: "Coordinated Care", path: "/coordinated-care" },
  ];

  const defaultPills = [
    { label: "Start Date", val: "01-01-2023" },
    { label: "End Date", val: "07-01-2026" },
    { label: "Employer", val: "All Sponsored Patients" },
    { label: "Division", val: "All Divisions" },
    { label: "Physician", val: "All Physicians" },
    { label: "Sender", val: "All Senders" },
  ];

  const pillsToRender = filterPills || defaultPills;

  return (
    <div className="min-h-screen bg-[#f4f6f8] flex flex-col font-sans antialiased text-[#212529]">
      {/* Top White Header Bar - Exact Legacy Palette */}
      <header className="bg-white border-b border-[#dee2e6] px-6 py-2.5 flex items-center justify-between sticky top-0 z-50 shadow-2xs">
        {/* Left Logo */}
        <div
          onClick={() => navigate("/utilization-gaps-classic")}
          className="cursor-pointer flex flex-col leading-tight select-none"
        >
          <span className="text-[#e61952] font-extrabold text-lg tracking-tight font-serif italic">
            ACME DPC
          </span>
          <span className="text-[10px] text-[#6c757d] font-medium tracking-wide">
            Your Logo Here
          </span>
        </div>

        {/* Center Pink Icon Nav Bar */}
        <nav className="hidden xl:flex items-center gap-1 px-4">
          {navIcons.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = idx === activeNavIndex;
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                title={item.label}
                className={`p-2 transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? "text-[#e61952] border-b-2 border-[#e61952] pb-1.5 font-bold"
                    : "text-[#6c757d] hover:text-[#e61952]"
                }`}
              >
                <Icon className="size-5" />
              </button>
            );
          })}
        </nav>

        {/* Right Controls matching screenshots */}
        <div className="flex items-center gap-3">
          {showSwitchToModern && (
            <button
              onClick={() => navigate(modernRoute)}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded bg-[#f8f9fa] hover:bg-[#e9ecef] text-[#495057] border border-[#dee2e6] transition-colors"
              title="Return to Modern Dashboard Layout"
            >
              <ArrowLeftRight className="size-3.5 text-[#6c757d]" />
              <span>Switch to Modern UI</span>
            </button>
          )}

          <button className="p-1.5 rounded text-[#e61952] hover:bg-[#fff0f4] transition-colors">
            <LayoutGrid className="size-5" />
          </button>

          <div className="relative inline-block">
            <button className="flex items-center gap-1.5 px-3 py-1 rounded border border-[#e61952] bg-white hover:bg-[#fff0f4] text-xs font-medium text-[#e61952] transition-colors">
              <span>ACME Health</span>
              <ChevronDown className="size-3.5 text-[#e61952]" />
            </button>
          </div>

          <a
            href="https://intercom.help/health-compiler-inc/en"
            target="_blank"
            rel="noopener noreferrer"
            className="size-7 rounded-full border border-[#dee2e6] flex items-center justify-center text-[#6c757d] hover:bg-[#f8f9fa] transition-colors"
            title="Get Help"
          >
            <HelpCircle className="size-4" />
          </a>

          <div className="size-8 rounded-full bg-[#e61952] text-white font-bold text-xs flex items-center justify-center shadow-2xs cursor-pointer hover:opacity-90">
            HS
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-5 max-w-[1600px] w-full mx-auto flex flex-col gap-4">
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-transparent pb-1">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 text-[#e61952] hover:underline font-bold text-lg mr-1"
              >
                <span>&larr;</span>
                {backTitle && <span className="text-[#495057] font-normal">{backTitle} /</span>}
              </button>
            )}
            <h1 className="text-[#e61952] font-bold text-xl md:text-2xl tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {headerActions ? (
              headerActions
            ) : (
              <>
                {onBack ? (
                  <>
                    <button className="size-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs">
                      <Download className="size-4" />
                    </button>
                    <button className="size-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs">
                      <Share2 className="size-4" />
                    </button>
                  </>
                ) : null}

                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs relative">
                  <Download className="size-3.5 text-[#6c757d]" />
                  <span>Generate Report</span>
                  <span className="absolute -bottom-2 -right-1 bg-[#28a745] text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-wider shadow-2xs">
                    BETA
                  </span>
                </button>

                <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs">
                  <Filter className="size-3.5 text-[#e61952]" />
                  <span>Filters</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Pills Bar - Exact Legacy Palette */}
        {filterBar ? (
          filterBar
        ) : (
          <div className="flex flex-wrap items-center gap-2 py-1">
            {pillsToRender.map((pill, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded bg-[#e9ecef] border border-[#dee2e6] text-xs text-[#495057] font-medium flex items-center gap-1 shadow-2xs select-none"
              >
                <span className="text-[#6c757d]">{pill.label}:</span>
                <span className="font-semibold text-[#212529]">{pill.val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Note Text */}
        {subtitleNote && (
          <p className="text-xs text-[#495057] font-normal">
            {subtitleNote}
          </p>
        )}

        {/* Page Children */}
        <div className="flex-1 flex flex-col gap-6 mt-1">
          {children}
        </div>
      </main>

      {/* Classic Footer - Exact Legacy Palette (#f8f9fa background) */}
      <footer className="bg-[#f8f9fa] border-t border-[#dee2e6] px-6 py-4 mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6c757d] font-normal">
          {/* Left Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#dee2e6] bg-white font-bold text-[10px] text-[#343a40] tracking-wider shadow-2xs">
              <span className="size-2 rounded-full bg-[#007bff]"></span>
              AICPA SOC 2
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#dee2e6] bg-white font-bold text-[10px] text-[#343a40] tracking-wider shadow-2xs">
              <span className="size-2 rounded-full bg-[#28a745]"></span>
              HIPAA COMPLIANT
            </div>
          </div>

          {/* Center Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[#6c757d]">
            <span>©2025 Healthcompiler, Inc.</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="https://intercom.help/health-compiler-inc/en" target="_blank" rel="noopener noreferrer" className="hover:underline">Help</a>
          </div>

          {/* Right Powered By */}
          <div className="flex items-center gap-1.5 text-[#6c757d] font-medium">
            <span>Powered by</span>
            <span className="text-[#e61952] font-bold flex items-center gap-0.5 tracking-tight">
              <span>&lt;~&gt;</span> HealthCompiler
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
