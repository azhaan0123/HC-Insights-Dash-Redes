import React, { useState } from "react";
import {
  Building2,
  Users,
  Shield,
  Mail,
  MessageSquare,
  FileText,
  Phone,
  Globe,
  Tag,
  Sliders,
  Layers,
  Zap,
  Database,
  Link2,
  Webhook,
  ShieldCheck,
  ClipboardList,
  Eye,
  Bell,
  Lock,
  CheckCircle2,
  Save,
} from "../../lib/icons";
import { toast } from "sonner";
import { ClassicLayout } from "../action-centre-classic/ClassicLayout";

type SettingsTab = "organization" | "communication" | "crm" | "integrations" | "compliance";

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "communication", label: "Communication", icon: Mail },
  { id: "crm", label: "CRM", icon: Users },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "compliance", label: "Compliance", icon: ShieldCheck },
];

const INTEGRATIONS = [
  { name: "AtlasMD", status: "Connected", icon: Database, color: "#28a745", description: "Electronic Health Record system" },
  { name: "Google Sheets", status: "Connected", icon: FileText, color: "#1a73e8", description: "Operational database backend" },
  { name: "Google Workspace", status: "Connected", icon: Globe, color: "#ea4335", description: "Email and calendar integration" },
  { name: "Twilio", status: "Connected", icon: Phone, color: "#f22f46", description: "SMS messaging platform" },
  { name: "SendGrid", status: "Not Connected", icon: Mail, color: "#1a82e2", description: "Transactional email service" },
  { name: "Mailgun", status: "Not Connected", icon: Mail, color: "#f06b54", description: "Email delivery API" },
  { name: "Postmark", status: "Not Connected", icon: Mail, color: "#ffde00", description: "Transactional email delivery" },
  { name: "Zapier", status: "Connected", icon: Zap, color: "#ff4a00", description: "Workflow automation platform" },
  { name: "Webhook", status: "Active", icon: Webhook, color: "#495057", description: "Custom webhook endpoints" },
];

export function SPSettings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("organization");

  return (
    <ClassicLayout
      title="Settings"
      subtitleNote="Configure your Care Operations Hub — organization, communication, CRM, integrations, and compliance settings."
      showSwitchToModern={false}
      activeNavIndex={-1}
      filterPills={[
        { label: "Practice", val: "SmartyPants Medicine" },
      ]}
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap mb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded text-xs transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? "border-2 border-[#e61952] bg-[#fff0f4] text-[#212529] font-bold shadow-2xs"
                  : "border border-[#dee2e6] bg-white text-[#495057] hover:bg-[#f8f9fa] font-medium"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Organization Tab */}
      {activeTab === "organization" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Practice Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Practice Name", value: "SmartyPants Medicine", type: "text" },
                { label: "EIN / Tax ID", value: "XX-XXXXXXX", type: "text" },
                { label: "Address", value: "1234 Main Street, Lawrence, KS 66044", type: "text" },
                { label: "Phone", value: "(913) 555-0100", type: "text" },
                { label: "Email", value: "info@smartypantsmedicine.com", type: "email" },
                { label: "Website", value: "https://smartypantsmedicine.com", type: "url" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-semibold text-[#495057] mb-1">{field.label}</label>
                  <input type={field.type} defaultValue={field.value} className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs text-[#212529] focus:outline-none focus:border-[#e61952]" />
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("Practice information saved!")} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs transition-colors">
              <Save className="size-3.5" /> Save Changes
            </button>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Users & Permissions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                  {[
                    { name: "Dr. Josh Umbehr", email: "josh@smartypants.com", role: "Admin", status: "Active" },
                    { name: "Dr. Lisa Dang", email: "lisa@smartypants.com", role: "Provider", status: "Active" },
                    { name: "Sarah Jenkins, RN", email: "sarah@smartypants.com", role: "Care Coordinator", status: "Active" },
                    { name: "Maria Lopez, MA", email: "maria@smartypants.com", role: "Medical Assistant", status: "Active" },
                    { name: "Lisa Chen", email: "lchen@smartypants.com", role: "Admin", status: "Active" },
                  ].map((user) => (
                    <tr key={user.name} className="hover:bg-[#f8f9fa]">
                      <td className="py-2.5 px-3 font-bold">{user.name}</td>
                      <td className="py-2.5 px-3 text-[#6c757d]">{user.email}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#e9ecef] text-[#495057] border border-[#dee2e6]">{user.role}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">{user.status}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button className="px-2 py-1 rounded text-[10px] font-semibold bg-white border border-[#dee2e6] hover:bg-[#f8f9fa] text-[#495057] shadow-2xs">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Communication Tab */}
      {activeTab === "communication" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Email Configuration (SMTP)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "SMTP Host", value: "smtp.sendgrid.net" },
                { label: "SMTP Port", value: "587" },
                { label: "Username", value: "apikey" },
                { label: "From Email", value: "noreply@smartypantsmedicine.com" },
                { label: "From Name", value: "SmartyPants Medicine" },
                { label: "Reply-To", value: "info@smartypantsmedicine.com" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-semibold text-[#495057] mb-1">{field.label}</label>
                  <input type="text" defaultValue={field.value} className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs text-[#212529] focus:outline-none focus:border-[#e61952]" />
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("SMTP settings saved!")} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs">
              <Save className="size-3.5" /> Save SMTP Settings
            </button>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">SMS Configuration (Twilio)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Account SID", value: "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
                { label: "Auth Token", value: "••••••••••••••••" },
                { label: "Sender Number", value: "+1 (913) 555-0199" },
                { label: "Messaging Service SID", value: "MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-semibold text-[#495057] mb-1">{field.label}</label>
                  <input type="text" defaultValue={field.value} className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs text-[#212529] focus:outline-none focus:border-[#e61952]" />
                </div>
              ))}
            </div>
            <button onClick={() => toast.success("Twilio settings saved!")} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded bg-[#e61952] hover:bg-[#c41344] text-white text-xs font-bold shadow-2xs">
              <Save className="size-3.5" /> Save Twilio Settings
            </button>
          </div>
        </div>
      )}

      {/* CRM Tab */}
      {activeTab === "crm" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Patient Tags</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Diabetes", "Hypertension", "Obesity", "COPD", "Prediabetes", "Mental Health", "HRT", "High Utilizer", "VIP", "New Patient", "Chronic Care", "Preventive"].map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded bg-[#e9ecef] text-[#495057] text-[11px] font-medium border border-[#dee2e6] flex items-center gap-1">
                  <Tag className="size-2.5 text-[#e61952]" />
                  {tag}
                </span>
              ))}
            </div>
            <button onClick={() => toast.info("Add tag dialog...")} className="text-[11px] font-bold text-[#e61952] hover:underline">+ Add New Tag</button>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Custom Fields</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                    <th className="py-2 px-3">Field Name</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Required</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                  {[
                    { name: "Preferred Pharmacy", type: "Text", required: "No", status: "Active" },
                    { name: "Emergency Contact", type: "Text", required: "Yes", status: "Active" },
                    { name: "Insurance Plan", type: "Dropdown", required: "Yes", status: "Active" },
                    { name: "Communication Opt-in", type: "Boolean", required: "Yes", status: "Active" },
                    { name: "Referral Source", type: "Dropdown", required: "No", status: "Active" },
                  ].map((field) => (
                    <tr key={field.name} className="hover:bg-[#f8f9fa]">
                      <td className="py-2 px-3 font-bold">{field.name}</td>
                      <td className="py-2 px-3 text-[#6c757d]">{field.type}</td>
                      <td className="py-2 px-3">{field.required}</td>
                      <td className="py-2 px-3"><span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#d4edda] text-[#155724] border border-[#c3e6cb]">{field.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Automation Defaults</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Default Email Delay", value: "3 days" },
                { label: "Default SMS Delay", value: "7 days" },
                { label: "Max Retry Attempts", value: "3" },
                { label: "Escalation Threshold", value: "30 days" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="block text-[11px] font-semibold text-[#495057] mb-1">{field.label}</label>
                  <input type="text" defaultValue={field.value} className="w-full px-3 py-2 rounded border border-[#dee2e6] text-xs text-[#212529] focus:outline-none focus:border-[#e61952]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
          <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Connected Services</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INTEGRATIONS.map((int_item) => {
              const Icon = int_item.icon;
              const connected = int_item.status === "Connected" || int_item.status === "Active";
              return (
                <div key={int_item.name} className={`p-4 rounded border ${connected ? "border-[#c3e6cb] bg-[#f8fff9]" : "border-[#dee2e6] bg-[#f8f9fa]"} flex items-start gap-3`}>
                  <div className="size-9 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: int_item.color + "15" }}>
                    <Icon className="size-4" style={{ color: int_item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#212529]">{int_item.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border ${connected ? "bg-[#d4edda] text-[#155724] border-[#c3e6cb]" : "bg-[#e9ecef] text-[#6c757d] border-[#dee2e6]"}`}>
                        {int_item.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#6c757d] mt-0.5">{int_item.description}</p>
                    <button
                      onClick={() => toast.info(`${connected ? "Managing" : "Connecting"} ${int_item.name}...`)}
                      className="mt-2 text-[10px] font-bold text-[#e61952] hover:underline"
                    >
                      {connected ? "Manage" : "Connect"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === "compliance" && (
        <div className="space-y-4">
          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">HIPAA Compliance Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: "HIPAA Logging", status: "Enabled", icon: Shield, color: "#28a745" },
                { label: "Audit Logs", status: "Active", icon: ClipboardList, color: "#28a745" },
                { label: "Consent Tracking", status: "Enabled", icon: CheckCircle2, color: "#28a745" },
                { label: "SMS Opt-in", status: "Required", icon: MessageSquare, color: "#007bff" },
                { label: "Email Opt-out", status: "Active", icon: Mail, color: "#007bff" },
                { label: "BAA Status", status: "Signed", icon: Lock, color: "#28a745" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="p-3 rounded border border-[#c3e6cb] bg-[#f8fff9] flex items-center gap-3">
                    <div className="size-8 rounded flex items-center justify-center" style={{ backgroundColor: item.color + "15" }}>
                      <Icon className="size-4" style={{ color: item.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#212529]">{item.label}</div>
                      <div className="text-[10px] font-semibold text-[#155724]">{item.status}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Communication Preferences</h3>
            <div className="space-y-3">
              {[
                { label: "Require SMS opt-in before sending automated texts", enabled: true },
                { label: "Include unsubscribe link in all marketing emails", enabled: true },
                { label: "Log all patient communications to audit trail", enabled: true },
                { label: "Require double opt-in for newsletter subscriptions", enabled: false },
                { label: "Auto-archive communications older than 7 years", enabled: false },
              ].map((pref) => (
                <div key={pref.label} className="flex items-center justify-between p-3 rounded border border-[#dee2e6] bg-[#f8f9fa]">
                  <span className="text-xs text-[#343a40] font-medium">{pref.label}</span>
                  <div
                    onClick={() => toast.info("Toggle preference...")}
                    className={`w-9 h-5 rounded-full cursor-pointer transition-colors relative ${pref.enabled ? "bg-[#28a745]" : "bg-[#dee2e6]"}`}
                  >
                    <div className={`size-4 bg-white rounded-full shadow absolute top-0.5 transition-all ${pref.enabled ? "left-4" : "left-0.5"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#dee2e6] rounded shadow-2xs p-5">
            <h3 className="text-xs font-bold text-[#343a40] uppercase tracking-wide pb-3 border-b border-[#dee2e6] mb-4">Recent Audit Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#e9ecef] text-[#343a40] text-[11px] font-semibold border-b border-[#dee2e6]">
                    <th className="py-2 px-3">Timestamp</th>
                    <th className="py-2 px-3">User</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dee2e6] text-xs text-[#212529]">
                  {[
                    { time: "2026-07-28 10:30 AM", user: "Dr. Josh Umbehr", action: "Patient Record Viewed", detail: "SP-1001 Sarah Mitchell" },
                    { time: "2026-07-28 09:15 AM", user: "Sarah Jenkins, RN", action: "Email Sent", detail: "Annual Exam Reminder to 42 patients" },
                    { time: "2026-07-27 04:00 PM", user: "System", action: "Campaign Published", detail: "Monthly Newsletter — July" },
                    { time: "2026-07-27 02:30 PM", user: "Maria Lopez, MA", action: "Task Completed", detail: "TSK-010 Review Request — Emily Chen" },
                    { time: "2026-07-27 11:30 AM", user: "System", action: "Lead Created", detail: "LD-001 Mark Stevens via Website Form" },
                  ].map((log, idx) => (
                    <tr key={idx} className="hover:bg-[#f8f9fa]">
                      <td className="py-2 px-3 font-mono text-[10px] text-[#6c757d]">{log.time}</td>
                      <td className="py-2 px-3 font-bold">{log.user}</td>
                      <td className="py-2 px-3 text-[#495057]">{log.action}</td>
                      <td className="py-2 px-3 text-[#6c757d]">{log.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </ClassicLayout>
  );
}
