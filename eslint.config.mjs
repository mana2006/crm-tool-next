import { existsSync, readdirSync } from "node:fs"

import nextVitals from "eslint-config-next/core-web-vitals" // luật React, hook, hiệu năng trang
import nextTs from "eslint-config-next/typescript" // luật riêng cho TypeScript
import { defineConfig, globalIgnores } from "eslint/config"

// (1) Tự đọc danh sách feature từ thư mục src/features. Chưa có thư mục thì danh sách rỗng.
//     Nhờ vậy thêm feature mới không phải sửa file này.
const FEATURES_DIR = new URL("./src/features", import.meta.url)
const FEATURES = !existsSync(FEATURES_DIR)
  ? []
  : readdirSync(FEATURES_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)

// (2) Cấm viết "../../": phải dùng alias @/ cho dễ đọc và để luật tầng bên dưới bắt được
const NO_DEEP_RELATIVE = { group: ["../../*"], message: "Dùng alias @/ thay cho ../../" }

// Hàm nhỏ tạo một khối luật: "file khớp `files` thì không được import những gì trong `patterns`"
const restrict = (files, patterns) => ({
  files,
  rules: { "no-restricted-imports": ["error", { patterns: [NO_DEEP_RELATIVE, ...patterns] }] },
})

// (3) Ranh giới tầng, đọc từng khối như đọc một câu tiếng Việt
const layerRules = [
  // file trong app/ không được import sâu vào bên trong một feature, chỉ qua index.ts
  restrict(
    ["src/app/**/*.{ts,tsx}"],
    [{ group: ["@/features/*/*"], message: "Import feature qua public API: @/features/<tên>" }],
  ),
  // mỗi feature không được import feature khác, không được import server/ và app/
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
  // shared/ là tầng thấp nhất: không biết gì về feature, route hay server
  restrict(
    ["src/shared/**/*.{ts,tsx}"],
    [
      {
        group: ["@/features/*", "@/app/*", "@/server/*"],
        message: "shared là tầng thấp nhất: chỉ import shared.",
      },
    ],
  ),
  // server/ không phụ thuộc vào UI
  restrict(
    ["src/server/**/*.ts"],
    [{ group: ["@/features/*", "@/app/*"], message: "server không phụ thuộc vào UI." }],
  ),
]

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...layerRules,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/shared/ui/**"], // code do shadcn sinh ra thì không tính
    rules: {
      "max-lines": ["error", { max: 250, skipBlankLines: true, skipComments: true }], // file quá 250 dòng thì tách
      "no-console": ["error", { allow: ["warn", "error"] }], // không để sót console.log
    },
  },
  // thư mục không cần lint: kết quả build và file tự sinh
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
])
