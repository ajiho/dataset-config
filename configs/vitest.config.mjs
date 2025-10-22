import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    clearMocks: true,
    environment: "jsdom",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [...configDefaults.exclude, "**/__tests__/**", "**/*.d.ts"],
      provider: "v8",
    },
  },
})
