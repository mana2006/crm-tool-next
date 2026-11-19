import { z } from "zod"

const serverEnvSchema = z.object({
  API_BACKEND_URL: z.string().transform((url) => url.replace(/\/$/, "")), // Remove trailing slash if present
  TRUSTED_PROXY_HOPS: z.coerce.number().min(1).int().default(1),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cached: ServerEnv | undefined

export function getServerEnv(): ServerEnv {
  cached ??= serverEnvSchema.parse(process.env)
  return cached
}
