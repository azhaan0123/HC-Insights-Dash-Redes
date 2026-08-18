import { ReactNode } from "react";
import { Activity, Stethoscope, FileText, Lightbulb, User, X } from "../../lib/icons";
import { Sheet, SheetContent, SheetClose } from "../../components/ui/sheet";

import type { PatientRow } from "../../data/patients";

type PatientProfileSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientRow | null;
};

export function PatientProfileSidebar({ open, onOpenChange, patient }: PatientProfileSidebarProps) {
  if (!patient) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[450px] sm:max-w-[450px] p-0 overflow-y-auto bg-card text-card-foreground border-l border-border shadow-2xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur-md p-6 shadow-xs">
          <div className="flex items-start justify-between pr-8">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <User className="size-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Patient Profile: {patient.name}</h2>
              </div>
              <p className="text-[13px] text-muted-foreground">
                MRN: {patient.mrn} • Age: 74 • Gender: Male
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* General Information */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Activity className="size-4 text-primary" />
              General Information
            </h3>
            <div className="grid grid-cols-[130px_1fr] gap-y-3 text-[13px]">
              <span className="text-muted-foreground">Risk Score</span>
              <div>
                <span className="inline-flex h-6 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  57
                </span>
              </div>

              <span className="text-muted-foreground">Ethnicity</span>
              <span className="font-medium text-foreground">Caucasian</span>

              <span className="text-muted-foreground">Family History</span>
              <span className="font-medium text-foreground">Significant family history of related conditions</span>

              <span className="text-muted-foreground">Lifestyle Factors</span>
              <span className="font-medium text-foreground">Current Smoker, Sedentary</span>
            </div>
          </div>

          {/* Clinical Information */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Stethoscope className="size-4 text-primary" />
              Clinical Information
            </h3>
            <div className="grid grid-cols-[130px_1fr] gap-y-3 text-[13px]">
              <span className="text-muted-foreground">Suspected HCC</span>
              <span className="font-medium text-foreground">Chronic Kidney Disease Stage 3-4 / Consider Diabetes</span>

              <span className="text-muted-foreground">Classification</span>
              <div>
                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-[13px] font-medium text-secondary-foreground">
                  Proactive
                </span>
              </div>

              <span className="text-muted-foreground">Clinical Indicators</span>
              <span className="font-medium text-foreground">Indicator A1, Indicator B1, Lab X1 Abnormal</span>

              <span className="text-muted-foreground">Comorbidities</span>
              <span className="font-medium text-foreground">Chronic Condition 1, Past Illness 9, Syndrome 15, Chronic Kidney Disease Stage 3-4, Type 2 Diabetes Mellitus</span>

              <span className="text-muted-foreground">Medications</span>
              <span className="font-medium text-foreground">Medication 1 IR, Drug Class A, ACE Inhibitor</span>
            </div>
          </div>

          {/* HCC Metrics & Status */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <FileText className="size-4 text-primary" />
              HCC Metrics & Status
            </h3>
            <div className="grid grid-cols-[130px_1fr] gap-y-3 text-[13px]">
              <span className="text-muted-foreground">AWV Status</span>
              <div>
                <span className="inline-flex items-center rounded-full bg-primary px-2.5 py-0.5 text-[13px] font-medium text-primary-foreground">
                  Completed
                </span>
              </div>

              <span className="text-muted-foreground">Last AWV Date</span>
              <span className="font-medium text-foreground">Sep 2, 2025</span>

              <span className="text-muted-foreground">Doc. Accuracy</span>
              <span className="font-medium text-foreground">73%</span>

              <span className="text-muted-foreground">Risk Adj. Factor</span>
              <span className="font-medium text-foreground">0.823</span>
            </div>
          </div>

          {/* AI Risk Explanation */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Lightbulb className="size-4 text-primary" />
              AI Risk Explanation
            </h3>
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-[13px] text-foreground">
              AI explanation feature is currently unavailable in this build.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
