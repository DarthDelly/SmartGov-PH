from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLES = [
        ("resident", "Resident"),
        ("staff", "Barangay Staff"),
        ("admin", "Municipal Admin"),
    ]

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLES, default="resident")
    # Phase 1: plain text field.  Phase 2: ForeignKey to a Barangay model.
    barangay = models.CharField(max_length=200, blank=True)
    avatar = models.URLField(blank=True)

    USERNAME_FIELD = "email"
    # username is still required by AbstractUser; keep it but don't expose it.
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = "user"
        verbose_name_plural = "users"

    def __str__(self) -> str:
        return self.email
