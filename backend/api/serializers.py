"""
DRF serializers.

Field names use camelCase output via `source=` to match the existing frontend
contract without changing anything on the React side.
"""
from rest_framework import serializers

from .models import AiAction, AuditLog, Campaign, Claim, Encounter, Patient


class PatientSerializer(serializers.ModelSerializer):
    riskScore = serializers.DecimalField(source="risk_score", max_digits=5, decimal_places=2)
    awvStatus = serializers.CharField(source="awv_status")
    lastVisit = serializers.DateField(source="last_visit", format="%Y-%m-%d", allow_null=True)

    class Meta:
        model = Patient
        fields = [
            "mrn", "name", "age", "gender", "employer",
            "riskScore", "classification", "awvStatus", "status",
            "phone", "email", "conditions", "lastVisit",
        ]


class EncounterSerializer(serializers.ModelSerializer):
    encounterId = serializers.CharField(source="encounter_id")
    patientId = serializers.CharField(source="patient_id")
    patientName = serializers.CharField(source="patient_name")
    isAfterHours = serializers.BooleanField(source="is_after_hours")
    copayAmount = serializers.DecimalField(source="copay_amount", max_digits=8, decimal_places=2)
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Encounter
        fields = [
            "encounterId", "patientId", "patientName", "type",
            "date", "provider", "isAfterHours", "copayAmount", "status",
        ]


class ClaimSerializer(serializers.ModelSerializer):
    claimId = serializers.CharField(source="claim_id")
    patientId = serializers.CharField(source="patient_id")
    patientName = serializers.CharField(source="patient_name")
    cptCode = serializers.CharField(source="cpt_code")
    dateOfService = serializers.DateField(source="date_of_service", format="%Y-%m-%d")
    rateCharged = serializers.DecimalField(source="rate_charged", max_digits=10, decimal_places=2)

    class Meta:
        model = Claim
        fields = [
            "claimId", "patientId", "patientName", "cptCode",
            "description", "dateOfService", "rateCharged", "category", "status",
        ]


class CampaignSerializer(serializers.ModelSerializer):
    campaignId = serializers.CharField(source="campaign_id")
    audienceCount = serializers.IntegerField(source="audience_count")
    sentCount = serializers.IntegerField(source="sent_count")
    deliveredCount = serializers.IntegerField(source="delivered_count")
    openedCount = serializers.IntegerField(source="opened_count")
    clickedCount = serializers.IntegerField(source="clicked_count")
    repliesCount = serializers.IntegerField(source="replies_count")

    class Meta:
        model = Campaign
        fields = [
            "campaignId", "name", "type", "channel", "status",
            "audienceCount", "sentCount", "deliveredCount",
            "openedCount", "clickedCount", "repliesCount", "attachments",
        ]


class CampaignCreateSerializer(serializers.Serializer):
    """Accept camelCase input from the frontend."""
    name = serializers.CharField(default="New DPC Campaign")
    type = serializers.ChoiceField(choices=Campaign.Type.choices, default="Patient")
    channel = serializers.ChoiceField(choices=Campaign.Channel.choices, default="Email")
    status = serializers.ChoiceField(choices=Campaign.Status.choices, default="Active")
    audienceCount = serializers.IntegerField(default=100, required=False)
    sentCount = serializers.IntegerField(default=100, required=False)
    attachments = serializers.JSONField(default=list, required=False)


class AiActionSerializer(serializers.ModelSerializer):
    actionId = serializers.CharField(source="action_id")
    suggestedAction = serializers.CharField(source="suggested_action")
    agentType = serializers.CharField(source="agent_type")
    patientName = serializers.CharField(source="patient_name", required=False)
    patientMrn = serializers.CharField(source="patient_mrn", required=False)
    rejectionReason = serializers.CharField(source="rejection_reason", required=False)
    rejectionNote = serializers.CharField(source="rejection_note", required=False)

    class Meta:
        model = AiAction
        fields = [
            "actionId", "title", "suggestedAction", "agentType",
            "priority", "confidence", "status",
            "rejectionReason", "rejectionNote",
            "patientName", "patientMrn",
        ]


class AuditLogSerializer(serializers.ModelSerializer):
    auditId = serializers.CharField(source="audit_id")
    actionType = serializers.CharField(source="action_type")
    inputRef = serializers.CharField(source="input_ref", required=False)
    modelVersion = serializers.CharField(source="model_version", required=False)
    rawOutput = serializers.CharField(source="raw_output", required=False)
    finalOutput = serializers.CharField(source="final_output", required=False)
    confidenceTier = serializers.CharField(source="confidence_tier", required=False)
    riskTier = serializers.CharField(source="risk_tier", required=False)
    reviewerId = serializers.CharField(source="reviewer_id", required=False)
    reviewerReason = serializers.CharField(source="reviewer_reason", required=False)
    reviewerNote = serializers.CharField(source="reviewer_note", required=False)
    decidedAt = serializers.DateTimeField(source="decided_at", read_only=True)

    class Meta:
        model = AuditLog
        fields = [
            "auditId", "actionType", "workflow", "inputRef",
            "modelVersion", "rawOutput", "finalOutput",
            "confidence", "confidenceTier", "riskTier",
            "status", "reviewerId", "reviewerReason", "reviewerNote",
            "decidedAt",
        ]
