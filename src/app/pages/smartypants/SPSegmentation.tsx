import React, { useState } from "react";
import {
  Search,
  Plus,
  Download,
  Zap,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  BarChart3,
  Activity,
  DollarSign,
  CalendarCheck,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_SEGMENTS, type SPSegment } from "../../data/smartypantsData";

export function SPSegmentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<SPSegment | null>(null);

  const filteredSegments = searchQuery.trim()
    ? SP_SEGMENTS.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : SP_SEGMENTS;

  return (
    <ClassicLayout
      title="Patient Segmentation"
      subtitleNote="Create and manage dynamic patient cohorts for targeted outreach and campaigns."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Total Segments", val: SP_SEGMENTS.length.toString() },
        { label: "Total Patients", val: "1,420" },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => toast.info("Create segment wizard coming soon...")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
          >
            <Plus className="size-3.5" />
            <span>Create Segment</span>
          </button>
        </div>
      }
    >
      {/* Search */}
      <div className="flex items-center gap-2 mb-1">
        <div className="relative flex-1 max-w-[320px]">
          <Search className="absolute left-2.5 top-2 size-3.5 text-[#6c757d]" />
          <input
            type="text"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-full rounded border border-[#dee2e6] bg-white text-xs text-[#212529] focus:outline-none focus:border-[#e61952]"
          />
        </div>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredSegments.map((seg) => {
          const isSelected = selectedSegment?.id === seg.id;
          const isNeg = seg.trend < 0;
          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegment(isSelected ? null : seg)}
              className={`bg-white rounded-lg border shadow-2xs hover:shadow-md p-4 cursor-pointer transition-all group flex flex-col justify-between gap-3 ${
                isSelected ? "border-[#e61952] ring-2 ring-[#e61952]/20" : "border-[#dee2e6] hover:border-[#e61952]/50"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: seg.color }} />
                  <span className="text-xs font-bold text-[#212529] group-hover:text-[#e61952] transition-colors leading-tight">
                    {seg.name}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${
                    isNeg ? "bg-[#d4edda] text-[#155724]" : "bg-[#f8d7da] text-[#721c24]"
                  }`}
                >
                  {isNeg ? <TrendingDown className="size-2.5" /> : <TrendingUp className="size-2.5" />}
                  {Math.abs(seg.trend)}
                </span>
              </div>

              {/* Patient Count & View Details Callout */}
              <div className="flex items-end justify-between pt-1">
                <div className="flex items-baseline gap-1.5">
                  <Users className="size-4 text-[#6c757d]" />
                  <span className="text-2xl font-extrabold text-[#212529] tabular-nums">
                    {seg.patientCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#6c757d] font-medium">patients</span>
                </div>

                <span className="text-[11px] font-semibold text-[#6c757d] group-hover:text-[#e61952] flex items-center gap-1 transition-colors">
                  View details <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Detailed View Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[1px] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-2xl border border-[#dee2e6] max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#f8f9fa] border-b border-[#dee2e6] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-4 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: selectedSegment.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#212529] leading-tight">{selectedSegment.name}</h3>
                    <span className="bg-[#fff0f4] text-[#e61952] border border-[#ffccd8] text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                      Cohort Segment
                    </span>
                  </div>
                  <p className="text-xs text-[#6c757d] mt-0.5">
                    {selectedSegment.patientCount.toLocaleString()} active members matched by dynamic rule criteria
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSegment(null)}
                className="px-2.5 py-1 rounded text-xs font-semibold text-[#6c757d] hover:text-[#212529] hover:bg-[#e9ecef] transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#495057]">
              {/* Key Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Total Patients", value: selectedSegment.patientCount.toLocaleString(), icon: Users },
                  { label: "Weekly Trend", value: `${selectedSegment.trend > 0 ? "+" : ""}${selectedSegment.trend}`, icon: BarChart3 },
                  { label: "Avg Engagement", value: `${selectedSegment.avgEngagement}%`, icon: Activity },
                  { label: "Avg Claims", value: selectedSegment.avgClaims.toString(), icon: DollarSign },
                  { label: "Avg Visits", value: selectedSegment.avgVisits.toString(), icon: CalendarCheck },
                  { label: "Active Campaigns", value: selectedSegment.campaigns.toString(), icon: Megaphone },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="p-3 rounded bg-[#f8f9fa] border border-[#dee2e6] text-center">
                      <Icon className="size-4 mx-auto text-[#e61952] mb-1" />
                      <div className="text-lg font-extrabold text-[#212529] tabular-nums">{metric.value}</div>
                      <div className="text-[10px] text-[#6c757d] font-medium mt-0.5">{metric.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Segment Criteria & Inclusion Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded p-4 space-y-2">
                  <h4 className="font-bold text-[#212529] uppercase tracking-wide text-[11px] border-l-2 border-[#e61952] pl-2">
                    Inclusion Criteria & Rule Engine
                  </h4>
                  <ul className="space-y-1.5 text-[11px] text-[#495057]">
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#28a745] font-bold">✓</span>
                      <span>Primary Diagnosis / Tag: <strong className="text-[#212529]">{selectedSegment.name}</strong></span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#28a745] font-bold">✓</span>
                      <span>EHR Status: Active SmartyPants DPC Member</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#28a745] font-bold">✓</span>
                      <span>Engagement Score Constraint: &lt; 85% benchmark</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="text-[#28a745] font-bold">✓</span>
                      <span>Auto-Sync Frequency: Real-time via AtlasMD API webhook</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#f8f9fa] border border-[#dee2e6] rounded p-4 space-y-2">
                  <h4 className="font-bold text-[#212529] uppercase tracking-wide text-[11px] border-l-2 border-[#007bff] pl-2">
                    Employer Distribution
                  </h4>
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between text-[#495057] mb-1">
                        <span>Apex Technologies</span>
                        <span className="font-bold text-[#212529]">42%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#dee2e6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#007bff] rounded-full" style={{ width: "42%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#495057] mb-1">
                        <span>Pinnacle Corp</span>
                        <span className="font-bold text-[#212529]">31%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#dee2e6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#17a2b8] rounded-full" style={{ width: "31%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[#495057] mb-1">
                        <span>Atlas Group & Other</span>
                        <span className="font-bold text-[#212529]">27%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#dee2e6] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6c757d] rounded-full" style={{ width: "27%" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Patient Roster Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-[#212529] uppercase tracking-wide text-[11px] border-l-2 border-[#28a745] pl-2">
                    Cohort Sample Roster (Showing top matching members)
                  </h4>
                  <span className="text-[10px] text-[#6c757d]">Updated 5 mins ago</span>
                </div>
                <div className="border border-[#dee2e6] rounded overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                        <th className="py-2 px-3">Patient ID</th>
                        <th className="py-2 px-3">Name</th>
                        <th className="py-2 px-3">Employer</th>
                        <th className="py-2 px-3">Risk Score</th>
                        <th className="py-2 px-3">Engagement</th>
                        <th className="py-2 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#dee2e6] text-[11px] text-[#212529]">
                      {[
                        { id: "SP-1002", name: "James Rodriguez", employer: "Pinnacle Corp", risk: 7, eng: 58 },
                        { id: "SP-1004", name: "Michael Thompson", employer: "Apex Technologies", risk: 9, eng: 22 },
                        { id: "SP-1008", name: "David Kim", employer: "Apex Technologies", risk: 8, eng: 18 },
                        { id: "SP-1012", name: "William Brown", employer: "Apex Technologies", risk: 7, eng: 42 },
                      ].map((row) => (
                        <tr key={row.id} className="hover:bg-[#f8f9fa] transition-colors">
                          <td className="py-2 px-3 font-mono font-medium text-[#007bff]">{row.id}</td>
                          <td className="py-2 px-3 font-bold">{row.name}</td>
                          <td className="py-2 px-3 text-[#495057]">{row.employer}</td>
                          <td className="py-2 px-3 font-semibold text-[#dc3545]">Level {row.risk}</td>
                          <td className="py-2 px-3 font-semibold">{row.eng}%</td>
                          <td className="py-2 px-3 text-right">
                            <button
                              onClick={() => toast.info(`Initiating outreach to ${row.name}...`)}
                              className="px-2 py-0.5 rounded border border-[#dee2e6] bg-white hover:bg-[#fff0f4] text-[#e61952] font-semibold text-[10px]"
                            >
                              Outreach
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-[#f8f9fa] border-t border-[#dee2e6] px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success(`Exporting ${selectedSegment.name} CSV roster...`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057]"
                >
                  <Download className="size-3.5" /> Export Roster
                </button>
                <button
                  onClick={() => toast.info(`Attaching automated sequence to ${selectedSegment.name}...`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057]"
                >
                  <Zap className="size-3.5" /> Attach Automation
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSegment(null)}
                  className="px-4 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#e9ecef] text-[#495057] font-semibold text-xs transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    toast.success(`Campaign initialized for ${selectedSegment.name}!`);
                    setSelectedSegment(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors"
                >
                  <Megaphone className="size-3.5" /> Launch Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
