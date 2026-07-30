"""
Management command: python manage.py seed

Generates 500 patients, ~1500 encounters, ~2000 claims, 8 campaigns,
and 5 AI actions — matching the old server/seed.js output exactly.
Uses bulk_create for fast insertion.
"""
import random
from datetime import date

from django.core.management.base import BaseCommand

from api.models import AiAction, Campaign, Claim, Encounter, Patient

FIRST_NAMES = [
    "James", "Sarah", "Michael", "Emily", "David", "Jessica", "Robert",
    "Amanda", "William", "Ashley", "Christopher", "Taylor", "Matthew",
    "Megan", "Joshua", "Lauren", "Andrew", "Hannah", "Joseph", "Samantha",
    "Daniel", "Rachel", "Anthony", "Nicole", "Mark", "Elizabeth", "Donald",
    "Alexis", "Steven", "Victoria", "Paul", "Grace", "Kevin", "Chloe",
    "Brian", "Sofia", "George", "Zoe", "Edward", "Penelope",
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
    "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
    "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark",
    "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
]

EMPLOYERS = [
    "Apex Technologies", "Pinnacle Corp", "Atlas Group", "Horizon Medical",
    "Apex Bio", "Titan Logistics", "Summit Health", "Pioneer Energy",
    "Vanguard Retail", "Quantum Defense", "Biscayne Logistics", "OmniCare Health",
]

CONDITIONS = [
    "Hypertension", "Hyperlipidemia", "Type 2 Diabetes", "Asthma",
    "CKD Stage 3", "Hypothyroidism", "Obesity", "Anxiety Disorder",
    "CAD", "Depression", "GERD", "Osteoarthritis",
]

PROVIDERS = [
    "Dr. Amanda Johnson", "Dr. Christopher Nelson", "Dr. Andrew Anderson",
    "Dr. Laura Hill", "Dr. Marcus Vance", "Dr. Evelyn Reed",
]

ENCOUNTER_TYPES = [
    "DPC Annual Wellness Exam", "Routine Follow-up", "Virtual Consult",
    "Prescription Sync", "Urgent After-Hours Triage",
]

CPT_CODES = [
    ("99214", "Established Office Visit (Level 4)", 185.00, "Primary Care"),
    ("99215", "Established Office Visit (Level 5)", 245.00, "Primary Care"),
    ("83036", "HbA1c Glycated Hemoglobin Test", 45.00, "Laboratory"),
    ("80053", "Comprehensive Metabolic Panel", 65.00, "Laboratory"),
    ("99285", "Emergency Department Visit (Level 5)", 1450.00, "ER Visit"),
    ("99396", "Preventive Medicine Annual Exam (18-39)", 210.00, "Preventive"),
    ("99397", "Preventive Medicine Annual Exam (40-64)", 235.00, "Preventive"),
    ("93000", "Electrocardiogram (ECG/EKG) Complete", 120.00, "Cardiology"),
    ("71046", "Chest X-Ray 2 Views", 160.00, "Radiology"),
]

SEED_CAMPAIGNS = [
    dict(campaign_id="CMP-301", name="Annual Exam Reminder Q4", type="Patient", channel="Email", status="Active", audience_count=342, sent_count=342, delivered_count=338, opened_count=215, clicked_count=48, replies_count=12, attachments=[{"name": "Annual_Exam_Flyer.pdf", "size": "1.2 MB", "fileType": "PDF"}]),
    dict(campaign_id="CMP-302", name="Diabetes HbA1c Lab Outreach", type="Patient", channel="Multi-Channel", status="Active", audience_count=218, sent_count=218, delivered_count=212, opened_count=168, clicked_count=82, replies_count=34, attachments=[]),
    dict(campaign_id="CMP-303", name="Employer DPC Wellness Pitch", type="Employer", channel="Email", status="Active", audience_count=45, sent_count=45, delivered_count=44, opened_count=31, clicked_count=14, replies_count=8, attachments=[{"name": "DPC_Employer_Brochure.pdf", "size": "3.4 MB", "fileType": "PDF"}]),
    dict(campaign_id="CMP-304", name="Hypertension BP Check Campaign", type="Patient", channel="SMS", status="Active", audience_count=189, sent_count=189, delivered_count=187, opened_count=154, clicked_count=62, replies_count=28, attachments=[]),
    dict(campaign_id="CMP-305", name="Community Member Welcome Drip", type="Lead", channel="Email", status="Active", audience_count=520, sent_count=520, delivered_count=512, opened_count=380, clicked_count=142, replies_count=45, attachments=[{"name": "DPC_Membership_Guide.pdf", "size": "2.1 MB", "fileType": "PDF"}]),
    dict(campaign_id="CMP-306", name="Flu & Immunization Clinic Drive", type="Patient", channel="Multi-Channel", status="Completed", audience_count=890, sent_count=890, delivered_count=875, opened_count=620, clicked_count=290, replies_count=110, attachments=[]),
    dict(campaign_id="CMP-307", name="Q1 Preventive Care Re-engagement", type="Patient", channel="Email", status="Active", audience_count=410, sent_count=410, delivered_count=402, opened_count=295, clicked_count=98, replies_count=32, attachments=[]),
    dict(campaign_id="CMP-308", name="Executive Health Check-up Invite", type="Employer", channel="Email", status="Draft", audience_count=60, sent_count=0, delivered_count=0, opened_count=0, clicked_count=0, replies_count=0, attachments=[]),
]

SEED_ACTIONS = [
    dict(action_id="ACT-501", title="Escalated Care Gap: Michael Thompson", suggested_action="Schedule urgent CKD & BP Follow-up consult", agent_type="Clinical Risk Agent", priority="critical", confidence=96, status="pending", patient_name="Michael Thompson", patient_mrn="MRN-1004"),
    dict(action_id="ACT-502", title="AWV Outreach: James Rodriguez", suggested_action="Send automated SMS reminder for DPC $0 Copay Annual Exam", agent_type="Engagement Agent", priority="high", confidence=91, status="pending", patient_name="James Rodriguez", patient_mrn="MRN-1002"),
    dict(action_id="ACT-503", title="Unclaimed Lab Panel: David Kim", suggested_action="Notify care team of unreviewed CMP lab result", agent_type="Lab Cadence Agent", priority="critical", confidence=98, status="pending", patient_name="David Kim", patient_mrn="MRN-1008"),
    dict(action_id="ACT-504", title="Medication Adherence Alert: Sarah Mitchell", suggested_action="Refill Antihypertensive prescription via preferred pharmacy", agent_type="Pharmacy Agent", priority="medium", confidence=88, status="pending", patient_name="Sarah Mitchell", patient_mrn="MRN-1001"),
    dict(action_id="ACT-505", title="MIPS Quality Measure Gap: Robert Taylor", suggested_action="Document Tobacco Cessation Intervention in EHR", agent_type="Quality Measure Agent", priority="high", confidence=94, status="pending", patient_name="Robert Taylor", patient_mrn="MRN-1006"),
]


def _rand_date(start_year=2025, end_year=2026):
    m = random.randint(1, 12)
    d = random.randint(1, 28)
    y = random.randint(start_year, end_year)
    return date(y, m, d)


class Command(BaseCommand):
    help = "Seed the database with 500 patients, encounters, claims, campaigns, and AI actions."

    def handle(self, *args, **options):
        self.stdout.write("Clearing existing data...")
        Patient.objects.all().delete()
        Encounter.objects.all().delete()
        Claim.objects.all().delete()
        Campaign.objects.all().delete()
        AiAction.objects.all().delete()

        patients = []
        encounters = []
        claims = []

        self.stdout.write("Generating 500 patients with encounters and claims...")
        for i in range(1, 501):
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            name = f"{fn} {ln}"
            mrn = f"MRN-{1000 + i}"
            employer = random.choice(EMPLOYERS)
            risk = round(random.uniform(0.5, 5.0), 2)

            conditions = random.sample(CONDITIONS, k=random.randint(0, 3))

            patients.append(Patient(
                mrn=mrn,
                name=name,
                age=random.randint(22, 79),
                gender="Female" if random.random() > 0.52 else "Male",
                employer=employer,
                risk_score=risk,
                classification="Reactive" if risk >= 2.5 else "Proactive",
                awv_status="Completed" if random.random() > 0.4 else "Pending",
                status="Open" if random.random() > 0.3 else "Confirmed",
                phone=f"(913) 555-{str(1000 + i)[-4:]}",
                email=f"{fn.lower()}.{ln.lower()[:3]}@{employer.lower().replace(' ', '')}.com",
                conditions=conditions,
                last_visit=_rand_date(),
            ))

            for e in range(random.randint(2, 4)):
                encounters.append(Encounter(
                    encounter_id=f"ENC-{10000 + len(encounters) + 1}",
                    patient_id=mrn,
                    patient_name=name,
                    type=random.choice(ENCOUNTER_TYPES),
                    date=_rand_date(),
                    provider=random.choice(PROVIDERS),
                    is_after_hours=random.random() > 0.75,
                    copay_amount=0,
                    status="Completed",
                ))

            for c in range(random.randint(3, 6)):
                cpt = random.choice(CPT_CODES)
                claims.append(Claim(
                    claim_id=f"CLM-{20000 + len(claims) + 1}",
                    patient_id=mrn,
                    patient_name=name,
                    cpt_code=cpt[0],
                    description=cpt[1],
                    date_of_service=_rand_date(),
                    rate_charged=cpt[2],
                    category=cpt[3],
                    status="Paid" if random.random() > 0.1 else "Pending",
                ))

        Patient.objects.bulk_create(patients)
        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(patients)} patients"))

        Encounter.objects.bulk_create(encounters)
        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(encounters)} encounters"))

        Claim.objects.bulk_create(claims)
        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(claims)} claims"))

        Campaign.objects.bulk_create([Campaign(**c) for c in SEED_CAMPAIGNS])
        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(SEED_CAMPAIGNS)} campaigns"))

        AiAction.objects.bulk_create([AiAction(**a) for a in SEED_ACTIONS])
        self.stdout.write(self.style.SUCCESS(f"  [OK] {len(SEED_ACTIONS)} AI actions"))

        self.stdout.write(self.style.SUCCESS("\nDatabase seeded successfully!"))
