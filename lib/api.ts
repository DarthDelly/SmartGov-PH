/**
 * Thin fetch wrapper for all Django API calls.
 *
 * - credentials: 'include' on every request so cookies are always sent.
 * - Reads the `csrftoken` cookie and attaches it as `X-CSRFToken` on
 *   all mutating methods (POST / PUT / PATCH / DELETE).
 * - 401 auto-refresh interceptor:
 *     1. Request fails with 401
 *     2. Attempt POST /api/auth/refresh/ once
 *     3. Retry the original request
 *     4. If still 401 — clear auth state and redirect to /login
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function getCsrfToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/(?:^|;\s*)csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

function buildHeaders(init?: RequestInit): HeadersInit {
  const method = (init?.method ?? "GET").toUpperCase();
  const base: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string>),
  };
  if (UNSAFE_METHODS.has(method)) {
    const csrf = getCsrfToken();
    if (csrf) base["X-CSRFToken"] = csrf;
  }
  return base;
}

function clearAuthAndRedirect(): void {
  // Import lazily to avoid circular dependency with the store.
  import("@/lib/store/auth-store").then(({ useAuthStore }) => {
    useAuthStore.getState().logout();
  });
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const url = `${BASE_URL}${path}`;
  const options: RequestInit = {
    ...init,
    credentials: "include",
    headers: buildHeaders(init),
  };

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Attempt a silent token refresh.
    const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh/`, {
      method: "POST",
      credentials: "include",
      headers: buildHeaders({ method: "POST" }),
    });

    if (!refreshResponse.ok) {
      clearAuthAndRedirect();
      return response;
    }

    // Retry the original request with the new access token cookie.
    response = await fetch(url, options);

    if (response.status === 401) {
      clearAuthAndRedirect();
    }
  }

  return response;
}

/** Convenience wrappers */
export const api = {
  get: (path: string, init?: RequestInit) =>
    apiFetch(path, { ...init, method: "GET" }),

  post: (path: string, body?: unknown, init?: RequestInit) =>
    apiFetch(path, {
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: (path: string, body?: unknown, init?: RequestInit) =>
    apiFetch(path, {
      ...init,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: (path: string, body?: unknown, init?: RequestInit) =>
    apiFetch(path, {
      ...init,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: (path: string, init?: RequestInit) =>
    apiFetch(path, { ...init, method: "DELETE" }),
};
