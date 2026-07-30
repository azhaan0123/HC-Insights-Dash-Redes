"""Register all models in Django admin for easy inspection."""
from django.contrib import admin

from .models import AiAction, AuditLog, Campaign, Claim, Encounter, Patient

admin.site.register(Patient)
admin.site.register(Encounter)
admin.site.register(Claim)
admin.site.register(Campaign)
admin.site.register(AiAction)
admin.site.register(AuditLog)
