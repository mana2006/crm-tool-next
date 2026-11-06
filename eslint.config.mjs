import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const FEATURES_DIR = new URL("./src/features", import.meta.url)
const FEATURES = !existsSync(FEATURES_DIR)
  ? []
  : readdirSync(FEATURES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)

const NO_DEEP_RELATIVE = {
  group: ["../../*"],
  message: "Use alias @/ instead ../../",
}

const restrict = (files, patterns) => ({
  files,
  rules: { "no-restricted-imports": ["error", { patterns: [NO_DEEP_RELATIVE, ...patterns] }] },
})

const layerRules = [
  restrict(
    ["src/app/**/*.{ts,tsx}"],
    [{ group: ["@/features/*/*"], message: "Import feature qua public API: @/features/<tên>" }],
  ),
  ...FEATURES.map((feature) =>
    restrict(
      [`src/features/${feature}/**/*.{ts,tsx}`],
      [
        ...FEATURES.filter((other) => other !== feature).map((other) => ({
          group: [`@/features/${other}`, `@/features/${other}/*`],
          message: `Feature "${feature}" không được import feature "${other}". Đưa phần dùng chung xuống src/shared.`,
        })),
        { group: ["@/server/*", "@/app/*"], message: "Feature không import code server hoặc route." },
      ],
    ),
  ),
  restrict(
    ["src/shared/**/*.{ts,tsx}"],
    [
      {
        group: ["@/features/*", "@/app/*", "@/server/*"],
        message: "shared là tầng thấp nhất: chỉ import shared.",
      },
    ],
  ),
  restrict(
    ["src/server/**/*.ts"],
    [{ group: ["@/features/*", "@/app/*"], message: "server không phụ thuộc vào UI." }],
  ),
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...layerRules,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/shared/ui/**"],
    rules: {
      "max-lines": ["error", { max: 500, skipBlankLines: true, skipComments: true }],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
