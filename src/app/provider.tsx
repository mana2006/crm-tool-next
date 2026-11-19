"use client"

import { makeQueryClient } from "@/shared/api/query-client"
import { QueryClientProvider } from "@tanstack/react-query"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { ReactNode, useState } from "react"
import { Toaster } from "sonner"

export function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster />
    </QueryClientProvider>
  )
}
