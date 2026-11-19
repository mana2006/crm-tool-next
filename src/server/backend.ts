import "server-only"
import { getServerEnv } from "./env"

/**
 * Gửi yêu cầu đến backend với URL và tùy chọn đã cho.
 * @param path - Đường dẫn đến endpoint backend
 * @param init - Tùy chọn yêu cầu
 * @returns Promise resolving to the response from the backend
 */
export function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${getServerEnv().API_BACKEND_URL}${path}`, {
    ...init,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(15_000),
  })
}
