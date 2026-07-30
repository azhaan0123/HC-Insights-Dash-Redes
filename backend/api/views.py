"""
API views.

Each endpoint mirrors the old Express routes exactly so the React frontend
needs zero changes beyond the base URL.
"""
import time

from django.db.models import Q
from rest_framework import status as http_status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AiAction, AuditLog, Campaign, Claim, Encounter, Patient
from .serializers import (
    AiActionSerializer,
    AuditLogSerializer,
    CampaignCreateSerializer,
    CampaignSerializer,
    ClaimSerializer,
    EncounterSerializer,
    PatientSerializer,
)


# ---------------------------------------------------------------------------
# GET /api/status/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def api_status(request):
    return Response({
        "status": "online",
        "database": "PostgreSQL" if "postgres" in _db_engine() else "SQLite",
        "connected": True,
        "timestamp": _iso_now(),
        "stats": {
            "patients": Patient.objects.count(),
            "encounters": Encounter.objects.count(),
            "claims": Claim.objects.count(),
        },
    })


# ---------------------------------------------------------------------------
# GET /api/patients/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def patient_list(request):
    qs = Patient.objects.all()

    employer = request.query_params.get("employer")
    if employer:
        qs = qs.filter(employer=employer)

    awv = request.query_params.get("awvStatus")
    if awv:
        qs = qs.filter(awv_status=awv)

    classification = request.query_params.get("classification")
    if classification:
        qs = qs.filter(classification=classification)

    search = request.query_params.get("search")
    if search:
        qs = qs.filter(Q(name__icontains=search) | Q(mrn__icontains=search))

    page = int(request.query_params.get("page", 1))
    limit = int(request.query_params.get("limit", 50))
    total = qs.count()
    start = (page - 1) * limit
    paginated = qs[start:start + limit]

    return Response({
        "data": PatientSerializer(paginated, many=True).data,
        "total": total,
        "page": page,
        "limit": limit,
    })


# ---------------------------------------------------------------------------
# GET /api/encounters/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def encounter_list(request):
    qs = Encounter.objects.all()[:100]
    return Response(EncounterSerializer(qs, many=True).data)


# ---------------------------------------------------------------------------
# GET /api/claims/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def claim_list(request):
    qs = Claim.objects.all()[:100]
    return Response(ClaimSerializer(qs, many=True).data)


# ---------------------------------------------------------------------------
# GET & POST /api/campaigns/
# ---------------------------------------------------------------------------
@api_view(["GET", "POST"])
def campaign_list_create(request):
    if request.method == "GET":
        qs = Campaign.objects.all()
        return Response(CampaignSerializer(qs, many=True).data)

    # POST — create campaign + audit log
    ser = CampaignCreateSerializer(data=request.data)
    ser.is_valid(raise_exception=True)
    d = ser.validated_data

    campaign = Campaign.objects.create(
        campaign_id=f"CMP-{str(int(time.time()))[-4:]}",
        name=d["name"],
        type=d["type"],
        channel=d["channel"],
        status=d["status"],
        audience_count=d.get("audienceCount", 100),
        sent_count=d.get("sentCount", 100),
        delivered_count=98,
        opened_count=45,
        clicked_count=12,
        replies_count=3,
        attachments=d.get("attachments", []),
    )

    AuditLog.objects.create(
        audit_id=f"aud-{int(time.time())}",
        action_type="CAMPAIGN_CREATED",
        workflow="Campaign Center",
        input_ref=campaign.name,
        raw_output=f'Created {campaign.type} campaign "{campaign.name}" via {campaign.channel}',
        final_output="Campaign Created",
        status="created",
    )

    return Response(
        CampaignSerializer(campaign).data,
        status=http_status.HTTP_201_CREATED,
    )


# ---------------------------------------------------------------------------
# GET /api/actions/  &  PUT /api/actions/<action_id>/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def action_list(request):
    qs = AiAction.objects.all()
    return Response(AiActionSerializer(qs, many=True).data)


@api_view(["PUT"])
def action_update(request, action_id):
    try:
        action = AiAction.objects.get(action_id=action_id)
    except AiAction.DoesNotExist:
        return Response(
            {"error": f"Action {action_id} not found"},
            status=http_status.HTTP_404_NOT_FOUND,
        )

    new_status = request.data.get("status", action.status)
    reason = request.data.get("rejectionReason", "")
    note = request.data.get("rejectionNote", "")

    action.status = new_status
    action.rejection_reason = reason
    action.rejection_note = note
    action.save(update_fields=["status", "rejection_reason", "rejection_note", "updated_at"])

    AuditLog.objects.create(
        audit_id=f"aud-{int(time.time())}",
        action_type="AI_ACTION_APPROVED" if new_status == "approved" else "AI_ACTION_REJECTED",
        workflow="AI Action Queue",
        input_ref=action_id,
        raw_output=f"AI action {action_id} decision: {new_status}",
        final_output="Approved" if new_status == "approved" else "Rejected",
        status=new_status,
        reviewer_reason=reason,
        reviewer_note=note,
    )

    return Response(AiActionSerializer(action).data)


# ---------------------------------------------------------------------------
# GET & POST /api/audit-logs/
# ---------------------------------------------------------------------------
@api_view(["GET", "POST"])
def audit_log_list_create(request):
    if request.method == "GET":
        qs = AuditLog.objects.all()
        return Response(AuditLogSerializer(qs, many=True).data)

    # POST
    d = request.data
    record = AuditLog.objects.create(
        audit_id=d.get("auditId", f"aud-{int(time.time())}"),
        action_type=d.get("actionType", "PLATFORM_ACTION"),
        workflow=d.get("workflow", "System Audit"),
        input_ref=d.get("inputRef", "User Action"),
        model_version=d.get("modelVersion", "helix-v2.4.1"),
        raw_output=d.get("rawOutput", ""),
        final_output=d.get("finalOutput", d.get("status", "executed")),
        confidence=d.get("confidence", 95),
        confidence_tier=d.get("confidenceTier", "high"),
        risk_tier=d.get("riskTier", "medium"),
        status=d.get("status", "executed"),
        reviewer_id=d.get("reviewerId", "current-user"),
        reviewer_reason=d.get("reviewerReason", ""),
        reviewer_note=d.get("reviewerNote", ""),
    )

    return Response(
        AuditLogSerializer(record).data,
        status=http_status.HTTP_201_CREATED,
    )


# ---------------------------------------------------------------------------
# GET /api/dashboard/kpis/
# ---------------------------------------------------------------------------
@api_view(["GET"])
def dashboard_kpis(request):
    patient_count = Patient.objects.count()
    encounter_count = Encounter.objects.count()
    claim_count = Claim.objects.count()
    completed_awv = Patient.objects.filter(awv_status="Completed").count()
    awv_pct = f"{(completed_awv / patient_count * 100):.1f}%" if patient_count else "72.4%"

    return Response({
        "totalActivePatients": f"{patient_count:,}",
        "dpcEncountersYtd": f"{encounter_count:,}",
        "totalClaimsProcessed": f"{claim_count:,}",
        "annualExamsCompletedPct": awv_pct,
        "totalCostSavings": "$1.84M",
        "databaseEngine": "PostgreSQL" if "postgres" in _db_engine() else "SQLite",
    })


# ---------------------------------------------------------------------------
# POST /api/campaigns/sync/
# ---------------------------------------------------------------------------
import csv
import requests
import re
from io import StringIO

def get_direct_fetch_url(url: str) -> str:
    trimmed = url.strip()
    if not trimmed:
        return ""
    
    timestamp = int(time.time() * 1000)
    sheet_id_match = re.search(r'/spreadsheets/d/([a-zA-Z0-9-_]+)', trimmed)
    if sheet_id_match:
        sheet_id = sheet_id_match.group(1)
        gid_match = re.search(r'[?&]gid=([0-9]+)', trimmed) or re.search(r'#gid=([0-9]+)', trimmed)
        gid_param = f"&gid={gid_match.group(1)}" if gid_match else ""
        
        if "/pub" in trimmed:
            base_url = trimmed.split("?")[0].replace("/pubhtml", "/pub")
            return f"{base_url}?output=csv{gid_param}&_t={timestamp}"
            
        return f"https://docs.google.com/spreadsheets/d/{sheet_id}/gviz/tq?tqx=out:csv{gid_param}&_t={timestamp}"
        
    sep = "&" if "?" in trimmed else "?"
    return f"{trimmed}{sep}_t={timestamp}"


@api_view(["POST"])
def campaign_sync_sheet(request):
    sheet_url = request.data.get("sheetUrl")
    if not sheet_url:
        return Response({"error": "Missing sheetUrl"}, status=http_status.HTTP_400_BAD_REQUEST)
        
    target_url = get_direct_fetch_url(sheet_url)
    
    try:
        res = requests.get(target_url, timeout=10)
        res.raise_for_status()
        text = res.text
        
        if "Script function not found: doGet" in text:
            return Response({"error": "Google Apps Script requires a doGet(e) function."}, status=http_status.HTTP_400_BAD_REQUEST)
            
        if text.strip().startswith("[") or text.strip().startswith("{"):
            # Handle JSON payload
            import json
            try:
                data_json = json.loads(text)
                if not isinstance(data_json, list):
                    data_json = [data_json]
                    
                if data_json and isinstance(data_json[0], dict):
                    data = data_json
                    rows = None
                else:
                    data = []
                    rows = data_json
            except Exception as e:
                return Response({"error": f"JSON parse error: {str(e)}"}, status=http_status.HTTP_400_BAD_REQUEST)
        else:
            # Handle CSV payload
            data = []
            f = StringIO(text)
            reader = csv.reader(f)
            rows = list(reader)
            
        if rows is not None:
            if not rows:
                return Response({"error": "Empty data"}, status=http_status.HTTP_400_BAD_REQUEST)
                
            header = [str(h).strip().lower() for h in rows[0]]
            h_map = {}
            for i, h in enumerate(header):
                if "name" in h or "campaign" in h: h_map["name"] = i
                elif "id" in h: h_map["id"] = i
                elif "type" in h or "segment" in h or "audience type" in h: h_map["type"] = i
                elif "channel" in h or "medium" in h: h_map["channel"] = i
                elif "status" in h: h_map["status"] = i
                elif "audience" in h or "target" in h: h_map["audience"] = i
                elif "sent" in h: h_map["sent"] = i
                elif "deliver" in h: h_map["delivered"] = i
                elif "open" in h: h_map["opened"] = i
                elif "click" in h: h_map["clicked"] = i
                elif "repl" in h: h_map["replies"] = i
                elif "date" in h or "created" in h: h_map["createdAt"] = i
                
            has_header = len(h_map) > 0
            start_idx = 1 if has_header else 0
            
            def parse_num(v):
                if not v: return 0
                clean = re.sub(r'[^0-9.-]', '', str(v))
                try:
                    return int(float(clean))
                except:
                    return 0
                    
            for i in range(start_idx, len(rows)):
                row = rows[i]
                if len(row) < 2: continue
                
                def get_val(key, default_idx):
                    if has_header:
                        if key not in h_map: return ""
                        idx = h_map[key]
                    else:
                        idx = default_idx
                    return str(row[idx]).strip() if idx < len(row) else ""
                    
                id_val = get_val("id", 0)
                # Ensure the ID isn't completely empty, duplicated from another field, or too long
                if not id_val or len(id_val) > 20:
                    id_val = f"CMP-{100+i}"
                    
                data.append({
                    "id": id_val,
                    "name": get_val("name", 1) or row[0] or f"Campaign #{i}",
                    "type": get_val("type", 2) or "Patient",
                    "channel": get_val("channel", 3) or "Email",
                    "status": get_val("status", 4) or "Active",
                    "audience": parse_num(get_val("audience", 5)),
                    "sent": parse_num(get_val("sent", 6)),
                    "delivered": parse_num(get_val("delivered", 7)),
                    "opened": parse_num(get_val("opened", 8)),
                    "clicked": parse_num(get_val("clicked", 9)),
                    "replies": parse_num(get_val("replies", 10)),
                })
                
        # Sync to DB
        updated_campaigns = []
        for d in data:
            c_type = d.get("type", "Patient")
            if c_type not in [c[0] for c in Campaign.Type.choices]: c_type = "Patient"
            
            c_channel = d.get("channel", "Email")
            if c_channel not in [c[0] for c in Campaign.Channel.choices]: c_channel = "Email"
            
            c_status = d.get("status", "Active")
            if c_status not in [c[0] for c in Campaign.Status.choices]: c_status = "Active"
            
            camp, created = Campaign.objects.update_or_create(
                campaign_id=d.get("id"),
                defaults={
                    "name": d.get("name", ""),
                    "type": c_type,
                    "channel": c_channel,
                    "status": c_status,
                    "audience_count": int(d.get("audience", 0)),
                    "sent_count": int(d.get("sent", 0)),
                    "delivered_count": int(d.get("delivered", 0)),
                    "opened_count": int(d.get("opened", 0)),
                    "clicked_count": int(d.get("clicked", 0)),
                    "replies_count": int(d.get("replies", 0)),
                }
            )
            updated_campaigns.append(camp)
            
        return Response(CampaignSerializer(updated_campaigns, many=True).data)
        
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Request failed: {str(e)}"}, status=http_status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=http_status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _iso_now():
    from django.utils import timezone
    return timezone.now().isoformat()


def _db_engine():
    from django.conf import settings
    return settings.DATABASES["default"].get("ENGINE", "").lower()
