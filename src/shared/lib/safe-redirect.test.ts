import { describe, expect, it } from "vitest"

import { safeRedirectPath } from "./safe-redirect"

describe("safeRedirectPath", () => {
  it("giữ nguyên đường dẫn nội bộ", () => {
    expect(safeRedirectPath("/contacts?status=lead")).toBe("/contacts?status=lead")
  })

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "/\t/evil.example",
    "javascript:alert(1)",
    "",
    null,
    undefined,
  ])("chặn %s", (value) => {
    expect(safeRedirectPath(value)).toBe("/dashboard")
  })
})
