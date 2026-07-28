import React, { useState } from "react";
import {
  Download,
  FileText,
  ExternalLink,
  Share2,
  Presentation,
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  FlaskConical,
  Heart,
  AlertTriangle,
  BarChart3,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";
import { SP_EMPLOYERS, SP_EMPLOYER_COST_TREND, type SPEmployer } from "../../data/smartypantsData";

const engagementData = [
  { month: "Jan", apex: 72, pinnacle: 60, atlas: 82, horizon: 76 },
  { month: "Feb", apex: 73, pinnacle: 61, atlas: 84, horizon: 77 },
  { month: "Mar", apex: 74, pinnacle: 62, atlas: 85, horizon: 78 },
  { month: "Apr", apex: 75, pinnacle: 63, atlas: 86, horizon: 79 },
  { month: "May", apex: 76, pinnacle: 64, atlas: 87, horizon: 80 },
  { month: "Jun", apex: 78, pinnacle: 65, atlas: 88, horizon: 82 },
];

export function SPEmployerAnalytics() {
  const [selectedEmployer, setSelectedEmployer] = useState<SPEmployer | null>(null);

  const totalMembers = SP_EMPLOYERS.reduce((a, e) => a + e.members, 0);
  const avgEngagement = Math.round(SP_EMPLOYERS.reduce((a, e) => a + e.engagement, 0) / SP_EMPLOYERS.length);
  const avgROI = (SP_EMPLOYERS.reduce((a, e) => a + e.roi, 0) / SP_EMPLOYERS.length).toFixed(1);

  return (
    <ClassicLayout
      title="Employer Analytics"
      subtitleNote="Automatically generate employer ROI reports with engagement metrics, utilization data, and cost analysis."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Employers", val: SP_EMPLOYERS.length.toString() },
        { label: "Total Members", val: totalMembers.toLocaleString() },
        { label: "Avg ROI", val: `${avgROI}x` },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success("Generating PDF report...")} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs">
            <FileText className="size-3.5 text-[#dc3545]" /> PDF
          </button>
          <button onClick={() => toast.success("Opening presentation mode...")} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs">
            <Presentation className="size-3.5 text-[#007bff]" /> Present
          </button>
          <button onClick={() => toast.success("Exporting to CSV...")} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs">
            <Download className="size-3.5 text-[#28a745]" /> CSV
          </button>
          <button onClick={() => toast.success("Share link copied!")} className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs">
            <Share2 className="size-3.5 text-[#6c757d]" /> Share
          </button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-1">
        {[
          { label: "Annual Exams", value: `${Math.round(SP_EMPLOYERS.reduce((a, e) => a + e.annualExams, 0) / SP_EMPLOYERS.length)}%`, icon: CheckCircle2, color: "#28a745" },
          { label: "Preventive Care", value: `${Math.round(SP_EMPLOYERS.reduce((a, e) => a + e.preventiveCare, 0) / SP_EMPLOYERS.length)}%`, icon: ShieldCheck, color: "#17a2b8" },
          { label: "Lab Completion", value: `${Math.round(SP_EMPLOYERS.reduce((a, e) => a + e.labCompletion, 0) / SP_EMPLOYERS.length)}%`, icon: FlaskConical, color: "#007bff" },
          { label: "Preventive Savings", value: "$342K", icon: DollarSign, color: "#28a745" },
          { label: "ER Avoidance", value: "$186K", icon: AlertTriangle, color: "#dc3545" },
          { label: "PC Utilization", value: "85%", icon: Activity, color: "#e61952" },
          { label: "Chronic Engage", value: "72%", icon: Heart, color: "#673ab7" },
          { label: "Satisfaction", value: "4.7/5", icon: TrendingUp, color: "#ffc107" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-[#dee2e6] rounded shadow-2xs p-2.5 flex flex-col items-center text-center gap-1">
              <Icon className="size-4" style={{ color: card.color }} />
              <div className="text-sm font-extrabold text-[#212529] tabular-nums">{card.value}</div>
              <div className="text-[9px] text-[#6c757d] font-medium leading-tight">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Employer Overview Table */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden mb-1">
        <div className="px-4 py-3 border-b border-[#dee2e6]">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Employer Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3">Employer</th>
                <th className="py-2.5 px-3">Members</th>
                <th className="py-2.5 px-3">Active</th>
                <th className="py-2.5 px-3">Engagement</th>
                <th className="py-2.5 px-3">Utilization</th>
                <th className="py-2.5 px-3">Cost PMPM</th>
                <th className="py-2.5 px-3">Claims</th>
                <th className="py-2.5 px-3">Visits</th>
                <th className="py-2.5 px-3">ROI</th>
                <th className="py-2.5 px-3">Review Date</th>
                <th className="py-2.5 px-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {SP_EMPLOYERS.map((emp) => (
                <tr key={emp.name} className={`hover:bg-[#f8f9fa] transition-colors cursor-pointer ${selectedEmployer?.name === emp.name ? "bg-[#fff0f4]" : ""}`} onClick={() => setSelectedEmployer(emp)}>
                  <td className="py-2.5 px-3 font-bold">{emp.name}</td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.members}</td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.activeMembers}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-[#e9ecef] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#28a745]" style={{ width: `${emp.engagement}%` }} />
                      </div>
                      <span className="font-semibold tabular-nums">{emp.engagement}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.utilization}%</td>
                  <td className="py-2.5 px-3 font-semibold tabular-nums">${emp.costPMPM}</td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.claims.toLocaleString()}</td>
                  <td className="py-2.5 px-3 tabular-nums">{emp.visits.toLocaleString()}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">{emp.roi}x</span>
                  </td>
                  <td className="py-2.5 px-3 text-[#6c757d] font-mono text-[10px]">{emp.reviewDate}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button className="px-2 py-1 rounded text-[10px] font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-1">
        {/* Monthly Engagement Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Monthly Engagement Trend</h3>
              <p className="text-[11px] text-[#6c757d]">Engagement % by employer (Last 6 months)</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={false} tickLine={false} domain={[50, 100]} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="apex" stroke="#e61952" strokeWidth={2} dot={{ r: 3 }} name="Apex Technologies" />
                <Line type="monotone" dataKey="pinnacle" stroke="#007bff" strokeWidth={2} dot={{ r: 3 }} name="Pinnacle Corp" />
                <Line type="monotone" dataKey="atlas" stroke="#28a745" strokeWidth={2} dot={{ r: 3 }} name="Atlas Group" />
                <Line type="monotone" dataKey="horizon" stroke="#ffc107" strokeWidth={2} dot={{ r: 3 }} name="Horizon Medical" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Trend Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-3">
            <div>
              <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Cost PMPM Trend</h3>
              <p className="text-[11px] text-[#6c757d]">Cost per member per month by employer</p>
            </div>
          </div>
          <div className="flex-1 min-h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SP_EMPLOYER_COST_TREND} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={false} tickLine={false} domain={[80, 170]} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }} formatter={(value: number) => [`$${value}`, ""]} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Line type="monotone" dataKey="apex" stroke="#e61952" strokeWidth={2} dot={{ r: 3 }} name="Apex" />
                <Line type="monotone" dataKey="pinnacle" stroke="#007bff" strokeWidth={2} dot={{ r: 3 }} name="Pinnacle" />
                <Line type="monotone" dataKey="atlas" stroke="#28a745" strokeWidth={2} dot={{ r: 3 }} name="Atlas" />
                <Line type="monotone" dataKey="horizon" stroke="#ffc107" strokeWidth={2} dot={{ r: 3 }} name="Horizon" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Employer Detail Panel */}
      {selectedEmployer && (
        <div className="bg-white border border-[#e61952]/30 rounded shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#dee2e6] mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#212529]">{selectedEmployer.name} — Detailed Report</h3>
              <p className="text-[11px] text-[#6c757d]">{selectedEmployer.members} members · Next review: {selectedEmployer.reviewDate}</p>
            </div>
            <button onClick={() => setSelectedEmployer(null)} className="size-7 rounded border border-[#dee2e6] flex items-center justify-center text-[#495057] hover:bg-[#f8f9fa]">
              <X className="size-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Annual Exams", value: `${selectedEmployer.annualExams}%` },
              { label: "Preventive Care", value: `${selectedEmployer.preventiveCare}%` },
              { label: "Lab Completion", value: `${selectedEmployer.labCompletion}%` },
              { label: "Engagement", value: `${selectedEmployer.engagement}%` },
              { label: "Utilization", value: `${selectedEmployer.utilization}%` },
              { label: "ROI", value: `${selectedEmployer.roi}x` },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded bg-[#f8f9fa] border border-[#dee2e6] text-center">
                <div className="text-lg font-extrabold text-[#212529] tabular-nums">{item.value}</div>
                <div className="text-[10px] text-[#6c757d] font-medium mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>

          {/* ROI Calculation */}
          <div className="mt-4 pt-4 border-t border-[#dee2e6]">
            <h4 className="text-xs font-bold text-[#343a40] uppercase tracking-wide mb-3">Automatic ROI Calculation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h5 className="text-[11px] font-bold text-[#6c757d] mb-2">INPUTS</h5>
                <div className="space-y-1.5">
                  {[
                    { label: "Employer Cost", value: `$${(selectedEmployer.costPMPM * selectedEmployer.members * 12).toLocaleString()}` },
                    { label: "Membership Fees", value: `$${(selectedEmployer.members * 150 * 12).toLocaleString()}` },
                    { label: "Total Claims", value: selectedEmployer.claims.toLocaleString() },
                    { label: "Total Visits", value: selectedEmployer.visits.toLocaleString() },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-xs p-2 rounded bg-[#f8f9fa] border border-[#dee2e6]">
                      <span className="text-[#6c757d]">{item.label}</span>
                      <span className="font-bold text-[#212529]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="text-[11px] font-bold text-[#6c757d] mb-2">OUTPUTS</h5>
                <div className="space-y-1.5">
                  {[
                    { label: "Estimated Savings", value: `$${Math.round(selectedEmployer.roi * selectedEmployer.costPMPM * selectedEmployer.members * 0.8).toLocaleString()}` },
                    { label: "ROI", value: `${selectedEmployer.roi}x` },
                    { label: "Cost Avoided", value: `$${Math.round(selectedEmployer.visits * 85).toLocaleString()}` },
                    { label: "Preventive Care Impact", value: `${selectedEmployer.preventiveCare}% completion` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between text-xs p-2 rounded bg-[#d4edda] border border-[#c3e6cb]">
                      <span className="text-[#155724]">{item.label}</span>
                      <span className="font-bold text-[#155724]">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
