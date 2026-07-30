export interface DbStatus {
  status: string;
  database: string;
  connected: boolean;
  timestamp: string;
  stats?: {
    patients: number;
    encounters: number;
    claims: number;
  };
}

export interface DbPatient {
  mrn: string;
  name: string;
  age: number;
  gender: string;
  employer: string;
  riskScore: number;
  classification: "Proactive" | "Reactive";
  awvStatus: "Pending" | "Completed";
  status: "Open" | "Confirmed" | "Deferred" | "Rejected" | "N/A";
  phone?: string;
  email?: string;
  conditions: string[];
  lastVisit?: string;
}

export interface DbCampaign {
  campaignId: string;
  name: string;
  type: "Patient" | "Lead" | "Employer";
  channel: "Email" | "SMS" | "Multi-Channel";
  status: "Active" | "Draft" | "Completed" | "Archived";
  audienceCount: number;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  repliesCount: number;
  attachments?: { name: string; size: string; fileType: string }[];
}

export interface DbAiAction {
  actionId: string;
  title: string;
  suggestedAction: string;
  agentType: string;
  priority: "critical" | "high" | "medium" | "low";
  confidence: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  rejectionNote?: string;
  patientName?: string;
  patientMrn?: string;
}

export interface DbAuditRecord {
  auditId: string;
  actionType: string;
  workflow: string;
  inputRef?: string;
  modelVersion?: string;
  rawOutput?: string;
  finalOutput?: string;
  confidence?: number;
  confidenceTier?: string;
  riskTier?: string;
  status: string;
  reviewerId?: string;
  reviewerReason?: string;
  reviewerNote?: string;
  decidedAt?: string;
}

const API_BASE = "http://localhost:5000/api";

export async function fetchDbStatus(): Promise<DbStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error("API Offline");
    return await res.json();
  } catch {
    return {
      status: "online (client mock)",
      database: "MongoDB In-Memory Engine",
      connected: true,
      timestamp: new Date().toISOString(),
      stats: { patients: 1420, encounters: 2840, claims: 5620 },
    };
  }
}

export async function fetchPatients(params?: { employer?: string; search?: string; limit?: number }): Promise<DbPatient[]> {
  try {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${API_BASE}/patients?${query}`);
    if (!res.ok) throw new Error("Failed to fetch patients");
    const json = await res.json();
    return Array.isArray(json) ? json : json.data || [];
  } catch {
    // Return fallback structured patient records
    return [
      { mrn: "MRN-1001", name: "Sarah Mitchell", age: 54, gender: "Female", employer: "Apex Technologies", riskScore: 2.84, classification: "Reactive", awvStatus: "Completed", conditions: ["Hypertension", "Hyperlipidemia"], status: "Open" },
      { mrn: "MRN-1002", name: "James Rodriguez", age: 62, gender: "Male", employer: "Pinnacle Corp", riskScore: 3.12, classification: "Reactive", awvStatus: "Pending", conditions: ["Type 2 Diabetes", "Hypertension"], status: "Open" },
      { mrn: "MRN-1003", name: "Emily Chen", age: 41, gender: "Female", employer: "Atlas Group", riskScore: 1.15, classification: "Proactive", awvStatus: "Completed", conditions: ["Asthma"], status: "Confirmed" },
      { mrn: "MRN-1004", name: "Michael Thompson", age: 68, gender: "Male", employer: "Apex Technologies", riskScore: 4.45, classification: "Reactive", awvStatus: "Pending", conditions: ["CKD Stage 3", "Hypertension"], status: "Open" },
    ];
  }
}

export async function fetchCampaigns(): Promise<DbCampaign[]> {
  try {
    const res = await fetch(`${API_BASE}/campaigns`);
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    return await res.json();
  } catch {
    return [
      { campaignId: "CMP-301", name: "Annual Exam Reminder Q4", type: "Patient", channel: "Email", status: "Active", audienceCount: 342, sentCount: 342, deliveredCount: 338, openedCount: 215, clickedCount: 48, repliesCount: 12 },
      { campaignId: "CMP-302", name: "Diabetes HbA1c Lab Outreach", type: "Patient", channel: "Multi-Channel", status: "Active", audienceCount: 218, sentCount: 218, deliveredCount: 212, openedCount: 168, clickedCount: 82, repliesCount: 34 },
    ];
  }
}

export async function createDbCampaign(campaign: Partial<DbCampaign>): Promise<DbCampaign> {
  try {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(campaign),
    });
    if (!res.ok) throw new Error("Failed to create campaign");
    return await res.json();
  } catch {
    return {
      campaignId: `CMP-${Math.floor(Math.random() * 900 + 100)}`,
      name: campaign.name || "New Campaign",
      type: campaign.type || "Patient",
      channel: campaign.channel || "Email",
      status: campaign.status || "Active",
      audienceCount: campaign.audienceCount || 100,
      sentCount: campaign.sentCount || 100,
      deliveredCount: 98,
      openedCount: 45,
      clickedCount: 12,
      repliesCount: 3,
      attachments: campaign.attachments || [],
    };
  }
}

export async function fetchAiActions(): Promise<DbAiAction[]> {
  try {
    const res = await fetch(`${API_BASE}/actions`);
    if (!res.ok) throw new Error("Failed to fetch actions");
    return await res.json();
  } catch {
    return [
      { actionId: "ACT-501", title: "Escalated Care Gap: Michael Thompson", suggestedAction: "Schedule urgent CKD & BP Follow-up consult", agentType: "Clinical Risk Agent", priority: "critical", confidence: 96, status: "pending", patientName: "Michael Thompson" },
      { actionId: "ACT-502", title: "AWV Outreach: James Rodriguez", suggestedAction: "Send automated SMS reminder for DPC $0 Copay Annual Exam", agentType: "Engagement Agent", priority: "high", confidence: 91, status: "pending", patientName: "James Rodriguez" },
    ];
  }
}

export async function updateDbAiAction(actionId: string, status: "approved" | "rejected", reason?: string, note?: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/actions/${actionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason: reason, rejectionNote: note }),
    });
  } catch (err) {
    console.warn("Could not update action on DB server, using client state", err);
  }
}

export async function fetchAuditLogs(): Promise<DbAuditRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    if (!res.ok) throw new Error("Failed to fetch audit logs");
    return await res.json();
  } catch {
    return [];
  }
}

export async function createAuditRecord(record: Partial<DbAuditRecord>): Promise<DbAuditRecord> {
  try {
    const res = await fetch(`${API_BASE}/audit-logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error("Failed to create audit log");
    return await res.json();
  } catch {
    return {
      auditId: `aud-${Date.now()}`,
      actionType: record.actionType || "PLATFORM_ACTION",
      workflow: record.workflow || "System Audit",
      status: record.status || "executed",
      decidedAt: new Date().toISOString(),
    };
  }
}
