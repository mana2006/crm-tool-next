import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/server/auth/cookie-names"
import { backendFetch } from "@/server/backend"
import { clientIp } from "@/server/http/client-ip"
import { NextRequest } from "next/server"

// Chỉ những header và cookie này được đi qua BFF. Thêm cái mới phải có lý do.
const REQUEST_HEADERS = [
  "accept",
  "accept-language",
  "content-language",
  "content-type",
  "user-agent",
] as const
const RESPONSE_HEADERS = ["content-type", "cache-control", "content-disposition"] as const
const SESSION_COOKIES = [ACCESS_COOKIE, REFRESH_COOKIE]
const BODY_LESS_STATUSES = new Set([204, 205, 304])

/** Chuyển tiếp /api/* lên backend kèm cookie phiên. Không chứa logic nghiệp vụ. */
async function forward(request: NextRequest, ctx: RouteContext<"/api/[...path]">): Promise<Response> {
  const { path } = await ctx.params

  if (!path.every(isSafeSegment)) {
    return Response.json({ code: "BFF_INVALID_PATH" }, { status: 400 })
  }

  const headers = new Headers()
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value) {
      headers.set(name, value)
    }
  }

  const ip = clientIp(request)
  if (ip) headers.set("x-forwarded-for", ip)

  const cookie = SESSION_COOKIES.flatMap((name) => {
    const value = request.cookies.get(name)?.value
    return value ? [`${name}=${value}`] : []
  }).join("; ")

  if (cookie) headers.set("cookie", cookie)

  const body = request.method === "GET" ? undefined : await request.arrayBuffer()
  const target = `/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`

  try {
    const upstream = await backendFetch(target, {
      method: request.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
    })
    const responseHeaders = new Headers()
    for (const name of RESPONSE_HEADERS) {
      const value = upstream.headers.get(name)
      if (value) responseHeaders.set(name, value)
    }
    // Backend đặt và xoá cookie phiên; BFF chỉ chuyển nguyên về trình duyệt.
    for (const value of upstream.headers.getSetCookie()) {
      responseHeaders.append("set-cookie", value)
    }
    return new Response(BODY_LESS_STATUSES.has(upstream.status) ? null : upstream.body, {
      status: upstream.status,
      headers: responseHeaders,
    })
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError"
    return Response.json(
      {
        code: timedOut ? "BFF_UPSTREAM_TIMEOUT" : "BFF_UPSTREAM_UNAVAILABLE",
      },
      { status: timedOut ? 504 : 502 },
    )
  }
}

function isSafeSegment(segment: string): boolean {
  let decoded: string
  try {
    decoded = decodeURIComponent(segment)
  } catch {
    return false
  }
  return decoded !== "" && decoded !== "." && decoded !== ".." && !/[\\/\0]/.test(decoded)
}

export const GET = forward
export const POST = forward
export const PUT = forward
export const PATCH = forward
export const DELETE = forward
