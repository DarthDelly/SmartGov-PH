"""
Phase 3 – Resident endpoint tests.

All requests use force_authenticate() so tests are independent of the
cookie/CSRF stack (that is covered by auth tests). The API contract under
test is the HTTP interface exposed by ListCreateAPIView + RetrieveUpdateAPIView.
"""

import pytest
from datetime import date

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.residents.models import Resident

User = get_user_model()

LIST_URL = "/api/residents/"


def detail_url(pk):
    return f"/api/residents/{pk}/"


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def staff_user(db):
    return User.objects.create_user(
        email="staff@test.local",
        username="staff@test.local",
        password="Staffpass1!",
        first_name="Staff",
        last_name="User",
        role="staff",
        barangay="Brgy. San Isidro",
    )


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(
        email="admin@test.local",
        username="admin@test.local",
        password="Adminpass1!",
        first_name="Admin",
        last_name="User",
        role="admin",
        barangay="Brgy. San Isidro",
    )


@pytest.fixture
def resident_user(db):
    return User.objects.create_user(
        email="resident@test.local",
        username="resident@test.local",
        password="Respass1!",
        first_name="Resident",
        last_name="User",
        role="resident",
        barangay="Brgy. San Isidro",
    )


@pytest.fixture
def residents(db):
    """3 resident rows: 2 active, 1 inactive, varied puroks and occupations."""
    r1 = Resident.objects.create(
        first_name="Maria",
        last_name="Aguilar",
        purok="Purok 1",
        status="active",
        occupation="Teacher",
        barangay="Brgy. San Isidro",
        birth_date=date(1990, 6, 15),
        last_transaction=date(2025, 3, 1),
    )
    r2 = Resident.objects.create(
        first_name="Jose",
        last_name="Bautista",
        purok="Purok 2",
        status="active",
        occupation="Farmer",
        barangay="Brgy. San Isidro",
        birth_date=date(1975, 2, 20),
    )
    r3 = Resident.objects.create(
        first_name="Rosa",
        last_name="Cruz",
        purok="Purok 1",
        status="inactive",
        occupation="Retired",
        barangay="Brgy. San Isidro",
        birth_date=None,
    )
    return [r1, r2, r3]


# ---------------------------------------------------------------------------
# GET /api/residents/ — list
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_list_requires_auth(client):
    response = client.get(LIST_URL)
    assert response.status_code == 401


@pytest.mark.django_db
def test_list_resident_forbidden(client, resident_user, residents):
    client.force_authenticate(user=resident_user)
    response = client.get(LIST_URL)
    assert response.status_code == 403


@pytest.mark.django_db
def test_list_ok_staff(client, staff_user, residents):
    client.force_authenticate(user=staff_user)
    response = client.get(LIST_URL)
    assert response.status_code == 200
    data = response.json()
    assert "count" in data
    assert "results" in data
    assert data["count"] == 3


@pytest.mark.django_db
def test_list_ok_admin(client, admin_user, residents):
    client.force_authenticate(user=admin_user)
    response = client.get(LIST_URL)
    assert response.status_code == 200
    assert response.json()["count"] == 3


@pytest.mark.django_db
def test_list_search_occupation(client, staff_user, residents):
    client.force_authenticate(user=staff_user)
    response = client.get(LIST_URL, {"search": "Teacher"})
    assert response.status_code == 200
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["occupation"] == "Teacher"


@pytest.mark.django_db
def test_list_search_last_name(client, staff_user, residents):
    client.force_authenticate(user=staff_user)
    response = client.get(LIST_URL, {"search": "Bau"})  # partial "Bautista"
    assert response.status_code == 200
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["last_name"] == "Bautista"


@pytest.mark.django_db
def test_list_search_purok(client, staff_user, residents):
    client.force_authenticate(user=staff_user)
    response = client.get(LIST_URL, {"search": "Purok 2"})
    assert response.status_code == 200
    results = response.json()["results"]
    assert len(results) == 1
    assert results[0]["purok"] == "Purok 2"


@pytest.mark.django_db
def test_list_default_ordering(client, staff_user, residents):
    client.force_authenticate(user=staff_user)
    response = client.get(LIST_URL)
    assert response.status_code == 200
    last_names = [r["last_name"] for r in response.json()["results"]]
    assert last_names == sorted(last_names)


# ---------------------------------------------------------------------------
# GET /api/residents/<pk>/ — detail
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_detail_requires_auth(client, residents):
    response = client.get(detail_url(residents[0].pk))
    assert response.status_code == 401


@pytest.mark.django_db
def test_detail_ok(client, staff_user, residents):
    resident = residents[0]  # Maria Aguilar, birth_date set
    client.force_authenticate(user=staff_user)
    response = client.get(detail_url(resident.pk))
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == resident.first_name
    assert data["last_name"] == resident.last_name
    # age must be a non-null integer since birth_date is set
    assert isinstance(data["age"], int)
    assert data["age"] > 0


@pytest.mark.django_db
def test_detail_not_found(client, staff_user):
    client.force_authenticate(user=staff_user)
    response = client.get(detail_url(99999))
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# POST /api/residents/ — create
# ---------------------------------------------------------------------------

VALID_PAYLOAD = {
    "first_name": "Liza",
    "last_name": "Mendoza",
    "purok": "Purok 3",
    "status": "active",
    "occupation": "Nurse",
    "barangay": "Brgy. San Isidro",
    "phone": "09171234567",
    "birth_date": "1995-04-10",
}


@pytest.mark.django_db
def test_create_ok_staff(client, staff_user):
    client.force_authenticate(user=staff_user)
    response = client.post(LIST_URL, VALID_PAYLOAD, format="json")
    assert response.status_code == 201
    assert Resident.objects.filter(last_name="Mendoza").exists()


@pytest.mark.django_db
def test_create_ok_admin(client, admin_user):
    client.force_authenticate(user=admin_user)
    response = client.post(LIST_URL, VALID_PAYLOAD, format="json")
    assert response.status_code == 201


@pytest.mark.django_db
def test_create_missing_fields(client, staff_user):
    client.force_authenticate(user=staff_user)
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "first_name"}
    response = client.post(LIST_URL, payload, format="json")
    assert response.status_code == 400
    assert "first_name" in response.json()


@pytest.mark.django_db
def test_create_invalid_status(client, staff_user):
    client.force_authenticate(user=staff_user)
    payload = {**VALID_PAYLOAD, "status": "unknown"}
    response = client.post(LIST_URL, payload, format="json")
    assert response.status_code == 400
    assert "status" in response.json()


@pytest.mark.django_db
def test_create_resident_forbidden(client, resident_user):
    client.force_authenticate(user=resident_user)
    response = client.post(LIST_URL, VALID_PAYLOAD, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_create_null_last_transaction(client, staff_user):
    client.force_authenticate(user=staff_user)
    payload = {k: v for k, v in VALID_PAYLOAD.items() if k != "last_transaction"}
    response = client.post(LIST_URL, payload, format="json")
    assert response.status_code == 201
    assert response.json()["last_transaction"] is None


# ---------------------------------------------------------------------------
# PATCH /api/residents/<pk>/ — partial update
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_patch_ok(client, staff_user, residents):
    resident = residents[0]
    client.force_authenticate(user=staff_user)
    response = client.patch(detail_url(resident.pk), {"status": "inactive"}, format="json")
    assert response.status_code == 200
    assert response.json()["status"] == "inactive"
    resident.refresh_from_db()
    assert resident.status == "inactive"


@pytest.mark.django_db
def test_patch_resident_forbidden(client, resident_user, residents):
    client.force_authenticate(user=resident_user)
    response = client.patch(detail_url(residents[0].pk), {"status": "inactive"}, format="json")
    assert response.status_code == 403


@pytest.mark.django_db
def test_patch_not_found(client, staff_user):
    client.force_authenticate(user=staff_user)
    response = client.patch(detail_url(99999), {"status": "inactive"}, format="json")
    assert response.status_code == 404
