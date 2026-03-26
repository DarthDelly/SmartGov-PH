from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework import serializers

from .models import CustomUser


class SignupSerializer(serializers.Serializer):
    email      = serializers.EmailField()
    password   = serializers.CharField(write_only=True, trim_whitespace=False)
    first_name = serializers.CharField(trim_whitespace=True, allow_blank=False)
    last_name  = serializers.CharField(trim_whitespace=True, allow_blank=False)
    barangay   = serializers.CharField(trim_whitespace=True, allow_blank=False)

    def validate_email(self, value):
        value = value.strip().lower()
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError(e.messages)
        return value

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            email      = validated_data["email"],
            username   = validated_data["email"],
            password   = validated_data["password"],
            first_name = validated_data["first_name"],
            last_name  = validated_data["last_name"],
            barangay   = validated_data["barangay"],
            role       = "resident",
        )


class UserSerializer(serializers.ModelSerializer):
    """
    Public user representation returned by /login/ and /me/.
    Deliberately omits password, is_superuser, and other internal fields.
    """

    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "role", "barangay", "avatar"]
        read_only_fields = fields
