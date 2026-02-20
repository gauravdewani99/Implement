const API_BASE = import.meta.env.VITE_API_URL || "https://implement-backend.onrender.com/api/v1"

/** Default request timeout (15 seconds) — generous for Render free-tier cold starts */
const REQUEST_TIMEOUT_MS = 15_000

let accessToken: string | null = null

export function setAccessToken(token: string | null) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new ApiError(response.status, errorBody.detail || "Request failed")
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError(0, "Request timed out — the server may be starting up. Please try again.")
    }
    throw new ApiError(0, "Network error — please check your connection and try again.")
  } finally {
    clearTimeout(timeoutId)
  }
}

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}
