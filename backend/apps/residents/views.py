from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from rest_framework.pagination import PageNumberPagination

from .models import Resident
from .permissions import IsStaffOrAdmin
from .serializers import ResidentSerializer


class ResidentPagination(PageNumberPagination):
    """
    Scoped to residents only — not a global default.
    Response shape: { count, next, previous, results }
    """
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class ResidentListCreateView(ListCreateAPIView):
    """
    GET  /api/residents/          — paginated list (staff/admin only)
    POST /api/residents/          — create a resident (staff/admin only)

    Supports:
      ?search=<term>   case-insensitive match on first_name, last_name, purok, occupation
      ?ordering=<field>  last_name | first_name | created_at  (default: last_name, first_name)
      ?page=<n>          page number
    """
    queryset = Resident.objects.select_related("user").all()
    serializer_class = ResidentSerializer
    permission_classes = [IsStaffOrAdmin]
    pagination_class = ResidentPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["first_name", "last_name", "purok", "occupation"]
    ordering_fields = ["last_name", "first_name", "created_at"]
    ordering = ["last_name", "first_name"]


class ResidentRetrieveUpdateView(RetrieveUpdateAPIView):
    """
    GET   /api/residents/<pk>/    — single resident detail (staff/admin only)
    PATCH /api/residents/<pk>/    — partial update (staff/admin only)

    PUT is excluded — partial updates via PATCH only.
    """
    queryset = Resident.objects.select_related("user").all()
    serializer_class = ResidentSerializer
    permission_classes = [IsStaffOrAdmin]
    http_method_names = ["get", "patch", "head", "options"]
