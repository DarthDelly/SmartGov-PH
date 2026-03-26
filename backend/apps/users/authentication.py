from django.middleware.csrf import CsrfViewMiddleware
from rest_framework import exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication

_csrf_middleware = CsrfViewMiddleware(get_response=lambda request: None)


def enforce_csrf(request):
    """
    Run Django's CSRF middleware checks against the request.
    Raises PermissionDenied if the token is missing or invalid.
    Called on any unsafe method (POST/PUT/PATCH/DELETE) that carries a
    valid JWT cookie, and explicitly from views that may not have a valid
    access token (e.g. /refresh/, /logout/).
    """
    _csrf_middleware.process_request(request)
    reason = _csrf_middleware.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class CookieJWTAuthentication(JWTAuthentication):
    """
    Reads the JWT access token from the 'access_token' HttpOnly cookie
    instead of the Authorization header.

    CSRF is enforced on all unsafe methods when a valid token is found,
    so that authenticated mutating requests cannot be forged cross-site.
    """

    def authenticate(self, request):
        raw_token = request.COOKIES.get("access_token")
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception:
            return None

        if request.method not in ("GET", "HEAD", "OPTIONS", "TRACE"):
            enforce_csrf(request)

        return self.get_user(validated_token), validated_token
