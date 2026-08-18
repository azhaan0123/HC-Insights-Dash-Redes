import React, { useState } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Stethoscope, 
  ClipboardCheck, 
  AlertTriangle, 
  FlaskConical,
  X
} from "../../lib/icons";
import { Button } from "../../components/ui/button";
import { Page } from "../../components/layout/Page";
import { Card } from "../../components/ui/card";
import { acoChips } from "../../data/filters";
import { usePageLoading } from "../../hooks/usePageLoading";
import { KpiCardSkeleton, ChartSkeleton } from "../../components/dashboard/SkeletonPrimitives";
import { toast } from "sonner";
import { cn } from "../../components/ui/utils";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: "visit" | "screening" | "ed" | "lab";
}

interface PatientJourney {
  id: string;
  mrn: string;
  age: number;
  gender: string;
  provider: string;
  riskScore: number;
  cost12m: string;
  timeline: TimelineEvent[];
}

const PATIENT_JOURNEYS: Record<string, PatientJourney> = {
  P0001: {
    id: "P0001",
    mrn: "MRN00000001",
    age: 65,
    gender: "M",
    provider: "NPI1000000008",
    riskScore: 1.34,
    cost12m: "$21,751",
    timeline: [
      { id: "e1", title: "Office Visit at FAC005", description: "Diagnoses: Z00.00. Procedures: G0040.", date: "Nov 22, 2026", type: "visit" },
      { id: "e2", title: "Falls Risk Screening Conducted", description: "Screening performed at FAC005", date: "Nov 22, 2026", type: "screening" },
      { id: "e3", title: "ED at FAC004", description: "Diagnoses: R05, I10. Procedures: None.", date: "Nov 2, 2026", type: "ed" },
      { id: "e4", title: "ED at FAC001", description: "Diagnoses: R05, E13.9. Procedures: None.", date: "Oct 23, 2026", type: "ed" },
      { id: "e5", title: "Lab: BP_Systolic", description: "Result: 123 mmHg", date: "Oct 8, 2026", type: "lab" },
      { id: "e6", title: "Lab: BP_Diastolic", description: "Result: 78 mmHg", date: "Oct 8, 2026", type: "lab" },
      { id: "e7", title: "Office Visit at FAC002", description: "Diagnoses: J02.9, I10. Procedures: 1111F.", date: "Oct 5, 2026", type: "visit" },
    ]
  },
  P0002: {
    id: "P0002",
    mrn: "MRN00000002",
    age: 72,
    gender: "F",
    provider: "NPI1000000012",
    riskScore: 2.15,
    cost12m: "$34,890",
    timeline: [
      { id: "e1", title: "Office Visit at FAC001", description: "Diagnoses: E11.9, I10. Procedures: 99214.", date: "Dec 1, 2026", type: "visit" },
      { id: "e2", title: "Lab: HbA1c Test", description: "Result: 7.2%", date: "Dec 1, 2026", type: "lab" },
      { id: "e3", title: "Diabetic Retinopathy Screening", description: "Screening performed at Specialist Care", date: "Nov 15, 2026", type: "screening" },
      { id: "e4", title: "ED at FAC002", description: "Diagnoses: E16.2 (Hypoglycemia). Procedures: None.", date: "Oct 19, 2026", type: "ed" },
    ]
  }
};

const getPatientJourney = (id: string): PatientJourney => {
  if (PATIENT_JOURNEYS[id]) {
    return PATIENT_JOURNEYS[id];
  }
  const num = parseInt(id.replace("P", ""), 10) || 1;
  const mrnNum = num.toString().padStart(8, "0");
  const age = 40 + (num * 3) % 45;
  const gender = num % 2 === 0 ? "F" : "M";
  const provider = `NPI10000000${(num % 9) + 1}`;
  const riskScore = parseFloat((0.5 + (num * 0.17) % 2.5).toFixed(2));
  const cost12m = `$${(2000 + (num * 1450) % 45000).toLocaleString()}`;
  
  return {
    id,
    mrn: `MRN${mrnNum}`,
    age,
    gender,
    provider,
    riskScore,
    cost12m,
    timeline: [
      { id: "e1", title: "Office Visit at FAC001", description: "Diagnoses: Z01.00. Procedures: 99213.", date: "Dec 5, 2026", type: "visit" },
      { id: "e2", title: "Annual Wellness Assessment", description: "Preventative screening completed.", date: "Nov 18, 2026", type: "screening" },
      { id: "e3", title: "Lab: Lipids Panel", description: "Result: LDL 112 mg/dL, HDL 48 mg/dL", date: "Nov 18, 2026", type: "lab" },
    ]
  };
};

const getEventIcon = (type: "visit" | "screening" | "ed" | "lab") => {
  switch (type) {
    case "visit":
      return Stethoscope;
    case "screening":
      return ClipboardCheck;
    case "ed":
      return AlertTriangle;
    case "lab":
      return FlaskConical;
    default:
      return Stethoscope;
  }
};

export default function AcoJourney() {
  const isLoading = usePageLoading();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("P0001");
  const [searchInput, setSearchInput] = useState("");

  const initialPatients = Array.from({ length: 12 }).map((_, i) => {
    const idNum = (i + 1).toString().padStart(4, "0");
    const mrnNum = (i + 1).toString().padStart(8, "0");
    return {
      id: `P${idNum}`,
      mrn: `MRN${mrnNum}`,
    };
  });

  const [patientList, setPatientList] = useState(initialPatients);

  if (isLoading) {
    return (
      <Page title="Patient Journey" crumbs={[{ label: "ACO Insights" }]}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <KpiCardSkeleton />
          <KpiCardSkeleton />
          <KpiCardSkeleton />
        </div>
        <ChartSkeleton height={280} className="mb-6" />
      </Page>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const formattedId = searchInput.trim().toUpperCase();
    
    let finalId = formattedId;
    if (formattedId.startsWith("P")) {
      const numericPart = formattedId.substring(1);
      const parsedNum = parseInt(numericPart, 10);
      if (!isNaN(parsedNum)) {
        finalId = `P${parsedNum.toString().padStart(4, "0")}`;
      }
    } else {
      const parsedNum = parseInt(formattedId, 10);
      if (!isNaN(parsedNum)) {
        finalId = `P${parsedNum.toString().padStart(4, "0")}`;
      }
    }
    
    // Inject searched patient at the top of the list if not present
    if (!patientList.some(p => p.id === finalId)) {
      const mrnNum = finalId.replace("P", "").padStart(8, "0");
      setPatientList(prev => [
        { id: finalId, mrn: `MRN${mrnNum}` },
        ...prev
      ]);
    }
    
    setSelectedPatientId(finalId);
    toast.success(`Loaded timeline for patient ${finalId}`);
  };

  return (
    <Page title="Patient-Centered Journey" crumbs={[{ label: "ACO Insights" }]} chips={acoChips}>
      <div className="space-y-6">
      
        <form onSubmit={handleSearch} className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Enter Patient ID (e.g., P0001 or 1)" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-[280px] rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
          />
          <Button type="submit" className="gap-2 shadow-2xs cursor-pointer">
            <Search className="size-4" />
            Search
          </Button>
        </form>

        <div className="rounded-xl border border-border/60 bg-card shadow-2xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border/50 bg-muted/10">
            <h3 className="font-semibold text-foreground text-sm">Patient Journeys in Attributed Panel (Click to Expand)</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-3 max-h-[600px]">
            {patientList.map((p) => {
              const isSelected = selectedPatientId === p.id;
              const patientDetails = isSelected ? getPatientJourney(p.id) : null;
              
              return (
                <div 
                  key={p.id}
                  className={cn(
                    "rounded-xl border transition-all duration-200 overflow-hidden",
                    isSelected
                      ? "border-primary bg-primary/[0.01] shadow-2xs"
                      : "border-border/60 bg-card hover:border-primary/40 hover:bg-primary/[0.01]"
                  )}
                >
                  <div
                    onClick={() => setSelectedPatientId(isSelected ? "" : p.id)}
                    className="px-5 py-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-12 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold transition-colors shrink-0",
                        isSelected 
                          ? "bg-primary text-primary-foreground border-primary" 
                          : "bg-muted text-muted-foreground border-border/80"
                      )}>
                        {p.id}
                      </div>
                      <div>
                        <div className="font-bold text-foreground">
                          Patient ID: {p.id}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          Medical Record Number: {p.mrn}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-primary font-semibold">
                        {isSelected ? "Collapse Journey" : "View Timeline"}
                      </span>
                      <ChevronRight className={cn(
                        "size-4 text-muted-foreground/60 transition-[transform] duration-200",
                        isSelected && "rotate-90 text-primary"
                      )} />
                    </div>
                  </div>

                  {isSelected && patientDetails && (
                    <div className="px-5 pb-6 border-t border-border/50 bg-background/50 pt-5 space-y-5 animate-fade-in-up">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/40 p-4 rounded-xl border border-border/65 text-xs">
                        <div>
                          <span className="text-muted-foreground block font-semibold mb-0.5">Age / Gender</span>
                          <span className="font-bold text-foreground">{patientDetails.age} Years • {patientDetails.gender}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold mb-0.5">Attributed Provider</span>
                          <span className="font-bold text-foreground">{patientDetails.provider}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold mb-0.5">ACO Risk Score</span>
                          <span className="font-bold text-foreground">{patientDetails.riskScore}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-semibold mb-0.5">Last 12m Expenditure</span>
                          <span className="font-bold text-foreground">{patientDetails.cost12m}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground pl-1">
                          Clinical Event Timeline
                        </h4>
                        <div className="relative border-l-2 border-border/60 pl-6 ml-3.5 space-y-6">
                          {patientDetails.timeline.map((event) => {
                            const Icon = getEventIcon(event.type);
                            return (
                              <div key={event.id} className="relative">
                                <span className="absolute -left-[33px] top-1.5 flex size-5.5 items-center justify-center rounded-full bg-background border-2 border-primary/20 text-primary z-10 shadow-2xs bg-white dark:bg-card">
                                  <Icon className="size-3" />
                                </span>
                                
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div className="space-y-0.5">
                                    <h5 className="text-sm font-bold text-foreground">
                                      {event.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground">
                                      {event.description}
                                    </p>
                                  </div>
                                  <span className="text-[11px] text-muted-foreground/80 font-semibold tabular-nums shrink-0 pt-0.5">
                                    {event.date}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-border/50 p-4 flex items-center justify-end gap-4 text-xs text-muted-foreground bg-muted/20">
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground cursor-not-allowed opacity-50 font-medium">
                <ChevronLeft className="size-4" />
                Previous
              </button>
              <button className="flex items-center gap-1 rounded px-2 py-1 text-muted-foreground cursor-not-allowed opacity-50 font-medium">
                Next
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
