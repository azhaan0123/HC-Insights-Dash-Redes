import React from "react";
import { X, Download, CheckCircle2 } from "../../lib/icons";
import { Sheet, SheetContent } from "../ui/sheet";
import type { BillingRow } from "../../data/datasets";

interface PatientBillingSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billingData: BillingRow | null;
}

export function PatientBillingSidebar({ open, onOpenChange, billingData }: PatientBillingSidebarProps) {
  if (!billingData) return null;

  const numericRate = parseFloat(billingData.rate.replace(/[^0-9.]/g, "")) || 175.0;
  const planPaid = (numericRate * 0.8).toFixed(2);
  const patientCopay = (numericRate * 0.2).toFixed(2);
  const claimId = `CLM-2024-${billingData.id.replace(/[^0-9]/g, "").slice(-5).padStart(5, "0") || "94821"}`;

  const priorClaims = [
    { date: "Nov 14, 2024", cpt: "80053", desc: "Metabolic Panel", rate: "$85.00" },
    { date: "Sep 02, 2024", cpt: "99214", desc: "Office Visit", rate: "$185.00" },
    { date: "Jun 18, 2024", cpt: "93000", desc: "ECG Tracing", rate: "$120.00" },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:w-[440px] sm:max-w-[440px] p-0 overflow-y-auto bg-card text-card-foreground border-l border-border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pr-12 border-b border-border/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                {billingData.id}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="size-3" /> Paid
              </span>
            </div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">{billingData.name}</h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Hero Amount Display */}
          <div className="bg-muted/40 rounded-2xl p-5 border border-border/40 text-center">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Billed Rate</span>
            <div className="text-3xl font-bold tracking-tight text-foreground my-1 tabular-nums">
              {billingData.rate !== "—" ? billingData.rate : "$0.00"}
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t border-border/40">
              <div>
                Plan Paid: <span className="font-semibold text-foreground">${planPaid}</span>
              </div>
              <span className="text-border">•</span>
              <div>
                Patient Copay: <span className="font-semibold text-foreground">${patientCopay}</span>
              </div>
            </div>
          </div>

          {/* Service & Claim Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Service Details</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">CPT Code</span>
                <span className="font-mono text-xs font-semibold text-primary">{billingData.cpt}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">Description</span>
                <span className="font-medium text-foreground text-xs text-right max-w-[220px]">{billingData.description}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">Date of Service</span>
                <span className="font-medium text-foreground text-xs">{billingData.dateOfService}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">Claim ID</span>
                <span className="font-mono text-xs text-foreground">{claimId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">Physician</span>
                <span className="font-medium text-foreground text-xs">Dr. Robert Chen</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground text-xs">Facility</span>
                <span className="font-medium text-foreground text-xs">Downtown Health DPC</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground text-xs">Diagnosis (ICD-10)</span>
                <span className="font-mono text-xs text-foreground">E11.9, I10</span>
              </div>
            </div>
          </div>

          {/* Prior Claims Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prior Claims</h3>
              <span className="text-[11px] text-muted-foreground">Recent</span>
            </div>
            <div className="divide-y divide-border/40 rounded-xl border border-border/50 bg-card overflow-hidden">
              {priorClaims.map((claim, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-xs hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="font-medium text-foreground flex items-center gap-1.5">
                      <span className="font-mono text-[11px] text-primary">{claim.cpt}</span>
                      <span>{claim.desc}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{claim.date}</div>
                  </div>
                  <div className="font-semibold text-foreground tabular-nums">{claim.rate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 flex items-center gap-3">
          <button
            onClick={() => alert(`Statement for ${claimId} exported.`)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted py-2.5 text-xs font-medium text-foreground transition-colors cursor-pointer"
          >
            <Download className="size-3.5" />
            Export Statement
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 py-2.5 text-xs font-medium text-white transition-colors cursor-pointer shadow-xs"
          >
            Close
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
