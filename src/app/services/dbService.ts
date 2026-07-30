import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function fetchDbStatus(): Promise<DbStatus> {
  try {
    const { count: patients } = await supabase.from('api_patient').select('*', { count: 'exact', head: true });
    const { count: encounters } = await supabase.from('api_encounter').select('*', { count: 'exact', head: true });
    const { count: claims } = await supabase.from('api_claim').select('*', { count: 'exact', head: true });
    
    return {
      status: "online",
      database: "Supabase (PostgreSQL)",
      connected: true,
      timestamp: new Date().toISOString(),
      stats: {
        patients: patients || 0,
        encounters: encounters || 0,
        claims: claims || 0,
      }
    };
  } catch (error) {
    console.error("Failed to fetch DB status:", error);
    return {
      status: "offline",
      database: "Supabase",
      connected: false,
      timestamp: new Date().toISOString(),
    };
  }
}

export async function fetchPatients(params?: { employer?: string; search?: string; limit?: number }): Promise<DbPatient[]> {
  let query = supabase.from('api_patient').select('*');
  
  if (params?.employer) {
    query = query.eq('employer', params.employer);
  }
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  
  // Default limit if not specified
  query = query.limit(params?.limit || 200).order('risk_score', { ascending: false });

  const { data, error } = await query;
  
  if (error) {
    console.error("Failed to fetch patients:", error);
    return [];
  }

  return (data || []).map((d: any) => ({
    mrn: d.mrn,
    name: d.name,
    age: d.age,
    gender: d.gender,
    employer: d.employer,
    riskScore: Number(d.risk_score),
    classification: d.classification,
    awvStatus: d.awv_status,
    status: d.status,
    phone: d.phone,
    email: d.email,
    conditions: d.conditions || [],
    lastVisit: d.last_visit,
  }));
}

export async function fetchCampaigns(): Promise<DbCampaign[]> {
  const { data, error } = await supabase.from('api_campaign').select('*').order('created_at', { ascending: false });
  
  if (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }

  return (data || []).map((d: any) => ({
    campaignId: d.campaign_id,
    name: d.name,
    type: d.type,
    channel: d.channel,
    status: d.status,
    audienceCount: d.audience_count,
    sentCount: d.sent_count,
    deliveredCount: d.delivered_count,
    openedCount: d.opened_count,
    clickedCount: d.clicked_count,
    repliesCount: d.replies_count,
    attachments: d.attachments || [],
  }));
}

export async function createDbCampaign(campaign: Partial<DbCampaign>): Promise<DbCampaign> {
  const campaign_id = `CMP-${Math.floor(Math.random() * 900 + 100)}`;
  
  const newRow = {
    campaign_id,
    name: campaign.name || "New Campaign",
    type: campaign.type || "Patient",
    channel: campaign.channel || "Email",
    status: campaign.status || "Active",
    audience_count: campaign.audienceCount || 100,
    sent_count: campaign.sentCount || 100,
    delivered_count: campaign.deliveredCount || 0,
    opened_count: campaign.openedCount || 0,
    clicked_count: campaign.clickedCount || 0,
    replies_count: campaign.repliesCount || 0,
    attachments: campaign.attachments || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('api_campaign').insert([newRow]).select().single();
  
  if (error) {
    console.error("Failed to create campaign:", error);
    throw new Error(error.message);
  }

  return {
    campaignId: data.campaign_id,
    name: data.name,
    type: data.type,
    channel: data.channel,
    status: data.status,
    audienceCount: data.audience_count,
    sentCount: data.sent_count,
    deliveredCount: data.delivered_count,
    openedCount: data.opened_count,
    clickedCount: data.clicked_count,
    repliesCount: data.replies_count,
    attachments: data.attachments || [],
  };
}

export async function fetchAiActions(): Promise<DbAiAction[]> {
  const { data, error } = await supabase.from('api_aiaction').select('*').order('confidence', { ascending: false });
  
  if (error) {
    console.error("Failed to fetch AI actions:", error);
    return [];
  }

  return (data || []).map((d: any) => ({
    actionId: d.action_id,
    title: d.title,
    suggestedAction: d.suggested_action,
    agentType: d.agent_type,
    priority: d.priority,
    confidence: d.confidence,
    status: d.status,
    rejectionReason: d.rejection_reason,
    rejectionNote: d.rejection_note,
    patientName: d.patient_name,
    patientMrn: d.patient_mrn,
  }));
}

export async function updateDbAiAction(actionId: string, status: "approved" | "rejected", reason?: string, note?: string): Promise<void> {
  const { error } = await supabase.from('api_aiaction')
    .update({ 
      status, 
      rejection_reason: reason || "", 
      rejection_note: note || "",
      updated_at: new Date().toISOString()
    })
    .eq('action_id', actionId);
    
  if (error) {
    console.error("Failed to update AI action:", error);
    throw new Error(error.message);
  }
}

export async function fetchAuditLogs(): Promise<DbAuditRecord[]> {
  const { data, error } = await supabase.from('api_auditlog').select('*').order('decided_at', { ascending: false }).limit(100);
  
  if (error) {
    console.error("Failed to fetch audit logs:", error);
    return [];
  }

  return (data || []).map((d: any) => ({
    auditId: d.audit_id,
    actionType: d.action_type,
    workflow: d.workflow,
    inputRef: d.input_ref,
    modelVersion: d.model_version,
    rawOutput: d.raw_output,
    finalOutput: d.final_output,
    confidence: d.confidence,
    confidenceTier: d.confidence_tier,
    riskTier: d.risk_tier,
    status: d.status,
    reviewerId: d.reviewer_id,
    reviewerReason: d.reviewer_reason,
    reviewerNote: d.reviewer_note,
    decidedAt: d.decided_at,
  }));
}

export async function createAuditRecord(record: Partial<DbAuditRecord>): Promise<DbAuditRecord> {
  const audit_id = `aud-${Date.now()}`;
  
  const newRow = {
    audit_id,
    action_type: record.actionType || "PLATFORM_ACTION",
    workflow: record.workflow || "System Audit",
    input_ref: record.inputRef || "",
    model_version: record.modelVersion || "helix-v2.4.1",
    raw_output: record.rawOutput || "",
    final_output: record.finalOutput || "",
    confidence: record.confidence || 90,
    confidence_tier: record.confidenceTier || "high",
    risk_tier: record.riskTier || "medium",
    status: record.status || "executed",
    reviewer_id: record.reviewerId || "current-user",
    reviewer_reason: record.reviewerReason || "",
    reviewer_note: record.reviewerNote || "",
    decided_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('api_auditlog').insert([newRow]).select().single();
  
  if (error) {
    console.error("Failed to create audit log:", error);
    throw new Error(error.message);
  }

  return {
    auditId: data.audit_id,
    actionType: data.action_type,
    workflow: data.workflow,
    inputRef: data.input_ref,
    modelVersion: data.model_version,
    rawOutput: data.raw_output,
    finalOutput: data.final_output,
    confidence: data.confidence,
    confidenceTier: data.confidence_tier,
    riskTier: data.risk_tier,
    status: data.status,
    reviewerId: data.reviewer_id,
    reviewerReason: data.reviewer_reason,
    reviewerNote: data.reviewer_note,
    decidedAt: data.decided_at,
  };
}

/**
 * PULL from Google Sheet -> PUSH to Supabase
 * Safely validates and upserts data from the Google Sheet Web App URL.
 */
export async function syncCampaignsFromSheet(webAppUrl?: string): Promise<{ success: boolean; rowsProcessed: number; error?: string }> {
  try {
    let url = (webAppUrl || import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL || '').trim();
    if (!url) throw new Error("No Google Sheet Web App URL provided in environment or arguments.");

    if (url.includes("docs.google.com/spreadsheets")) {
      throw new Error("You must use a Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec), not a Google Docs Spreadsheet link.");
    }
    
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`Failed to fetch from Sheet Web App (Status: ${res.status})`);
    const sheetData = await res.json();
    
    if (!Array.isArray(sheetData) || sheetData.length === 0) {
      return { success: true, rowsProcessed: 0 };
    }

    const validRows = [];
    const allowedStatuses = ["Active", "Draft", "Completed", "Archived", "Paused"];
    const allowedTypes = ["Patient", "Lead", "Employer", "Content", "Event", "Launch", "Newsletter", "Nurture", "Onboarding", "Promo", "Survey", "Webinar"];

    for (const row of sheetData) {
      // Support headers from both database format (campaign_id) and sheet format (Code, id, ID)
      const campaign_id = String(row.campaign_id || row.Code || row.code || row.id || row.ID || "").trim();
      if (!campaign_id) continue;
      
      const name = String(row.name || row.Campaign || row.title || row.Title || "Untitled Campaign").trim();
      const typeRaw = String(row.type || row.Type || "Patient").trim();
      const type = allowedTypes.includes(typeRaw) ? typeRaw : "Patient";

      const channel = String(row.channel || row.Channel || "Email").trim();
      const statusRaw = String(row.status || row.Status || "Draft").trim();
      const status = allowedStatuses.includes(statusRaw) ? statusRaw : "Draft";

      const audience_count = Number(row.audience_count ?? row.Audience ?? row.audience ?? 0) || 0;
      const sent_count = Number(row.sent_count ?? row.Sent ?? row.sent ?? 0) || 0;
      const delivered_count = Number(row.delivered_count ?? row.Delivered ?? row.delivered ?? 0) || 0;
      const opened_count = Number(row.opened_count ?? row.Opened ?? row.opened ?? 0) || 0;
      const clicked_count = Number(row.clicked_count ?? row.Clicked ?? row.clicked ?? 0) || 0;
      const replies_count = Number(row.replies_count ?? row.Replies ?? row.replies ?? 0) || 0;

      let attachments = [];
      try {
        attachments = typeof row.attachments === 'string' ? JSON.parse(row.attachments || "[]") : (row.attachments || []);
      } catch (e) {
        attachments = [];
      }

      validRows.push({
        campaign_id,
        name,
        type,
        channel,
        status,
        audience_count,
        sent_count,
        delivered_count,
        opened_count,
        clicked_count,
        replies_count,
        attachments,
        updated_at: new Date().toISOString(),
      });
    }

    if (validRows.length === 0) {
      return { success: true, rowsProcessed: 0 };
    }

    // Upsert to Supabase
    const { error } = await supabase.from('api_campaign').upsert(validRows, { onConflict: 'campaign_id' });
    
    if (error) throw new Error(error.message);

    return { success: true, rowsProcessed: validRows.length };
  } catch (err: any) {
    console.error("Sync Error:", err);
    return { success: false, rowsProcessed: 0, error: err.message };
  }
}

/**
 * PULL from Supabase -> PUSH to Google Sheet
 * Overwrites the Google Sheet with the current state of Supabase campaigns.
 */
export async function syncCampaignsToSheet(webAppUrl?: string): Promise<{ success: boolean; rowsProcessed: number; error?: string }> {
  try {
    let url = (webAppUrl || import.meta.env.VITE_GOOGLE_SHEET_WEBAPP_URL || '').trim();
    if (!url) throw new Error("No Google Sheet Web App URL provided in environment or arguments.");

    if (url.includes("docs.google.com/spreadsheets")) {
      throw new Error("You must use a Google Apps Script Web App URL (https://script.google.com/macros/s/.../exec), not a Google Docs Spreadsheet link.");
    }

    const { data, error } = await supabase.from('api_campaign').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);

    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data || []),
    });
    
    if (!res.ok) throw new Error(`Failed to post to Sheet Web App (Status: ${res.status})`);
    
    const result = await res.json();
    return { success: true, rowsProcessed: result.rowsWritten || 0 };
  } catch (err: any) {
    console.error("Sync Error:", err);
    return { success: false, rowsProcessed: 0, error: err.message };
  }
}
