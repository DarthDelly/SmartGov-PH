from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .authentication import CookieJWTAuthentication, enforce_csrf
from .serializers import UserSerializer


def _set_token_cookies(response: Response, refresh: RefreshToken) -> None:
    """
    Write access_token and refresh_token as HttpOnly cookies.
    All security flags come from settings so they are env-driven.
    """
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    access_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]
    refresh_lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]

    cookie_kwargs = {
        "httponly": True,
        "secure": settings.COOKIE_SECURE,
        "samesite": settings.COOKIE_SAMESITE,
        "path": "/",
    }

    response.set_cookie(
        "access_token",
        access_token,
        max_age=int(access_lifetime.total_seconds()),
        **cookie_kwargs,
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        max_age=int(refresh_lifetime.total_seconds()),
        **cookie_kwargs,
    )


def _delete_token_cookies(response: Response) -> None:
    """Clear both token cookies and the CSRF cookie on logout."""
    for name in ("access_token", "refresh_token", "csrftoken"):
        response.delete_cookie(name, path="/")


class LoginView(APIView):
    """
    POST /api/auth/login/

    Validates email + password, issues JWT cookies, and bootstraps the
    CSRF cookie.  Login itself is not CSRF-protected because it is the
    endpoint that establishes auth state (bootstraps the csrftoken).
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)
        if user is None:
            return Response(
                {"detail": "Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"detail": "This account has been disabled."},
                status=status.HTTP_403_FORBIDDEN,
            )

        refresh = RefreshToken.for_user(user)
        data = UserSerializer(user).data

        response = Response(data, status=status.HTTP_200_OK)
        _set_token_cookies(response, refresh)

        # Bootstrap the CSRF cookie so the frontend can read it immediately
        # after login and attach X-CSRFToken to subsequent mutating requests.
        get_token(request)

        return response


class LogoutView(APIView):
    """
    POST /api/auth/logout/

    Requires a valid access token (IsAuthenticated) so CSRF is enforced
    automatically by CookieJWTAuthentication.  Blacklists the refresh
    token and clears all auth cookies.
    """

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        raw_refresh = request.COOKIES.get("refresh_token")
        if raw_refresh:
            try:
                token = RefreshToken(raw_refresh)
                token.blacklist()
            except TokenError:
                # Already expired or invalid — still proceed with cookie cleanup.
                pass

        response = Response({"detail": "Logged out."}, status=status.HTTP_200_OK)
        _delete_token_cookies(response)
        return response


class RefreshView(APIView):
    """
    POST /api/auth/refresh/

    Issues a new access_token + refresh_token pair (rotation).
    The old refresh token is blacklisted automatically by simplejwt when
    BLACKLIST_AFTER_ROTATION is True.

    No access token is required (it may be expired), so we enforce CSRF
    explicitly instead of relying on CookieJWTAuthentication.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        enforce_csrf(request)

        raw_refresh = request.COOKIES.get("refresh_token")
        if not raw_refresh:
            return Response(
                {"detail": "Refresh token not found."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            old_refresh = RefreshToken(raw_refresh)
            user_id = old_refresh.get("user_id")
            User = get_user_model()
            user = User.objects.get(pk=user_id, is_active=True)

            # Rotation: blacklist the current refresh token and issue a new pair.
            old_refresh.blacklist()
            new_refresh = RefreshToken.for_user(user)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found or inactive."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except TokenError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({"detail": "Token refreshed."}, status=status.HTTP_200_OK)
        _set_token_cookies(response, new_refresh)
        return response


class MeView(APIView):
    """
    GET /api/auth/me/

    Returns the authenticated user's public profile.
    Safe method — no CSRF required.
    """

    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class CsrfView(APIView):
    """
    GET /api/auth/csrf/

    Phase-2 placeholder.  Sets the csrftoken cookie so the frontend can
    bootstrap CSRF before making any POST request (e.g. before the user
    has logged in).  Returns 204 No Content.
    """

    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        get_token(request)
        return Response(status=status.HTTP_204_NO_CONTENT)
