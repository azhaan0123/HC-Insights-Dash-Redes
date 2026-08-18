import React, { useState } from "react";
import {
  Download,
  FileText,
  BarChart3,
  Users,
  Megaphone,
  UserCheck,
  Star,
  Building2,
  TrendingUp,
  Mail,
  MessageSquare,
  Zap,
  ShieldCheck,
  Activity,
  Calendar,
  ExternalLink,
  ArrowRight,
} from "../../lib/icons";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";

const REPORT_CARDS = [
  { id: "engagement", label: "Patient Engagement", icon: Activity, color: "#e61952", value: "78%", sub: "Active engagement rate" },
  { id: "campaign", label: "Campaign Performance", icon: Megaphone, color: "#007bff", value: "64.2%", sub: "Average open rate" },
  { id: "staff", label: "Staff Productivity", icon: UserCheck, color: "#28a745", value: "142", sub: "Tasks completed this month" },
  { id: "reviews", label: "Review Growth", icon: Star, color: "#ffc107", value: "+23", sub: "New reviews this quarter" },
  { id: "employer-roi", label: "Employer ROI", icon: Building2, color: "#17a2b8", value: "18.5x", sub: "Average across employers" },
  { id: "lead-funnel", label: "Lead Funnel", icon: TrendingUp, color: "#673ab7", value: "34", sub: "Active leads in pipeline" },
  { id: "email", label: "Email Performance", icon: Mail, color: "#007bff", value: "89.2%", sub: "Delivery rate" },
  { id: "sms", label: "SMS Performance", icon: MessageSquare, color: "#28a745", value: "96.1%", sub: "Delivery rate" },
  { id: "automation", label: "Automation Success", icon: Zap, color: "#e61952", value: "93.4%", sub: "Success rate" },
  { id: "preventive", label: "Preventive Care", icon: ShieldCheck, color: "#dc3545", value: "72%", sub: "Completion rate" },
];

const funnelData = [
  { name: "Total Patients", value: 1420, fill: "#e61952" },
  { name: "Annual Exam Due", value: 342, fill: "#dc3545" },
  { name: "Contacted", value: 310, fill: "#ffc107" },
  { name: "Scheduled", value: 186, fill: "#28a745" },
  { name: "Completed", value: 148, fill: "#007bff" },
];

const weeklyData = [
  { day: "Mon", tasks: 32, emails: 45, texts: 18 },
  { day: "Tue", tasks: 28, emails: 52, texts: 22 },
  { day: "Wed", tasks: 35, emails: 48, texts: 20 },
  { day: "Thu", tasks: 22, emails: 38, texts: 15 },
  { day: "Fri", tasks: 41, emails: 55, texts: 25 },
  { day: "Sat", tasks: 8, emails: 12, texts: 5 },
  { day: "Sun", tasks: 3, emails: 8, texts: 2 },
];

const leaderboardData = [
  { name: "Sarah Jenkins, RN", tasks: 68, score: 95 },
  { name: "Maria Lopez, MA", tasks: 54, score: 88 },
  { name: "Dr. Josh Umbehr", tasks: 42, score: 92 },
  { name: "Dr. Lisa Dang", tasks: 38, score: 90 },
  { name: "Lisa Chen (Admin)", tasks: 31, score: 85 },
];

export function SPReports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  return (
    <ClassicLayout
      title="Reports & Insights"
      subtitleNote="Operational intelligence — explore engagement, campaigns, staff performance, employer ROI, and more."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Period", val: "July 2026" },
        { label: "Reports Available", val: REPORT_CARDS.length.toString() },
      ]}
      headerActions={
        <div className="flex items-center gap-2">
          {[
            { label: "PDF", icon: FileText, color: "#dc3545" },
            { label: "CSV", icon: Download, color: "#28a745" },
            { label: "Google Sheets", icon: FileText, color: "#1a73e8" },
          ].map((exp) => {
            const Icon = exp.icon;
            return (
              <button
                key={exp.label}
                onClick={() => toast.success(`Exporting as ${exp.label}...`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#dee2e6] bg-white hover:bg-[#f8f9fa] text-xs font-semibold text-[#495057] shadow-2xs transition-colors"
              >
                <Icon className="size-3.5" style={{ color: exp.color }} />
                <span>{exp.label}</span>
              </button>
            );
          })}
        </div>
      }
    >
      {/* Report Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-1">
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedReport === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setSelectedReport(isSelected ? null : card.id)}
              className={`bg-white rounded border shadow-2xs p-3 cursor-pointer transition-all group ${
                isSelected ? "border-[#e61952] ring-1 ring-[#e61952]/20" : "border-[#dee2e6] hover:border-[#e61952]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="size-4" style={{ color: card.color }} />
                <ExternalLink className="size-3 text-[#dee2e6] group-hover:text-[#e61952] transition-colors" />
              </div>
              <div className="text-lg font-extrabold text-[#212529] tabular-nums">{card.value}</div>
              <div className="text-[10px] font-bold text-[#343a40] mt-0.5">{card.label}</div>
              <div className="text-[9px] text-[#6c757d] mt-0.5">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funnel Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[340px]">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Annual Exam Funnel
          </h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dee2e6" />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#343a40", fontWeight: 600 }} axisLine={false} tickLine={false} width={100} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-4 flex flex-col min-h-[340px]">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-3">
            Weekly Activity Breakdown
          </h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dee2e6" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={{ stroke: "#dee2e6" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6c757d" }} axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: "#fff", borderColor: "#dee2e6", fontSize: "11px", borderRadius: "4px" }} />
                <Bar dataKey="tasks" fill="#e61952" radius={[2, 2, 0, 0]} name="Tasks" />
                <Bar dataKey="emails" fill="#007bff" radius={[2, 2, 0, 0]} name="Emails" />
                <Bar dataKey="texts" fill="#28a745" radius={[2, 2, 0, 0]} name="Texts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="bg-white border border-[#dee2e6] rounded shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#dee2e6]">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide">Staff Productivity Leaderboard</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                <th className="py-2.5 px-3 w-10">Rank</th>
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Tasks Completed</th>
                <th className="py-2.5 px-3">Performance Score</th>
                <th className="py-2.5 px-3">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
              {leaderboardData.map((staff, idx) => (
                <tr key={staff.name} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex size-6 rounded-full items-center justify-center text-[10px] font-bold text-white ${
                      idx === 0 ? "bg-[#ffc107]" : idx === 1 ? "bg-[#adb5bd]" : idx === 2 ? "bg-[#cd7f32]" : "bg-[#e9ecef] text-[#6c757d]"
                    }`}>{idx + 1}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold">{staff.name}</td>
                  <td className="py-2.5 px-3 tabular-nums font-semibold">{staff.tasks}</td>
                  <td className="py-2.5 px-3 tabular-nums font-bold" style={{ color: staff.score >= 90 ? "#28a745" : "#ffc107" }}>{staff.score}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-24 h-2 bg-[#e9ecef] rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-[#e61952]" style={{ width: `${staff.score}%` }} />
                      </div>
                      <span className="text-[10px] text-[#6c757d] tabular-nums">{staff.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClassicLayout>
  );
}
