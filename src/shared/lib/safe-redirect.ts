const INTERNAL_ORIGIN = "http://internal.invalid"

/** Chỉ cho phép quay về đường dẫn nội bộ; mọi giá trị trỏ ra ngoài đều thành `fallback`. */
export function safeRedirectPath(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value || !value.startsWith("/")) return fallback
  try {
    const url = new URL(value, INTERNAL_ORIGIN)
    if (url.origin !== INTERNAL_ORIGIN) return fallback
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}
