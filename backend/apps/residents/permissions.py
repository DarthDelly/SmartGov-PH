from rest_framework.permissions import BasePermission


class IsStaffOrAdmin(BasePermission):
    """
    Grants access only to users whose role is 'staff' or 'admin'.
    Residents are explicitly excluded — they use other endpoints.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("staff", "admin")
        )
