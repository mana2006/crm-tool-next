export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError

type ErrorBody = { message?: string | string[]; error?: string; code?: string }

/** Gom lỗi của Nest ({ statusCode, message, error }) và của BFF ({ code }) về một dạng. */
export function toApiError(status: number, body: unknown): ApiError {
  const { message, error, code } = (body ?? {}) as ErrorBody
  const text = Array.isArray(message) ? message[0] : message
  return new ApiError(
    status,
    code ?? error ?? "UNKNOWN_ERROR",
    text ?? "Unknown error, please try again later.",
  )
}
