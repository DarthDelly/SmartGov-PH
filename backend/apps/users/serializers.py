from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    """
    Public user representation returned by /login/ and /me/.
    Deliberately omits password, is_superuser, and other internal fields.
    """

    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "role", "barangay", "avatar"]
        read_only_fields = fields
