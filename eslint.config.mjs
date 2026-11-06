import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const FEATURES_DIR = new URL("./src/features", import.meta.url);
const FEATURES = !existsSync(FEATURES_DIR)
    ? []
    : readdirSync(FEATURES_DIR, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((entry) => entry.name);

const NO_DEEP_RELATIVE = {
    group: ["../../*"],
    message: "Use alias @/ instead ../../",
};

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
]);

export default eslintConfig;
