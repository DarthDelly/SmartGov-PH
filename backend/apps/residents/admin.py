from django.contrib import admin

from .models import Resident


@admin.register(Resident)
class ResidentAdmin(admin.ModelAdmin):
    list_display = (
        "last_name",
        "first_name",
        "purok",
        "barangay",
        "status",
        "occupation",
        "last_transaction",
    )
    list_filter = ("status", "barangay", "purok")
    search_fields = ("first_name", "last_name", "purok", "occupation", "phone")
    ordering = ("last_name", "first_name")
    raw_id_fields = ("user",)
