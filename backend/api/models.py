"""
Data models for HC Insights Dashboard.

Design notes:
- ForeignKey relationships replace denormalized string IDs from the old
  Mongoose schemas, enabling JOINs and referential integrity.
- Date/DateTime fields replace string dates for proper querying.
- TextChoices enums enforce validation at both Python and DB level.
- JSONField is used for variable-length structures (conditions, attachments)
  — maps to native JSONB on PostgreSQL, serialized JSON on SQLite.
"""
from django.db import models


# ---------------------------------------------------------------------------
# Patient
# ---------------------------------------------------------------------------
class Patient(models.Model):
    class Classification(models.TextChoices):
        PROACTIVE = "Proactive"
        REACTIVE = "Reactive"

    class AwvStatus(models.TextChoices):
        PENDING = "Pending"
        COMPLETED = "Completed"

    class Status(models.TextChoices):
        OPEN = "Open"
        CONFIRMED = "Confirmed"
        DEFERRED = "Deferred"
        REJECTED = "Rejected"
        NA = "N/A"

    mrn = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=120)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=10)
    employer = models.CharField(max_length=100, db_index=True)
    risk_score = models.DecimalField(max_digits=5, decimal_places=2)
    classification = models.CharField(
        max_length=10, choices=Classification.choices, default=Classification.PROACTIVE,
    )
    awv_status = models.CharField(
        max_length=10, choices=AwvStatus.choices, default=AwvStatus.PENDING,
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.OPEN,
    )
    phone = models.CharField(max_length=20, blank=True, default="")
    email = models.EmailField(blank=True, default="")
    conditions = models.JSONField(default=list, blank=True)
    last_visit = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-risk_score"]

    def __str__(self):
        return f"{self.mrn} — {self.name}"


# ---------------------------------------------------------------------------
# Encounter
# ---------------------------------------------------------------------------
class Encounter(models.Model):
    class Status(models.TextChoices):
        COMPLETED = "Completed"
        SCHEDULED = "Scheduled"
        CANCELLED = "Cancelled"

    encounter_id = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name="encounters", to_field="mrn",
    )
    patient_name = models.CharField(max_length=120)
    type = models.CharField(max_length=60)
    date = models.DateField()
    provider = models.CharField(max_length=80)
    is_after_hours = models.BooleanField(default=False)
    copay_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.COMPLETED,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.encounter_id} — {self.patient_name}"


# ---------------------------------------------------------------------------
# Claim
# ---------------------------------------------------------------------------
class Claim(models.Model):
    class Status(models.TextChoices):
        PAID = "Paid"
        PENDING = "Pending"
        DENIED = "Denied"

    claim_id = models.CharField(max_length=20, unique=True)
    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name="claims", to_field="mrn",
    )
    patient_name = models.CharField(max_length=120)
    cpt_code = models.CharField(max_length=10)
    description = models.CharField(max_length=200)
    date_of_service = models.DateField()
    rate_charged = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=40)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PAID,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_of_service"]

    def __str__(self):
        return f"{self.claim_id} — {self.cpt_code}"


# ---------------------------------------------------------------------------
# Campaign
# ---------------------------------------------------------------------------
class Campaign(models.Model):
    class Type(models.TextChoices):
        PATIENT = "Patient"
        LEAD = "Lead"
        EMPLOYER = "Employer"

    class Channel(models.TextChoices):
        EMAIL = "Email"
        SMS = "SMS"
        MULTI = "Multi-Channel"

    class Status(models.TextChoices):
        ACTIVE = "Active"
        DRAFT = "Draft"
        COMPLETED = "Completed"
        ARCHIVED = "Archived"

    campaign_id = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=15, choices=Type.choices)
    channel = models.CharField(
        max_length=15, choices=Channel.choices, default=Channel.EMAIL,
    )
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.ACTIVE,
    )
    audience_count = models.PositiveIntegerField(default=0)
    sent_count = models.PositiveIntegerField(default=0)
    delivered_count = models.PositiveIntegerField(default=0)
    opened_count = models.PositiveIntegerField(default=0)
    clicked_count = models.PositiveIntegerField(default=0)
    replies_count = models.PositiveIntegerField(default=0)
    attachments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.campaign_id} — {self.name}"


# ---------------------------------------------------------------------------
# AiAction
# ---------------------------------------------------------------------------
class AiAction(models.Model):
    class Priority(models.TextChoices):
        CRITICAL = "critical"
        HIGH = "high"
        MEDIUM = "medium"
        LOW = "low"

    class Status(models.TextChoices):
        PENDING = "pending"
        APPROVED = "approved"
        REJECTED = "rejected"

    action_id = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    suggested_action = models.TextField()
    agent_type = models.CharField(max_length=60)
    priority = models.CharField(
        max_length=10, choices=Priority.choices, default=Priority.HIGH,
    )
    confidence = models.PositiveSmallIntegerField()
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.PENDING,
    )
    rejection_reason = models.TextField(blank=True, default="")
    rejection_note = models.TextField(blank=True, default="")
    patient_name = models.CharField(max_length=120, blank=True, default="")
    patient_mrn = models.CharField(max_length=20, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-priority", "-confidence"]

    def __str__(self):
        return f"{self.action_id} — {self.title}"


# ---------------------------------------------------------------------------
# AuditLog
# ---------------------------------------------------------------------------
class AuditLog(models.Model):
    audit_id = models.CharField(max_length=30, unique=True)
    action_type = models.CharField(max_length=40)
    workflow = models.CharField(max_length=60)
    input_ref = models.CharField(max_length=200, blank=True, default="")
    model_version = models.CharField(max_length=30, default="helix-v2.4.1")
    raw_output = models.TextField(blank=True, default="")
    final_output = models.TextField(blank=True, default="")
    confidence = models.PositiveSmallIntegerField(default=90)
    confidence_tier = models.CharField(max_length=10, default="high")
    risk_tier = models.CharField(max_length=10, default="medium")
    status = models.CharField(max_length=20)
    reviewer_id = models.CharField(max_length=40, default="current-user")
    reviewer_reason = models.TextField(blank=True, default="")
    reviewer_note = models.TextField(blank=True, default="")
    decided_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-decided_at"]

    def __str__(self):
        return f"{self.audit_id} — {self.action_type}"
