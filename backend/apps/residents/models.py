from django.conf import settings
from django.db import models


class Resident(models.Model):
    STATUS_CHOICES = [("active", "Active"), ("inactive", "Inactive")]

    # Nullable link to a login account. Staff can register a resident before
    # that person ever creates a login.
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="resident_profile",
    )
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    purok = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    phone = models.CharField(max_length=20, blank=True)
    # birth_date instead of a stored age field — age is computed in the serializer
    # using relativedelta so it never goes stale.
    birth_date = models.DateField(null=True, blank=True)
    occupation = models.CharField(max_length=150, blank=True)
    last_transaction = models.DateField(null=True, blank=True)
    # barangay is kept because the app supports multiple barangays (signup form
    # already lists 12). A resident record belongs to a specific barangay and
    # staff are scoped to one. Removing it would require a FK to a Barangay model
    # that does not exist yet.
    barangay = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["last_name", "first_name"]

    def __str__(self) -> str:
        return f"{self.last_name}, {self.first_name}"
