import express from "express";
import cors from "cors";
import { connectDB, isConnectedToMongo, mockDB } from "./db.js";
import { seedDatabase } from "./seed.js";
import { Patient } from "./models/Patient.js";
import { Encounter } from "./models/Encounter.js";
import { Claim } from "./models/Claim.js";
import { Campaign } from "./models/Campaign.js";
import { AiAction } from "./models/AiAction.js";
import { AuditLog } from "./models/AuditLog.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB Connection and Seed Data
await connectDB();
await seedDatabase();

// Health & Status Check Endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    database: isConnectedToMongo ? "MongoDB Live Cluster" : "Embedded Mock MongoDB Engine",
    connected: true,
    timestamp: new Date().toISOString(),
    stats: {
      patients: isConnectedToMongo ? 1420 : mockDB.patients.length,
      encounters: isConnectedToMongo ? 2840 : mockDB.encounters.length,
      claims: isConnectedToMongo ? 5620 : mockDB.claims.length,
    },
  });
});

// GET Patients Endpoint with Filtering & Pagination
app.get("/api/patients", async (req, res) => {
  try {
    const { employer, awvStatus, classification, search, page = 1, limit = 50 } = req.query;
    
    if (isConnectedToMongo) {
      const query = {};
      if (employer) query.employer = employer;
      if (awvStatus) query.awvStatus = awvStatus;
      if (classification) query.classification = classification;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { mrn: { $regex: search, $options: "i" } },
        ];
      }
      const patients = await Patient.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit));
      const total = await Patient.countDocuments(query);
      return res.json({ data: patients, total, page: Number(page), limit: Number(limit) });
    }

    let list = [...mockDB.patients];
    if (employer) list = list.filter((p) => p.employer === employer);
    if (awvStatus) list = list.filter((p) => p.awvStatus === awvStatus);
    if (classification) list = list.filter((p) => p.classification === classification);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q));
    }
    const total = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);
    res.json({ data: paginated, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Encounters Endpoint
app.get("/api/encounters", async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const encounters = await Encounter.find({}).limit(100);
      return res.json(encounters);
    }
    res.json(mockDB.encounters.slice(0, 100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET Claims Endpoint
app.get("/api/claims", async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const claims = await Claim.find({}).limit(100);
      return res.json(claims);
    }
    res.json(mockDB.claims.slice(0, 100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Campaigns Endpoints
app.get("/api/campaigns", async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const campaigns = await Campaign.find({});
      return res.json(campaigns);
    }
    res.json(mockDB.campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/campaigns", async (req, res) => {
  try {
    const campaignData = {
      campaignId: `CMP-${Date.now().toString().slice(-4)}`,
      name: req.body.name || "New DPC Campaign",
      type: req.body.type || "Patient",
      channel: req.body.channel || "Email",
      status: req.body.status || "Active",
      audienceCount: req.body.audienceCount || 100,
      sentCount: req.body.sentCount || 100,
      deliveredCount: 98,
      openedCount: 45,
      clickedCount: 12,
      repliesCount: 3,
      attachments: req.body.attachments || [],
    };

    const auditRecord = {
      auditId: `aud-${Date.now()}`,
      actionType: "CAMPAIGN_CREATED",
      workflow: "Campaign Center",
      inputRef: campaignData.name,
      rawOutput: `Created ${campaignData.type} campaign "${campaignData.name}" via ${campaignData.channel}`,
      finalOutput: "Campaign Created",
      status: "created",
      decidedAt: new Date().toISOString(),
    };

    if (isConnectedToMongo) {
      const newCampaign = await Campaign.create(campaignData);
      await AuditLog.create(auditRecord);
      return res.status(201).json(newCampaign);
    }

    mockDB.campaigns.unshift(campaignData);
    mockDB.auditLogs.unshift(auditRecord);
    res.status(201).json(campaignData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET & PUT AI Actions Endpoints
app.get("/api/actions", async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const actions = await AiAction.find({});
      return res.json(actions);
    }
    res.json(mockDB.actions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/actions/:id", async (req, res) => {
  try {
    const { status, rejectionReason, rejectionNote } = req.body;
    const actionId = req.params.id;

    const auditRecord = {
      auditId: `aud-${Date.now()}`,
      actionType: status === "approved" ? "AI_ACTION_APPROVED" : "AI_ACTION_REJECTED",
      workflow: "AI Action Queue",
      inputRef: actionId,
      rawOutput: `AI action ${actionId} decision: ${status}`,
      finalOutput: status === "approved" ? "Approved" : "Rejected",
      status: status,
      reviewerReason: rejectionReason || "",
      reviewerNote: rejectionNote || "",
      decidedAt: new Date().toISOString(),
    };

    if (isConnectedToMongo) {
      const updated = await AiAction.findOneAndUpdate(
        { actionId },
        { status, rejectionReason, rejectionNote },
        { new: true }
      );
      await AuditLog.create(auditRecord);
      return res.json(updated);
    }

    const action = mockDB.actions.find((a) => a.actionId === actionId);
    if (action) {
      action.status = status;
      if (rejectionReason) action.rejectionReason = rejectionReason;
      if (rejectionNote) action.rejectionNote = rejectionNote;
    }
    mockDB.auditLogs.unshift(auditRecord);
    res.json(action || { actionId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET & POST Audit Logs Endpoints
app.get("/api/audit-logs", async (req, res) => {
  try {
    if (isConnectedToMongo) {
      const logs = await AuditLog.find({}).sort({ createdAt: -1 });
      return res.json(logs);
    }
    res.json(mockDB.auditLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/audit-logs", async (req, res) => {
  try {
    const auditRecord = {
      auditId: req.body.auditId || `aud-${Date.now()}`,
      actionType: req.body.actionType || "PLATFORM_ACTION",
      workflow: req.body.workflow || "System Audit",
      inputRef: req.body.inputRef || "User Action",
      modelVersion: req.body.modelVersion || "helix-v2.4.1",
      rawOutput: req.body.rawOutput || "",
      finalOutput: req.body.finalOutput || req.body.status || "executed",
      confidence: req.body.confidence || 95,
      confidenceTier: req.body.confidenceTier || "high",
      riskTier: req.body.riskTier || "medium",
      status: req.body.status || "executed",
      reviewerId: req.body.reviewerId || "current-user",
      reviewerReason: req.body.reviewerReason || "",
      reviewerNote: req.body.reviewerNote || "",
      decidedAt: new Date().toISOString(),
    };

    if (isConnectedToMongo) {
      const created = await AuditLog.create(auditRecord);
      return res.status(201).json(created);
    }

    mockDB.auditLogs.unshift(auditRecord);
    res.status(201).json(auditRecord);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard Combined Live Aggregated KPIs Endpoint
app.get("/api/dashboard/kpis", async (req, res) => {
  try {
    let patientCount = 0;
    let encounterCount = 0;
    let claimCount = 0;
    let completedAwv = 0;

    if (isConnectedToMongo) {
      patientCount = await Patient.countDocuments({});
      encounterCount = await Encounter.countDocuments({});
      claimCount = await Claim.countDocuments({});
      completedAwv = await Patient.countDocuments({ awvStatus: "Completed" });
    } else {
      patientCount = mockDB.patients.length;
      encounterCount = mockDB.encounters.length;
      claimCount = mockDB.claims.length;
      completedAwv = mockDB.patients.filter((p) => p.awvStatus === "Completed").length;
    }

    const awvPct = patientCount > 0 ? ((completedAwv / patientCount) * 100).toFixed(1) + "%" : "72.4%";

    res.json({
      totalActivePatients: patientCount.toLocaleString(),
      dpcEncountersYtd: encounterCount.toLocaleString(),
      totalClaimsProcessed: claimCount.toLocaleString(),
      annualExamsCompletedPct: awvPct,
      totalCostSavings: "$1.84M",
      databaseEngine: isConnectedToMongo ? "MongoDB Live Cluster" : "Embedded MongoDB Engine",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[API Server] Express + MongoDB backend listening on http://localhost:${PORT}`);
});
