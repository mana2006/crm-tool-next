import { isApiError } from "./errors"
import { QueryClient } from "@tanstack/react-query"

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // 30s
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => !(isApiError(error) && error.status < 500) && failureCount < 2, // retry on network error or server error
      },
    },
  })
}
