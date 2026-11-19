import z from "zod"
import { ApiError, toApiError } from "./errors"

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
type Query = Record<string, string | number | boolean | undefined | null>
type RequestOptions = { query?: Query; body?: unknown; signal?: AbortSignal }

// Các đường này tự trả 401 với ý nghĩa riêng (sai mật khẩu, token mail hết hạn), không phải hết phiên.
const NO_REFRESH_PATHS = ["/auth/login", "/auth/refresh", "/auth/forgot-password", "/auth/reset-password"]

let refreshInFlight: Promise<boolean> | null = null

/** Nhiều request cùng nhận 401 chỉ tạo ra MỘT lần refresh. */
function refreshSession(): Promise<boolean> {
  refreshInFlight ??= fetch("/api/auth/refresh", { method: "POST" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshInFlight = null
    })
  return refreshInFlight
}

function redirectToLogin(): never {
  const back = window.location.pathname + window.location.search
  // cố ý tải lại toàn trang để xoá mọi state trong bộ nhớ khi phiên hết hạn
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign(`/login?back=${encodeURIComponent(back)}`)
  throw new ApiError(401, "SESSION_EXPIRED", "Session expired, please log in again.")
}

function buildUrl(path: string, query: Query = {}): URL {
  const url = new URL(`/api${path}`, window.location.origin)
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  }
  return url
}

async function request<T>(
  method: Method,
  path: string,
  schema: z.ZodType<T>,
  options: RequestOptions = {},
  isRetry = false,
): Promise<T> {
  const hasBody = options.body !== undefined
  const res = await fetch(buildUrl(path, options.query), {
    method,
    headers: { accept: "application/json", ...(hasBody ? { "content-type": "application/json" } : {}) },
    body: hasBody ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })

  if (res.status === 401 && !isRetry && !NO_REFRESH_PATHS.includes(path)) {
    if (await refreshSession()) return request(method, path, schema, options, true)
    redirectToLogin()
  }

  const json: unknown = res.status === 204 ? {} : await res.json().catch(() => undefined)

  if (!res.ok) {
    throw toApiError(res.status, json)
  }
  const data = await res.json()
  return schema.parse(data)
}

export const http = {
  get: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "body">) =>
    request("GET", path, schema, options),
  post: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "body">) =>
    request("POST", path, schema, options),
  patch: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "body">) =>
    request("PATCH", path, schema, options),
  delete: <T>(path: string, schema: z.ZodType<T>, options?: Omit<RequestOptions, "body">) =>
    request("DELETE", path, schema, options),
}
