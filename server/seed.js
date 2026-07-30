import { connectDB, isConnectedToMongo, mockDB } from "./db.js";
import { Patient } from "./models/Patient.js";
import { Encounter } from "./models/Encounter.js";
import { Claim } from "./models/Claim.js";
import { Campaign } from "./models/Campaign.js";
import { AiAction } from "./models/AiAction.js";

const FIRST_NAMES = ["James", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert", "Amanda", "William", "Ashley", "Christopher", "Taylor", "Matthew", "Megan", "Joshua", "Lauren", "Andrew", "Hannah", "Joseph", "Samantha", "Daniel", "Rachel", "Anthony", "Nicole", "Mark", "Elizabeth", "Donald", "Alexis", "Steven", "Victoria", "Paul", "Grace", "Kevin", "Chloe", "Brian", "Sofia", "George", "Zoe", "Edward", "Penelope"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores"];
const EMPLOYERS = ["Apex Technologies", "Pinnacle Corp", "Atlas Group", "Horizon Medical", "Apex Bio", "Titan Logistics", "Summit Health", "Pioneer Energy", "Vanguard Retail", "Quantum Defense", "Biscayne Logistics", "OmniCare Health"];
const CONDITIONS_POOL = ["Hypertension", "Hyperlipidemia", "Type 2 Diabetes", "Asthma", "CKD Stage 3", "Hypothyroidism", "Obesity", "Anxiety Disorder", "CAD", "Depression", "GERD", "Osteoarthritis"];
const PROVIDERS = ["Dr. Amanda Johnson", "Dr. Christopher Nelson", "Dr. Andrew Anderson", "Dr. Laura Hill", "Dr. Marcus Vance", "Dr. Evelyn Reed"];

const CPT_CODES = [
  { code: "99214", desc: "Established Office Visit (Level 4)", price: 185.00, cat: "Primary Care" },
  { code: "99215", desc: "Established Office Visit (Level 5)", price: 245.00, cat: "Primary Care" },
  { code: "83036", desc: "HbA1c Glycated Hemoglobin Test", price: 45.00, cat: "Laboratory" },
  { code: "80053", desc: "Comprehensive Metabolic Panel", price: 65.00, cat: "Laboratory" },
  { code: "99285", desc: "Emergency Department Visit (Level 5)", price: 1450.00, cat: "ER Visit" },
  { code: "99396", desc: "Preventive Medicine Annual Exam (18-39)", price: 210.00, cat: "Preventive" },
  { code: "99397", desc: "Preventive Medicine Annual Exam (40-64)", price: 235.00, cat: "Preventive" },
  { code: "93000", desc: "Electrocardiogram (ECG/EKG) Complete", price: 120.00, cat: "Cardiology" },
  { code: "71046", desc: "Chest X-Ray 2 Views", price: 160.00, cat: "Radiology" },
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomDate(startYear = 2025, endYear = 2026) {
  const month = String(getRandomInt(1, 12)).padStart(2, "0");
  const day = String(getRandomInt(1, 28)).padStart(2, "0");
  const year = getRandomInt(startYear, endYear);
  return `${year}-${month}-${day}`;
}

export function generateMassData(count = 500) {
  const patients = [];
  const encounters = [];
  const claims = [];

  for (let i = 1; i <= count; i++) {
    const fn = getRandomElement(FIRST_NAMES);
    const ln = getRandomElement(LAST_NAMES);
    const name = `${fn} ${ln}`;
    const mrn = `MRN-${1000 + i}`;
    const age = getRandomInt(22, 79);
    const gender = Math.random() > 0.52 ? "Female" : "Male";
    const employer = getRandomElement(EMPLOYERS);
    const riskScore = parseFloat((Math.random() * 4.5 + 0.5).toFixed(2));
    const classification = riskScore >= 2.5 ? "Reactive" : "Proactive";
    const awvStatus = Math.random() > 0.4 ? "Completed" : "Pending";
    const phone = `(913) 555-${String(1000 + i).slice(-4)}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase().slice(0, 3)}@${employer.toLowerCase().replace(/\s+/g, "")}.com`;
    
    const numConditions = getRandomInt(0, 3);
    const conditions = [];
    for (let c = 0; c < numConditions; c++) {
      const cond = getRandomElement(CONDITIONS_POOL);
      if (!conditions.includes(cond)) conditions.push(cond);
    }
    const lastVisit = getRandomDate(2025, 2026);

    patients.push({
      mrn,
      name,
      age,
      gender,
      employer,
      riskScore,
      classification,
      awvStatus,
      status: Math.random() > 0.3 ? "Open" : "Confirmed",
      phone,
      email,
      conditions,
      lastVisit,
    });

    // Generate 2-4 encounters per patient
    const numEncounters = getRandomInt(2, 4);
    for (let e = 1; e <= numEncounters; e++) {
      encounters.push({
        encounterId: `ENC-${10000 + encounters.length + 1}`,
        patientId: mrn,
        patientName: name,
        type: getRandomElement(["DPC Annual Wellness Exam", "Routine Follow-up", "Virtual Consult", "Prescription Sync", "Urgent After-Hours Triage"]),
        date: getRandomDate(2025, 2026),
        provider: getRandomElement(PROVIDERS),
        isAfterHours: Math.random() > 0.75,
        copayAmount: 0,
        status: "Completed",
      });
    }

    // Generate 3-6 claims per patient
    const numClaims = getRandomInt(3, 6);
    for (let cl = 1; cl <= numClaims; cl++) {
      const cptObj = getRandomElement(CPT_CODES);
      claims.push({
        claimId: `CLM-${20000 + claims.length + 1}`,
        patientId: mrn,
        patientName: name,
        cptCode: cptObj.code,
        description: cptObj.desc,
        dateOfService: getRandomDate(2025, 2026),
        rateCharged: cptObj.price,
        category: cptObj.cat,
        status: Math.random() > 0.1 ? "Paid" : "Pending",
      });
    }
  }

  const campaigns = [
    { campaignId: "CMP-301", name: "Annual Exam Reminder Q4", type: "Patient", channel: "Email", status: "Active", audienceCount: 342, sentCount: 342, deliveredCount: 338, openedCount: 215, clickedCount: 48, repliesCount: 12, attachments: [{ name: "Annual_Exam_Flyer.pdf", size: "1.2 MB", fileType: "PDF" }] },
    { campaignId: "CMP-302", name: "Diabetes HbA1c Lab Outreach", type: "Patient", channel: "Multi-Channel", status: "Active", audienceCount: 218, sentCount: 218, deliveredCount: 212, openedCount: 168, clickedCount: 82, repliesCount: 34, attachments: [] },
    { campaignId: "CMP-303", name: "Employer DPC Wellness Pitch", type: "Employer", channel: "Email", status: "Active", audienceCount: 45, sentCount: 45, deliveredCount: 44, openedCount: 31, clickedCount: 14, repliesCount: 8, attachments: [{ name: "DPC_Employer_Brochure.pdf", size: "3.4 MB", fileType: "PDF" }] },
    { campaignId: "CMP-304", name: "Hypertension BP Check Campaign", type: "Patient", channel: "SMS", status: "Active", audienceCount: 189, sentCount: 189, deliveredCount: 187, openedCount: 154, clickedCount: 62, repliesCount: 28, attachments: [] },
    { campaignId: "CMP-305", name: "Community Member Welcome Drip", type: "Lead", channel: "Email", status: "Active", audienceCount: 520, sentCount: 520, deliveredCount: 512, openedCount: 380, clickedCount: 142, repliesCount: 45, attachments: [{ name: "DPC_Membership_Guide.pdf", size: "2.1 MB", fileType: "PDF" }] },
    { campaignId: "CMP-306", name: "Flu & Immunization Clinic Drive", type: "Patient", channel: "Multi-Channel", status: "Completed", audienceCount: 890, sentCount: 890, deliveredCount: 875, openedCount: 620, clickedCount: 290, repliesCount: 110, attachments: [] },
    { campaignId: "CMP-307", name: "Q1 Preventive Care Re-engagement", type: "Patient", channel: "Email", status: "Active", audienceCount: 410, sentCount: 410, deliveredCount: 402, openedCount: 295, clickedCount: 98, repliesCount: 32, attachments: [] },
    { campaignId: "CMP-308", name: "Executive Health Check-up Invite", type: "Employer", channel: "Email", status: "Draft", audienceCount: 60, sentCount: 0, deliveredCount: 0, openedCount: 0, clickedCount: 0, repliesCount: 0, attachments: [] },
  ];

  const actions = [
    { actionId: "ACT-501", title: "Escalated Care Gap: Michael Thompson", suggestedAction: "Schedule urgent CKD & BP Follow-up consult", agentType: "Clinical Risk Agent", priority: "critical", confidence: 96, status: "pending", patientName: "Michael Thompson", patientMrn: "MRN-1004" },
    { actionId: "ACT-502", title: "AWV Outreach: James Rodriguez", suggestedAction: "Send automated SMS reminder for DPC $0 Copay Annual Exam", agentType: "Engagement Agent", priority: "high", confidence: 91, status: "pending", patientName: "James Rodriguez", patientMrn: "MRN-1002" },
    { actionId: "ACT-503", title: "Unclaimed Lab Panel: David Kim", suggestedAction: "Notify care team of unreviewed CMP lab result", agentType: "Lab Cadence Agent", priority: "critical", confidence: 98, status: "pending", patientName: "David Kim", patientMrn: "MRN-1008" },
    { actionId: "ACT-504", title: "Medication Adherence Alert: Sarah Mitchell", suggestedAction: "Refill Antihypertensive prescription via preferred pharmacy", agentType: "Pharmacy Agent", priority: "medium", confidence: 88, status: "pending", patientName: "Sarah Mitchell", patientMrn: "MRN-1001" },
    { actionId: "ACT-505", title: "MIPS Quality Measure Gap: Robert Taylor", suggestedAction: "Document Tobacco Cessation Intervention in EHR", agentType: "Quality Measure Agent", priority: "high", confidence: 94, status: "pending", patientName: "Robert Taylor", patientMrn: "MRN-1006" },
  ];

  return { patients, encounters, claims, campaigns, actions };
}

export async function seedDatabase() {
  await connectDB();
  const data = generateMassData(500);

  if (isConnectedToMongo) {
    console.log(`[MongoDB Seed] Seeding ${data.patients.length} patients, ${data.encounters.length} encounters, and ${data.claims.length} claims...`);
    await Patient.deleteMany({});
    await Encounter.deleteMany({});
    await Claim.deleteMany({});
    await Campaign.deleteMany({});
    await AiAction.deleteMany({});

    await Patient.insertMany(data.patients);
    await Encounter.insertMany(data.encounters);
    await Claim.insertMany(data.claims);
    await Campaign.insertMany(data.campaigns);
    await AiAction.insertMany(data.actions);

    console.log("[MongoDB Seed] Live MongoDB database populated successfully!");
  } else {
    console.log(`[MongoDB Seed] Seeding ${data.patients.length} patients, ${data.encounters.length} encounters, and ${data.claims.length} claims into In-Memory Database...`);
    mockDB.patients = data.patients;
    mockDB.encounters = data.encounters;
    mockDB.claims = data.claims;
    mockDB.campaigns = data.campaigns;
    mockDB.actions = data.actions;
    console.log("[MongoDB Seed] In-Memory Database populated successfully!");
  }
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed.js")) {
  seedDatabase().then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
