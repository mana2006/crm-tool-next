import { getServerEnv } from "@/server/env"

export function clientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    const hops = getServerEnv().TRUSTED_PROXY_HOPS
    const ips = forwardedFor
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean)
    if (ips.length >= hops) {
      return ips[ips.length - hops]
    }
  }
}
