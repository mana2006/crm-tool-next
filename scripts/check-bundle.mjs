import { readFileSync } from "node:fs"
import { gzipSync } from "node:zlib"

// Đơn vị KB đã nén gzip. Nâng ngân sách của một route phải có lý do ghi trong PR.
const BUDGET_KB = { default: 250, "/dashboard": 320 }

const stats = JSON.parse(readFileSync(".next/diagnostics/route-bundle-stats.json", "utf8"))
let failed = false

for (const { route, firstLoadChunkPaths } of stats) {
  const bytes = firstLoadChunkPaths.reduce((sum, file) => sum + gzipSync(readFileSync(file)).length, 0)
  const sizeKb = Math.round(bytes / 1024)
  const budgetKb = BUDGET_KB[route] ?? BUDGET_KB.default
  if (sizeKb > budgetKb) failed = true
  console.log(`${sizeKb > budgetKb ? "✗" : "✓"} ${route.padEnd(24)} ${sizeKb} KB / ${budgetKb} KB`)
}

process.exit(failed ? 1 : 0)
