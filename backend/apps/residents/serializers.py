from datetime import date

from dateutil.relativedelta import relativedelta
from rest_framework import serializers

from .models import Resident


class ResidentSerializer(serializers.ModelSerializer):
    # age is computed from birth_date so it never goes stale.
    # Both sides are plain date objects — no timezone/datetime off-by-one risk.
    age = serializers.SerializerMethodField()

    class Meta:
        model = Resident
        fields = [
            "id",
            "first_name",
            "last_name",
            "purok",
            "barangay",
            "status",
            "phone",
            "birth_date",
            "age",
            "occupation",
            "last_transaction",
            "user",
            "created_at",
        ]
        read_only_fields = ["id", "age", "created_at"]

    def get_age(self, obj: Resident):
        if not obj.birth_date:
            return None
        return relativedelta(date.today(), obj.birth_date).years
