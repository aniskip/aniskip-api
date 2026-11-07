import { defineConfig } from "vite-plus";

const ignorePatterns = ["deps/**"];

export default defineConfig({
  fmt: {
    ignorePatterns,
  },
  lint: {
    ignorePatterns,
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // Bun types `expect(...).rejects.toThrow()` as void, but it returns a
        // promise that must be awaited.
        files: ["**/*.spec.ts"],
        rules: { "typescript/await-thenable": "off" },
      },
    ],
  },
});
