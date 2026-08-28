import React, { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Info,
  CheckCircle,
  Download,
  Share2,
  Filter,
  ExternalLink,
  HeartPulse,
} from "../../lib/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";
import { ClassicLayout } from "./ClassicLayout";

/* ─── TypeScript Data Models (PRD §6, §7, §12) ─── */
export interface ChronicConditionItem {
  rank: number;
  code: string;
  description: string;
  sharePercent: number;
  patientCount: number;
  avgAge: number;
  genderSplit: { female: number; male: number };
  avgComorbidities: number;
  topCoOccurring: { condition: string; percent: number }[];
  suppressed?: boolean;
}

export interface ChronicPatientDetail {
  id: string;
  name: string;
  age: number;
  gender: "Female" | "Male";
  conditionCode: string;
  conditionDesc: string;
  physician: string;
  division: "Clinical" | "Operations";
  employer: string;
  dpc: string;
  conditionFirstCoded: string;
  lastEncounter: string;
  totalChronicConditions: number;
}

/* ─── Top 20 Chronic Conditions Data (PRD §6 & §7) ─── */
const TOP_20_CHRONIC_CONDITIONS: ChronicConditionItem[] = [
  {
    rank: 1,
    code: "I10",
    description: "Essential (primary) hypertension",
    sharePercent: 30.6,
    patientCount: 864,
    avgAge: 58.4,
    genderSplit: { female: 54, male: 46 },
    avgComorbidities: 2.6,
    topCoOccurring: [
      { condition: "Hyperlipidemia (E78.5)", percent: 61 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 38 },
      { condition: "Obesity (E66.9)", percent: 24 },
    ],
  },
  {
    rank: 2,
    code: "E78.5",
    description: "Hyperlipidemia, unspecified",
    sharePercent: 24.8,
    patientCount: 700,
    avgAge: 56.8,
    genderSplit: { female: 49, male: 51 },
    avgComorbidities: 2.4,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 75 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 34 },
      { condition: "GERD (K21.9)", percent: 19 },
    ],
  },
  {
    rank: 3,
    code: "E11.9",
    description: "Type 2 diabetes mellitus without complications",
    sharePercent: 9.4,
    patientCount: 265,
    avgAge: 61.2,
    genderSplit: { female: 48, male: 52 },
    avgComorbidities: 3.2,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 82 },
      { condition: "Hyperlipidemia (E78.5)", percent: 68 },
      { condition: "Obesity (E66.9)", percent: 41 },
    ],
  },
  {
    rank: 4,
    code: "J45.909",
    description: "Unspecified asthma, uncomplicated",
    sharePercent: 4.5,
    patientCount: 127,
    avgAge: 38.6,
    genderSplit: { female: 62, male: 38 },
    avgComorbidities: 1.8,
    topCoOccurring: [
      { condition: "Allergic Rhinitis (J30.9)", percent: 45 },
      { condition: "GERD (K21.9)", percent: 28 },
      { condition: "Anxiety (F41.9)", percent: 22 },
    ],
  },
  {
    rank: 5,
    code: "E66.9",
    description: "Obesity, unspecified",
    sharePercent: 3.1,
    patientCount: 88,
    avgAge: 46.1,
    genderSplit: { female: 58, male: 42 },
    avgComorbidities: 2.8,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 68 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 44 },
      { condition: "Sleep Apnea (G47.33)", percent: 31 },
    ],
  },
  {
    rank: 6,
    code: "I25.10",
    description: "Atherosclerotic heart disease of native coronary artery",
    sharePercent: 2.6,
    patientCount: 74,
    avgAge: 67.5,
    genderSplit: { female: 39, male: 61 },
    avgComorbidities: 3.5,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 89 },
      { condition: "Hyperlipidemia (E78.5)", percent: 84 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 42 },
    ],
  },
  {
    rank: 7,
    code: "F41.9",
    description: "Anxiety disorder, unspecified",
    sharePercent: 2.4,
    patientCount: 68,
    avgAge: 41.3,
    genderSplit: { female: 68, male: 32 },
    avgComorbidities: 1.9,
    topCoOccurring: [
      { condition: "Major Depression (F32.9)", percent: 52 },
      { condition: "GERD (K21.9)", percent: 26 },
      { condition: "Hypertension (I10)", percent: 24 },
    ],
  },
  {
    rank: 8,
    code: "M54.5",
    description: "Low back pain, unspecified",
    sharePercent: 2.1,
    patientCount: 59,
    avgAge: 51.7,
    genderSplit: { female: 51, male: 49 },
    avgComorbidities: 2.1,
    topCoOccurring: [
      { condition: "Obesity (E66.9)", percent: 39 },
      { condition: "Hypertension (I10)", percent: 36 },
      { condition: "Anxiety (F41.9)", percent: 20 },
    ],
  },
  {
    rank: 9,
    code: "K21.9",
    description: "Gastro-esophageal reflux disease without esophagitis",
    sharePercent: 1.9,
    patientCount: 54,
    avgAge: 53.2,
    genderSplit: { female: 53, male: 47 },
    avgComorbidities: 2.3,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 48 },
      { condition: "Hyperlipidemia (E78.5)", percent: 42 },
      { condition: "Obesity (E66.9)", percent: 35 },
    ],
  },
  {
    rank: 10,
    code: "F32.9",
    description: "Major depressive disorder, single episode, unspecified",
    sharePercent: 1.7,
    patientCount: 48,
    avgAge: 44.9,
    genderSplit: { female: 65, male: 35 },
    avgComorbidities: 2.2,
    topCoOccurring: [
      { condition: "Anxiety (F41.9)", percent: 58 },
      { condition: "Hypertension (I10)", percent: 31 },
      { condition: "Chronic Pain (M54.5)", percent: 23 },
    ],
  },
  {
    rank: 11,
    code: "E03.9",
    description: "Hypothyroidism, unspecified",
    sharePercent: 1.5,
    patientCount: 42,
    avgAge: 57.1,
    genderSplit: { female: 81, male: 19 },
    avgComorbidities: 2.1,
    topCoOccurring: [
      { condition: "Hyperlipidemia (E78.5)", percent: 55 },
      { condition: "Hypertension (I10)", percent: 46 },
      { condition: "Vitamin D Def (E55.9)", percent: 29 },
    ],
  },
  {
    rank: 12,
    code: "M17.9",
    description: "Osteoarthritis of knee, unspecified",
    sharePercent: 1.3,
    patientCount: 37,
    avgAge: 64.3,
    genderSplit: { female: 59, male: 41 },
    avgComorbidities: 2.7,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 62 },
      { condition: "Obesity (E66.9)", percent: 49 },
      { condition: "Hyperlipidemia (E78.5)", percent: 41 },
    ],
  },
  {
    rank: 13,
    code: "N18.3",
    description: "Chronic kidney disease, stage 3 (moderate)",
    sharePercent: 1.1,
    patientCount: 31,
    avgAge: 69.8,
    genderSplit: { female: 45, male: 55 },
    avgComorbidities: 3.8,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 94 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 68 },
      { condition: "Atherosclerosis (I25.10)", percent: 39 },
    ],
  },
  {
    rank: 14,
    code: "G47.33",
    description: "Obstructive sleep apnea (adult) (pediatric)",
    sharePercent: 1.0,
    patientCount: 28,
    avgAge: 52.4,
    genderSplit: { female: 36, male: 64 },
    avgComorbidities: 3.0,
    topCoOccurring: [
      { condition: "Obesity (E66.9)", percent: 79 },
      { condition: "Hypertension (I10)", percent: 71 },
      { condition: "GERD (K21.9)", percent: 36 },
    ],
  },
  {
    rank: 15,
    code: "E53.8",
    description: "Deficiency of other specified B group vitamins",
    sharePercent: 0.9,
    patientCount: 25,
    avgAge: 55.0,
    genderSplit: { female: 60, male: 40 },
    avgComorbidities: 2.0,
    topCoOccurring: [
      { condition: "Vitamin D Def (E55.9)", percent: 48 },
      { condition: "Type 2 Diabetes (E11.9)", percent: 36 },
      { condition: "GERD (K21.9)", percent: 28 },
    ],
  },
  {
    rank: 16,
    code: "E55.9",
    description: "Vitamin D deficiency, unspecified",
    sharePercent: 0.8,
    patientCount: 22,
    avgAge: 49.3,
    genderSplit: { female: 68, male: 32 },
    avgComorbidities: 1.9,
    topCoOccurring: [
      { condition: "Hypothyroidism (E03.9)", percent: 36 },
      { condition: "Osteoarthritis (M17.9)", percent: 32 },
      { condition: "Hypertension (I10)", percent: 32 },
    ],
  },
  {
    rank: 17,
    code: "J44.9",
    description: "Chronic obstructive pulmonary disease, unspecified",
    sharePercent: 0.7,
    patientCount: 19,
    avgAge: 68.2,
    genderSplit: { female: 47, male: 53 },
    avgComorbidities: 3.4,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 74 },
      { condition: "Atherosclerosis (I25.10)", percent: 42 },
      { condition: "Asthma (J45.909)", percent: 37 },
    ],
  },
  {
    rank: 18,
    code: "I48.91",
    description: "Unspecified atrial fibrillation",
    sharePercent: 0.6,
    patientCount: 16,
    avgAge: 71.4,
    genderSplit: { female: 44, male: 56 },
    avgComorbidities: 3.9,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 94 },
      { condition: "Heart Disease (I25.10)", percent: 63 },
      { condition: "CKD Stage 3 (N18.3)", percent: 38 },
    ],
  },
  {
    rank: 19,
    code: "I37.0",
    description: "Nonrheumatic pulmonary valve stenosis",
    sharePercent: 0.3,
    patientCount: 8,
    avgAge: 62.0,
    genderSplit: { female: 50, male: 50 },
    avgComorbidities: 2.5,
    topCoOccurring: [
      { condition: "Hypertension (I10)", percent: 63 },
      { condition: "Hyperlipidemia (E78.5)", percent: 50 },
    ],
    suppressed: true,
  },
  {
    rank: 20,
    code: "E10.9",
    description: "Type 1 diabetes mellitus without complications",
    sharePercent: 0.2,
    patientCount: 6,
    avgAge: 32.5,
    genderSplit: { female: 50, male: 50 },
    avgComorbidities: 1.7,
    topCoOccurring: [
      { condition: "Hypothyroidism (E03.9)", percent: 33 },
      { condition: "Vitamin D Def (E55.9)", percent: 33 },
    ],
    suppressed: true,
  },
];

/* ─── Chronic Condition Distribution (PRD §7.4) ─── */
const CHRONIC_DISTRIBUTION_DATA = [
  {
    name: "No Comorbidity",
    subtitle: "1 condition",
    value: 28.6,
    patientCount: 807,
    color: "#e8a838",
  },
  {
    name: "Comorbidity",
    subtitle: "2 conditions",
    value: 24.4,
    patientCount: 689,
    color: "#df8a17",
  },
  {
    name: "Low Multimorbidity",
    subtitle: "3–4 conditions",
    value: 4.1,
    patientCount: 116,
    color: "#c26e10",
  },
  {
    name: "High Multimorbidity",
    subtitle: "5+ conditions",
    value: 1.7,
    patientCount: 48,
    color: "#9a4a15",
  },
];

/* ─── Mock Patient Records Generator ─── */
const PATIENT_NAMES = [
  "Andrea Banker", "Andrea Wallace", "Angela Anderson", "Angela Wallace", "Angela Weaver",
  "Barbara Jacobs", "Christopher Hobbs", "Christopher Jacobs", "Courtney Mathis", "Courtney Walton",
  "David Miller", "Elena Rostova", "Franklin Wright", "Grace Hopper", "Harold Finch",
  "Isabella Garcia", "James Wilson", "Karen Martinez", "Lawrence Vance", "Margaret Chen",
  "Nathaniel Ross", "Olivia Taylor", "Patrick Stewart", "Quinn Adams", "Rachel Green",
  "Samuel Jackson", "Theresa May", "Victor Stone", "Wendy Darling", "Xavier Brooks",
];

const PHYSICIANS_LIST = [
  "Dr. Marlou Trenklay", "Dr. Wanda Ritter", "Dr. Sam Wills",
  "Dr. Elena Rostova", "Dr. Michael Evans",
];

const EMPLOYERS_LIST = [
  "ACME CORP 1", "ACME CORP 2", "HC Clinic - Retail", "GreenSprout Energy",
  "Horizon Wellness Group", "Apex Technologies",
];

const DPCS_LIST = ["Apex DPC", "CedarBridge DPC", "BlueSky DPC", "HC Clinic"];

function generatePatientRoster(condition: ChronicConditionItem): ChronicPatientDetail[] {
  const count = Math.min(condition.patientCount, 45);
  const results: ChronicPatientDetail[] = [];

  for (let i = 0; i < count; i++) {
    const name = PATIENT_NAMES[i % PATIENT_NAMES.length] + (i >= PATIENT_NAMES.length ? ` (${i + 1})` : "");
    const hexId = `${(i + 10).toString(16).padStart(4, "0")}b${(i * 1337 + 9999).toString(16).padEnd(16, "0")}a${i + 1}`;
    const age = Math.round(condition.avgAge + ((i % 7) - 3) * 2.5);
    const gender = i % 2 === 0 ? "Female" : "Male";
    const physician = PHYSICIANS_LIST[i % PHYSICIANS_LIST.length];
    const division = i % 3 === 0 ? "Operations" : "Clinical";
    const employer = EMPLOYERS_LIST[i % EMPLOYERS_LIST.length];
    const dpc = DPCS_LIST[i % DPCS_LIST.length];

    const startYear = 2022 + (i % 4);
    const startMonth = ((i % 12) + 1).toString().padStart(2, "0");
    const startDay = ((i % 28) + 1).toString().padStart(2, "0");
    const conditionFirstCoded = `${startMonth}/${startDay}/${startYear}`;

    const encMonth = ((i % 6) + 1).toString().padStart(2, "0");
    const encDay = (((i * 3) % 28) + 1).toString().padStart(2, "0");
    const lastEncounter = `${encMonth}/${encDay}/2026`;

    const totalChronicConditions = Math.max(1, Math.round(condition.avgComorbidities + ((i % 3) - 1)));

    results.push({
      id: hexId,
      name,
      age,
      gender,
      conditionCode: condition.code,
      conditionDesc: condition.description,
      physician,
      division,
      employer,
      dpc,
      conditionFirstCoded,
      lastEncounter,
      totalChronicConditions,
    });
  }

  return results;
}

const FILTER_PILLS = [
  { label: "Employer", val: "All Sponsored Patients" },
  { label: "Division", val: "All Divisions" },
  { label: "Physician", val: "All Physicians" },
];

/* ────────────────────────────────────────────────────
   Classic Chronic Risk Page (PRD Compliant - Compact & Large Tables)
   ──────────────────────────────────────────────────── */
export function ClassicChronicRisk() {
  /* ── Mode Toggle ── */
  const [mode, setMode] = useState<"active" | "encounters">("active");

  /* ── Selected condition for drill-down ── */
  const [selectedConditionCode, setSelectedConditionCode] = useState<string | null>(null);

  /* ── Patient List Table controls ── */
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("firstCoded");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [jumpToPage, setJumpToPage] = useState("");

  /* ── Top Conditions Table Pagination (10 at once) ── */
  const [conditionPage, setConditionPage] = useState(1);
  const conditionsPerPage = 10;
  const totalConditionPages = Math.ceil(TOP_20_CHRONIC_CONDITIONS.length / conditionsPerPage);
  const currentConditions = useMemo(() => {
    const start = (conditionPage - 1) * conditionsPerPage;
    return TOP_20_CHRONIC_CONDITIONS.slice(start, start + conditionsPerPage);
  }, [conditionPage]);

  const selectedCondition = useMemo(() => {
    if (!selectedConditionCode) return null;
    return TOP_20_CHRONIC_CONDITIONS.find((c) => c.code === selectedConditionCode) || null;
  }, [selectedConditionCode]);

  const conditionPatients = useMemo(() => {
    if (!selectedCondition) return [];
    return generatePatientRoster(selectedCondition);
  }, [selectedCondition]);

  const filteredPatients = useMemo(() => {
    let list = [...conditionPatients];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.physician.toLowerCase().includes(q) ||
          p.employer.toLowerCase().includes(q) ||
          p.division.toLowerCase().includes(q)
      );
    }

    if (sortBy === "firstCoded") {
      list.sort((a, b) => new Date(b.conditionFirstCoded).getTime() - new Date(a.conditionFirstCoded).getTime());
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "age") {
      list.sort((a, b) => b.age - a.age);
    } else if (sortBy === "conditions") {
      list.sort((a, b) => b.totalChronicConditions - a.totalChronicConditions);
    }

    return list;
  }, [conditionPatients, searchQuery, sortBy]);

  const totalEntries = filteredPatients.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / recordsPerPage));
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + recordsPerPage);

  const handleConditionRowClick = (condition: ChronicConditionItem) => {
    if (condition.suppressed || condition.patientCount < 11) {
      return;
    }

    if (selectedConditionCode === condition.code) {
      setSelectedConditionCode(null);
    } else {
      setSelectedConditionCode(condition.code);
      setCurrentPage(1);
      setSearchQuery("");
    }
  };

  const handleModeChange = (newMode: "active" | "encounters") => {
    setMode(newMode);
    setSelectedConditionCode(null);
    setConditionPage(1);
  };

  const handleJumpTo = () => {
    const pageNum = parseInt(jumpToPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setJumpToPage("");
  };

  const kpiCount = mode === "active" ? "1612" : "1611";
  const kpiPercent = mode === "active" ? "(57.1%)" : "(57.5%)";
  const kpiCaption =
    mode === "active"
      ? "Total Active Patients: 2823"
      : "Patients with Encounter(s): 2802";

  /* ── Header actions ── */
  const headerActionsNode = (
    <div className="flex items-center gap-2">
      {/* Inline mode toggle */}
      <div className="flex items-center">
        <button
          onClick={() => handleModeChange("active")}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer rounded-l-full border ${
            mode === "active"
              ? "bg-[#e61952] text-white border-[#e61952]"
              : "bg-white text-[#495057] border-[#dee2e6] hover:bg-[#f8f9fa]"
          }`}
        >
          {mode === "active" && <CheckCircle className="size-3.5" />}
          Total Active Patients
        </button>
        <button
          onClick={() => handleModeChange("encounters")}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer rounded-r-full border border-l-0 ${
            mode === "encounters"
              ? "bg-[#e61952] text-white border-[#e61952]"
              : "bg-white text-[#495057] border-[#dee2e6] hover:bg-[#f8f9fa]"
          }`}
        >
          {mode === "encounters" && <CheckCircle className="size-3.5" />}
          Patients with Encounter(s)
        </button>
      </div>

      {/* Classic Action Buttons */}
      <button className="size-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs cursor-pointer" title="Download">
        <Download className="size-4" />
      </button>
      <button className="size-8 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] flex items-center justify-center text-[#495057] shadow-2xs cursor-pointer" title="Share">
        <Share2 className="size-4" />
      </button>
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs relative cursor-pointer">
        <Download className="size-3.5 text-[#6c757d]" />
        <span>Generate Report</span>
        <span className="absolute -bottom-2 -right-1 bg-[#28a745] text-white text-[8px] font-bold px-1 py-0.2 rounded uppercase tracking-wider shadow-2xs">
          BETA
        </span>
      </button>
      <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs cursor-pointer">
        <Filter className="size-3.5 text-[#e61952]" />
        <span>Filters</span>
      </button>
    </div>
  );

  return (
    <ClassicLayout
      title="Calculate Chronic Risk By"
      subtitleNote={null}
      modernRoute="/chronic-risk"
      activeNavIndex={3}
      filterPills={FILTER_PILLS}
      headerActions={headerActionsNode}
      contentClassName="gap-3 mt-0"
    >
      {/* ─── 1. COMPACT KPI STRIP (Zero wasted vertical space) ─── */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="bg-white rounded px-4 py-2 flex items-center gap-4 border border-[#dee2e6] shadow-2xs select-none">
          <div className="flex items-center gap-2 border-r border-[#dee2e6] pr-4">
            <div className="p-1 rounded bg-[#fff0f4] text-[#e61952]">
              <HeartPulse className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-[#343a40]">
                  Chronic Condition Patients
                </span>
                <Info className="size-3 text-[#6c757d]" />
              </div>
              <span className="text-[11px] text-[#6c757d]">
                {kpiCaption}
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight tabular-nums text-[#212529]">
              {kpiCount}
            </span>
            <span className="text-sm font-bold text-[#e61952]">
              {kpiPercent}
            </span>
          </div>
        </div>

        <div className="text-xs text-[#6c757d] hidden md:block">
          Click any condition row below to inspect patient roster &amp; cohort comorbidities.
        </div>
      </div>

      {/* ─── 2. EXPANDED MAIN TABLE COMPONENTS ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3.5">
        {/* Left Panel: Feature A — Top 20 Chronic Conditions Table (Larger & Spacious) */}
        <div className="xl:col-span-8 bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col justify-between h-full">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-[#dee2e6] mb-2.5">
            <div>
              <h3 className="text-base font-bold text-[#212529]">
                Top 20 Chronic Conditions
              </h3>
              <p className="text-xs text-[#6c757d] mt-0.5">
                Showing top 20 of 34 conditions coded across active patients. Click any row to view patient drill-down.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6c757d] bg-[#f8f9fa] px-2.5 py-1 rounded border border-[#dee2e6]">
              <span className="size-2.5 rounded-full bg-[#007bff]" />
              <span>Share of Active Patients</span>
            </div>
          </div>

          {/* Paginated Top Conditions Table (10 at once - No scrollbars) */}
          <div className="overflow-x-auto border border-[#dee2e6] rounded flex-1 flex flex-col justify-between">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f8f9fa] border-b border-[#dee2e6]">
                <tr className="text-[#495057] font-bold uppercase tracking-wider select-none text-xs">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3 w-24">Code</th>
                  <th className="py-2.5 px-4">Condition Description (ICD-10)</th>
                  <th className="py-2.5 px-4 w-56">Share of Active</th>
                  <th className="py-2.5 px-4 w-28 text-right">Patients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dee2e6]">
                {currentConditions.map((cond) => {
                  const isSelected = selectedConditionCode === cond.code;
                  const isSuppressed = cond.suppressed || cond.patientCount < 11;

                  return (
                    <tr
                      key={cond.code}
                      onClick={() => handleConditionRowClick(cond)}
                      className={`transition-all ${
                        isSuppressed
                          ? "opacity-55 bg-[#fbfcfd] cursor-not-allowed"
                          : isSelected
                          ? "bg-[#fff0f4] border-l-4 border-l-[#e61952] font-semibold cursor-pointer shadow-2xs"
                          : "hover:bg-[#f8f9fa] cursor-pointer"
                      }`}
                      title={
                        isSuppressed
                          ? "Group too small to list (<11 patients, small-cell suppression)"
                          : isSelected
                          ? "Click to deselect"
                          : "Click to view patient population and drill-down"
                      }
                    >
                      {/* Rank */}
                      <td className="py-3 px-3 text-center font-mono text-[#6c757d] font-bold text-xs">
                        {cond.rank}
                      </td>

                      {/* Code badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`font-mono text-xs font-extrabold px-2 py-0.5 rounded inline-block shadow-2xs ${
                            isSelected
                              ? "bg-[#e61952] text-white"
                              : "bg-[#e9ecef] text-[#343a40]"
                          }`}
                        >
                          {cond.code}
                        </span>
                      </td>

                      {/* Condition Description */}
                      <td className="py-3 px-4 text-[#212529] font-medium text-sm leading-snug">
                        <span>{cond.description}</span>
                        {isSuppressed && (
                          <span className="ml-2 inline-flex items-center gap-0.5 text-[11px] text-[#dc3545] font-semibold bg-[#f8d7da] px-1.5 py-0.5 rounded">
                            Group &lt; 11 suppressed
                          </span>
                        )}
                      </td>

                      {/* Share of Active Patients with larger visual bar */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex-1 bg-[#e9ecef] h-3 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(cond.sharePercent * 3.1, 100)}%`,
                                backgroundColor: isSelected ? "#e61952" : "#007bff",
                              }}
                            />
                          </div>
                          <span
                            className={`font-bold tabular-nums text-xs w-12 text-right ${
                              isSelected ? "text-[#e61952]" : "text-[#212529]"
                            }`}
                          >
                            {cond.sharePercent.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Patients Count */}
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-sm text-[#212529]">
                        {cond.patientCount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Top Conditions Table Pagination Footer (10 at once) */}
            <div className="p-3 border-t border-[#dee2e6] bg-[#f8f9fa] flex items-center justify-between text-xs text-[#6c757d]">
              <span>
                Showing <strong className="text-[#212529] font-bold">{(conditionPage - 1) * conditionsPerPage + 1}</strong> to{" "}
                <strong className="text-[#212529] font-bold">{Math.min(conditionPage * conditionsPerPage, TOP_20_CHRONIC_CONDITIONS.length)}</strong> of{" "}
                <strong className="text-[#212529] font-bold">{TOP_20_CHRONIC_CONDITIONS.length}</strong> conditions
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={conditionPage === 1}
                  onClick={() => setConditionPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="size-4 text-[#495057]" />
                </button>

                <span className="px-2 font-bold text-[#212529]">
                  Page {conditionPage} of {totalConditionPages}
                </span>

                <button
                  disabled={conditionPage === totalConditionPages}
                  onClick={() => setConditionPage((p) => Math.min(totalConditionPages, p + 1))}
                  className="p-1.5 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="size-4 text-[#495057]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Chronic Condition Distribution (Vertical Column Graph) */}
        <div className="xl:col-span-4 bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#dee2e6] mb-1">
            <div>
              <h3 className="text-base font-bold text-[#212529]">
                Chronic Condition Distribution
              </h3>
              <p className="text-xs text-[#6c757d] mt-0.5">
                Comorbidity progression across panel (PRD §7.4)
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6c757d] bg-[#f8f9fa] px-2.5 py-1 rounded border border-[#dee2e6]">
              <span className="size-2.5 rounded-full bg-[#e8a838]" />
              <span>% of Patients</span>
            </div>
          </div>

          {/* Vertical Bar (Column) Chart */}
          <div className="flex-1 w-full min-h-[360px] py-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CHRONIC_DISTRIBUTION_DATA}
                margin={{ top: 25, right: 15, left: -20, bottom: 45 }}
              >
                <CartesianGrid vertical={false} stroke="#dee2e6" strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#dee2e6" }}
                  interval={0}
                  tick={({ x, y, payload }: any) => {
                    const item = CHRONIC_DISTRIBUTION_DATA.find((d) => d.name === payload.value);
                    return (
                      <g transform={`translate(${x},${y + 4}) rotate(-30)`}>
                        <text
                          x={0}
                          y={8}
                          textAnchor="end"
                          fill="#343a40"
                          fontSize={11}
                          fontWeight={700}
                        >
                          {payload.value}
                        </text>
                        {item && (
                          <text
                            x={0}
                            y={21}
                            textAnchor="end"
                            fill="#6c757d"
                            fontSize={10}
                            fontWeight={500}
                          >
                            ({item.subtitle})
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#6c757d" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 35]}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }}
                  formatter={(val: number, name: string, item: any) => [
                    `${val}% (${item.payload.patientCount} patients)`,
                    `${item.payload.name} (${item.payload.subtitle})`,
                  ]}
                />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  barSize={42}
                >
                  {CHRONIC_DISTRIBUTION_DATA.map((entry, index) => (
                    <Cell key={`dist-cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="top"
                    style={{ fontSize: 11, fontWeight: 700, fill: "#e61952" }}
                    formatter={(v: number) => `${v}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Note */}
          <div className="pt-2.5 border-t border-[#dee2e6] text-xs text-[#6c757d] flex items-center justify-between">
            <span>Total Panel: <strong className="text-[#212529] font-bold">2,823 Active</strong></span>
            <span className="text-[#28a745] font-bold bg-[#d4edda] px-2 py-0.5 rounded">Moderate Comorbidity</span>
          </div>
        </div>
      </div>

      {/* ─── 3. FEATURE B: EXPANDED PATIENT DETAIL SECTION ─── */}
      {selectedCondition ? (
        <div className="space-y-3.5">
          {/* Selected-Condition Summary Panel (PRD §7.2) */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#dee2e6]">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-black bg-[#e61952] text-white px-2.5 py-1 rounded shadow-2xs">
                    {selectedCondition.code}
                  </span>
                  <h3 className="text-lg font-bold text-[#212529]">
                    {selectedCondition.description}
                  </h3>
                </div>
                <p className="text-xs text-[#6c757d] mt-1">
                  Patient cohort summary and clinical drill-down roster (PRD §7.2 &amp; §7.3).
                </p>
              </div>

              <button
                onClick={() => setSelectedConditionCode(null)}
                className="px-3 py-1.5 text-xs font-bold text-[#e61952] bg-[#fff0f4] border border-[#f5c6cb] rounded hover:bg-[#e61952] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <span>✕ Clear Selection</span>
              </button>
            </div>

            {/* Metric Badges Grid (PRD §7.2) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-3">
              <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] block">
                  Patient Cohort
                </span>
                <span className="text-xl font-black text-[#212529] tabular-nums block mt-1">
                  {selectedCondition.patientCount}{" "}
                  <span className="text-sm font-bold text-[#e61952]">
                    ({selectedCondition.sharePercent}%)
                  </span>
                </span>
                <span className="text-xs text-[#6c757d]">Share of active panel</span>
              </div>

              <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] block">
                  Average Age
                </span>
                <span className="text-xl font-black text-[#212529] tabular-nums block mt-1">
                  {selectedCondition.avgAge}{" "}
                  <span className="text-xs font-semibold text-[#6c757d]">yrs</span>
                </span>
                <span className="text-xs text-[#6c757d]">Range: 24 - 82 yrs</span>
              </div>

              <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] block">
                  Gender Split
                </span>
                <span className="text-sm font-bold text-[#212529] block mt-1">
                  {selectedCondition.genderSplit.female}% Female / {selectedCondition.genderSplit.male}% Male
                </span>
                <div className="w-full bg-[#007bff] h-2 rounded-full mt-2 overflow-hidden flex">
                  <div
                    style={{ width: `${selectedCondition.genderSplit.female}%` }}
                    className="bg-[#e61952] h-full"
                    title={`Female: ${selectedCondition.genderSplit.female}%`}
                  />
                </div>
              </div>

              <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] block">
                  Avg Comorbidities
                </span>
                <span className="text-xl font-black text-[#212529] tabular-nums block mt-1">
                  {selectedCondition.avgComorbidities}{" "}
                  <span className="text-xs font-semibold text-[#6c757d]">conditions/pt</span>
                </span>
                <span className="text-xs text-[#6c757d]">Group comorbidity mean</span>
              </div>

              <div className="p-3 bg-[#f8f9fa] border border-[#dee2e6] rounded col-span-2 lg:col-span-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6c757d] block">
                  Top Co-Occurring
                </span>
                <div className="mt-1 space-y-1 text-xs text-[#212529]">
                  {selectedCondition.topCoOccurring.slice(0, 2).map((co, idx) => (
                    <div key={idx} className="truncate font-medium">
                      • {co.condition} <strong className="text-[#e61952] font-bold">{co.percent}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Patient List Table (Expanded & Spacious) */}
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs flex flex-col overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-3.5 border-b border-[#dee2e6] flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <div className="relative w-full sm:w-88">
                <Search className="size-4 text-[#6c757d] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search patient, ID, physician, employer..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#ced4da] rounded text-[#212529] placeholder-[#6c757d] focus:outline-none focus:border-[#e61952]"
                />
              </div>

              <div className="flex items-center gap-3.5 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-xs text-[#495057]">
                  <span className="text-[#6c757d] font-semibold">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-white border border-[#ced4da] rounded px-2.5 py-1.5 text-xs text-[#212529] font-semibold focus:outline-none focus:border-[#e61952] cursor-pointer"
                  >
                    <option value="firstCoded">Condition First Coded (Recent)</option>
                    <option value="name">Patient Name (A-Z)</option>
                    <option value="age">Age (High-Low)</option>
                    <option value="conditions">Total Conditions (High-Low)</option>
                  </select>
                </div>

                <span className="text-xs text-[#6c757d]">
                  Showing{" "}
                  <strong className="text-[#212529] tabular-nums font-bold">
                    {totalEntries > 0 ? startIndex + 1 : 0}
                  </strong>{" "}
                  to{" "}
                  <strong className="text-[#212529] tabular-nums font-bold">
                    {Math.min(startIndex + recordsPerPage, totalEntries)}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-[#212529] tabular-nums font-bold">{totalEntries}</strong> patients
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#dee2e6] text-[#495057] font-bold uppercase tracking-wider select-none text-xs">
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Age / Gender</th>
                    <th className="py-3 px-4">Assigned Physician</th>
                    <th className="py-3 px-4">Division / Employer</th>
                    <th className="py-3 px-4">Condition First Coded</th>
                    <th className="py-3 px-4">Last Encounter</th>
                    <th className="py-3 px-4 text-center">Total Conditions</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6] text-xs">
                  {paginatedPatients.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-xs text-[#6c757d] italic">
                        No matching patient records found in this cohort.
                      </td>
                    </tr>
                  ) : (
                    paginatedPatients.map((pt) => (
                      <tr key={pt.id} className="hover:bg-[#f8f9fa] transition-colors">
                        {/* Patient Name & ID */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#212529] text-sm">{pt.name}</div>
                          <div className="font-mono text-[11px] text-[#6c757d]">{pt.id}</div>
                        </td>

                        {/* Age & Gender */}
                        <td className="py-3 px-4 text-[#495057]">
                          <span className="font-semibold text-sm text-[#212529]">{pt.age} yrs</span>
                          <span className="text-[#6c757d] text-xs ml-1 font-medium">({pt.gender.charAt(0)})</span>
                        </td>

                        {/* Assigned Physician */}
                        <td className="py-3 px-4 text-[#495057] font-semibold text-sm">
                          {pt.physician}
                        </td>

                        {/* Division & Employer */}
                        <td className="py-3 px-4">
                          <div className="text-[#212529] font-bold text-xs">{pt.employer}</div>
                          <div className="text-[11px] text-[#6c757d]">{pt.division} • {pt.dpc}</div>
                        </td>

                        {/* Condition First Coded */}
                        <td className="py-3 px-4 font-mono text-[#495057] text-xs font-semibold">
                          {pt.conditionFirstCoded}
                        </td>

                        {/* Last Encounter */}
                        <td className="py-3 px-4 font-mono text-[#495057] text-xs font-semibold">
                          {pt.lastEncounter}
                        </td>

                        {/* Total Chronic Conditions */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black bg-[#e9ecef] text-[#343a40]">
                            {pt.totalChronicConditions}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => alert(`Opening medical chart for ${pt.name} (${pt.id})`)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#e61952] hover:underline cursor-pointer bg-[#fff0f4] px-2.5 py-1 rounded border border-[#f5c6cb]"
                          >
                            <span>View Chart</span>
                            <ExternalLink className="size-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-3.5 border-t border-[#dee2e6] bg-[#f8f9fa] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6c757d]">
              <div className="flex items-center gap-2">
                <span>Rows per page:</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => {
                    setRecordsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-[#ced4da] rounded px-2.5 py-1 text-xs text-[#212529] font-semibold focus:outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="flex items-center gap-1.5">
                  <span>Jump to:</span>
                  <input
                    type="text"
                    value={jumpToPage}
                    onChange={(e) => setJumpToPage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleJumpTo()}
                    className="w-12 px-1.5 py-1 text-center text-xs bg-white border border-[#ced4da] rounded text-[#212529] font-bold"
                    placeholder="1"
                  />
                  <button
                    onClick={handleJumpTo}
                    className="px-2.5 py-1 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] text-xs text-[#495057] font-bold cursor-pointer"
                  >
                    Go
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="size-4 text-[#495057]" />
                  </button>

                  <span className="px-2 font-bold text-[#212529]">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded bg-white border border-[#ced4da] hover:bg-[#e9ecef] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="size-4 text-[#495057]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Panel */
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5 text-center">
          <p className="text-xs text-[#6c757d]">
            Select a chronic condition in the <strong className="text-[#343a40]">Top 20 Chronic Conditions</strong> table above to view patient population summary and patient-level drill-down.
          </p>
        </div>
      )}
    </ClassicLayout>
  );
}
