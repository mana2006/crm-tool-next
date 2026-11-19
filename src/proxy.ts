import { NextRequest, NextResponse } from "next/server"
import { REFRESH_COOKIE } from "./server/auth/cookie-names"

const GUEST_ONLY_PATHS = ["/login", "/forgot-password"]
const PUBLIC_PATHS = ["reset-password"]

const startWithAny = (pathname: string, paths: string[]) =>
  paths.some((path) => pathname.startsWith(`${path}/`))

/** Chỉ kiểm tra cookie có tồn tại; token còn hợp lệ hay không là việc của backend. */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  if (startWithAny(pathname, PUBLIC_PATHS)) return NextResponse.next()

  const isGuestOnly = startWithAny(pathname, GUEST_ONLY_PATHS)
  const hasSession = request.cookies.has(REFRESH_COOKIE)

  if (!hasSession && !isGuestOnly) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname + search)
    return NextResponse.redirect(loginUrl)
  }
  if (hasSession && isGuestOnly) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|images/).*)"],
}
