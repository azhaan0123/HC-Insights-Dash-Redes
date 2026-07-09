import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Button } from "../components/ui/button";
import { ChevronLeft, ChevronRight, X, Sparkles, ShieldAlert, CheckCircle2, BookOpen } from "lucide-react";
import { cn } from "../components/ui/utils";

export interface TourStep {
  id: string;
  targetId: string;
  title: string;
  content: string;
  badge?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "step-1",
    targetId: "tour-step-1",
    title: "Insight Navigation Tabs",
    badge: "Navigation",
    content: "These are your insight tabs. Hover on the icons to know more. Click on the icons to switch sections."
  },
  {
    id: "step-2",
    targetId: "tour-step-2",
    title: "Engagement & Utilization",
    badge: "Dashboard",
    content: "Monitor overall patient engagement metrics, active employee cohorts, and telehealth utilization trends."
  },
  {
    id: "step-3",
    targetId: "tour-step-3",
    title: "Utilization Gaps",
    badge: "Analytics",
    content: "Identify clinical care gaps, overdue preventive screenings, and unaddressed health opportunities."
  },
  {
    id: "step-4",
    targetId: "tour-step-4",
    title: "Chronic Risk",
    badge: "Clinical",
    content: "Track population risk stratification across chronic disease cohorts and monitor longitudinal stability."
  },
  {
    id: "step-5",
    targetId: "tour-step-5",
    title: "Claims Billing Report",
    badge: "Financial",
    content: "Review financial reconciliation, submitted CPT billing codes, and employer claims reports."
  },
  {
    id: "step-6",
    targetId: "tour-step-6",
    title: "Cost Savings",
    badge: "Outcomes",
    content: "Analyze healthcare cost reductions, value-based care savings, and referral network efficiencies."
  },
  {
    id: "step-7",
    targetId: "tour-step-7",
    title: "Claims Utilization",
    badge: "Claims",
    content: "Dive deep into claims data patterns, service category distribution, and inpatient/outpatient costs."
  },
  {
    id: "step-8",
    targetId: "tour-step-8",
    title: "Coordinated Care",
    badge: "Operations",
    content: "Oversee multidisciplinary care coordination, clinical follow-ups, and patient care transitions."
  },
  {
    id: "step-9",
    targetId: "tour-step-9",
    title: "Communication",
    badge: "Engagement",
    content: "Track patient interactions across secure chat, SMS, phone calls, and automated outreach channels."
  },
  {
    id: "step-10",
    targetId: "tour-step-10",
    title: "Marketing",
    badge: "Growth",
    content: "Evaluate outreach campaigns, patient acquisition funnels, and enrollment initiatives."
  },
  {
    id: "step-11",
    targetId: "tour-step-11",
    title: "Surveys",
    badge: "Feedback",
    content: "Review patient feedback, Net Promoter Scores (NPS), and clinical outcome assessment surveys."
  },
  {
    id: "step-12",
    targetId: "tour-step-12",
    title: "Switch Dashboards",
    badge: "System",
    content: "Click here to view and access other Dashboards such as ACO Insights, HCC Insights, and Outcomes."
  },
  {
    id: "step-13",
    targetId: "tour-step-13",
    title: "Report Generator",
    badge: "Export",
    content: "Click here to open the report generator, select parameters and generate your custom PDF/Excel report."
  },
  {
    id: "step-14",
    targetId: "tour-step-14",
    title: "Data Filters",
    badge: "Refine",
    content: "Click here to access filters. Select appropriate date ranges, clinics, or risk tiers to refine your data."
  },
  {
    id: "step-15",
    targetId: "tour-step-15",
    title: "Detailed Card Breakdown",
    badge: "Interactivity",
    content: "Click on any KPI card or chart metric to view its detailed breakdown and underlying patient list."
  },
  {
    id: "step-16",
    targetId: "tour-step-16",
    title: "Help Desk",
    badge: "Support",
    content: `Step 1: Click "Get Help" in the sidebar.\n\nStep 2: Explore articles, integration guides, dashboard overviews, FAQs, and user access instructions.\n\nStep 3: Use search or browse categories to quickly find the exact information you need.`
  },
  {
    id: "step-17",
    targetId: "tour-step-17",
    title: "Chat Bot Support",
    badge: "Helix Assistant",
    content: `Step 1: Still need help? Start a chat with our support agent (do not share any PHI).\n\nImportant Disclaimer:\nFor your privacy and security, please do not share any Protected Health Information (PHI) or sensitive personal data (such as medical details, patient identifiers, or health records) in this chat.\n\nIf your request involves PHI or requires access to sensitive information, please submit a support ticket.\n\nStep 2: If your issue isn’t resolved, type “Report” to create a support ticket.\nStep 3: Provide a few details - our team will receive it and respond in chat.\nStep 4: You can also request to connect with a support team member if needed.`
  }
];

interface OnboardingTourContextType {
  isOpen: boolean;
  currentStepIndex: number;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
}

const OnboardingTourContext = createContext<OnboardingTourContextType | undefined>(undefined);

export function useOnboardingTour() {
  const context = useContext(OnboardingTourContext);
  if (!context) throw new Error("useOnboardingTour must be used within OnboardingTourProvider");
  return context;
}

export function OnboardingTourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR_STEPS[currentStepIndex];

  const updateTargetRect = useCallback(() => {
    if (!isOpen || !currentStep) return;
    const el = document.getElementById(currentStep.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTargetRect(el.getBoundingClientRect());
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [isOpen, updateTargetRect]);

  // Recalculate after step transition animation
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(updateTargetRect, 150);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isOpen, updateTargetRect]);

  const startTour = useCallback(() => {
    setCurrentStepIndex(0);
    setIsOpen(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(i => i + 1);
    } else {
      setIsOpen(false);
    }
  }, [currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(i => i - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Calculate Popover Position
  const getPopoverStyle = (): React.CSSProperties => {
    const popoverWidth = Math.min(420, window.innerWidth - 32);
    if (!targetRect) {
      // Centered fallback
      return {
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: popoverWidth
      };
    }

    const margin = 16;
    let top = targetRect.bottom + margin;
    let left = targetRect.left;

    // If popover would go off bottom viewport, put above
    if (top + 320 > window.innerHeight) {
      top = Math.max(margin, targetRect.top - 320 - margin);
    }

    // Horizontal bounds check
    if (left + popoverWidth > window.innerWidth - margin) {
      left = window.innerWidth - popoverWidth - margin;
    }
    left = Math.max(margin, left);

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${popoverWidth}px`
    };
  };

  return (
    <OnboardingTourContext.Provider value={{ isOpen, currentStepIndex, startTour, nextStep, prevStep, skipTour }}>
      {children}

      {/* Apple-Style Tour Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-300">
          {/* Spotlight Cutout via BoxShadow */}
          {targetRect ? (
            <div
              className="fixed rounded-xl border-2 border-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none z-50 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
              style={{
                left: Math.max(0, targetRect.left - 6),
                top: Math.max(0, targetRect.top - 6),
                width: targetRect.width + 12,
                height: targetRect.height + 12,
              }}
            >
              <div className="absolute inset-0 rounded-xl bg-primary/10 animate-pulse" />
            </div>
          ) : (
            <div className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto" />
          )}

          {/* Interactive Backdrop Click to Advance/Skip */}
          <div className="absolute inset-0 pointer-events-auto" onClick={skipTour} />

          {/* Apple Glassmorphism Tour Card */}
          <div
            ref={popoverRef}
            className={cn(
              "fixed z-50 flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-auto",
              !targetRect && "animate-in zoom-in-95"
            )}
            style={getPopoverStyle()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {currentStep.badge || "Feature Guide"}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      ({currentStepIndex + 1} of {TOUR_STEPS.length})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground">{currentStep.title}</h3>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={skipTour}
                className="size-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                title="End Tour"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Body Content */}
            <div className="max-h-[280px] overflow-y-auto pr-1 text-sm leading-relaxed text-muted-foreground space-y-3">
              {currentStep.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith("Important Disclaimer")) {
                  return (
                    <div key={idx} className="rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 p-3.5 text-xs flex flex-col gap-1.5 shadow-sm">
                      <div className="flex items-center gap-1.5 font-bold text-red-800 dark:text-red-400">
                        <ShieldAlert className="size-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span>Important Disclaimer</span>
                      </div>
                      <p className="text-red-750 dark:text-red-300/90 font-medium leading-normal">{paragraph.replace("Important Disclaimer:", "").replace("Important Disclaimer", "")}</p>
                    </div>
                  );
                }
                return (
                  <p key={idx} className="text-foreground/90 whitespace-pre-line">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Apple Progress Dots */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {TOUR_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    i === currentStepIndex ? "w-6 bg-primary" : i < currentStepIndex ? "w-1.5 bg-primary/40" : "w-1.5 bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  disabled={currentStepIndex === 0}
                  className="h-9 gap-1 text-xs font-semibold px-3"
                >
                  <ChevronLeft className="size-3.5" /> Prev
                </Button>

                <Button
                  size="sm"
                  onClick={nextStep}
                  className="h-9 gap-1 px-4 text-xs font-bold shadow-md"
                >
                  {currentStepIndex === TOUR_STEPS.length - 1 ? (
                    <>
                      <CheckCircle2 className="size-3.5" /> Finish
                    </>
                  ) : (
                    <>
                      Next <ChevronRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OnboardingTourContext.Provider>
  );
}
