// @vitest-environment node
import { describe, expect, it, vi } from "vitest"

import { getServerEnv } from "@/server/env"

import { clientIp } from "./client-ip"

vi.mock("@/server/env", () => ({ getServerEnv: vi.fn() }))

describe("clientIp", () => {
  it.each([
    { header: "::1", hops: 1, expected: "::1" },
    { header: "9.9.9.9, 203.0.113.7, 172.68.1.1", hops: 2, expected: "203.0.113.7" },
    { header: "203.0.113.7, 172.68.1.1", hops: 2, expected: "203.0.113.7" },
    { header: "9.9.9.9, ::1", hops: 1, expected: "::1" },
    { header: "a, b, c", hops: 1, expected: "c" },
    { header: "9.9.9.9,  ::1", hops: 1, expected: "::1" },
    { header: "::1", hops: 2, expected: undefined },
  ])("hops=$hops, header '$header' → $expected", ({ header, hops, expected }) => {
    vi.mocked(getServerEnv).mockReturnValue({
      API_BACKEND_URL: "http://localhost:3000",
      TRUSTED_PROXY_HOPS: hops,
    })
    const request = new Request("http://localhost", { headers: { "x-forwarded-for": header } })
    expect(clientIp(request)).toBe(expected)
  })

  it("returns undefined if x-forwarded-for header is missing", () => {
    vi.mocked(getServerEnv).mockReturnValue({
      API_BACKEND_URL: "http://localhost:3000",
      TRUSTED_PROXY_HOPS: 1,
    })
    const request = new Request("http://localhost")
    expect(clientIp(request)).toBeUndefined()
  })
})
