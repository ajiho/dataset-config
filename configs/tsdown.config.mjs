import { defineConfig } from "tsdown"

const commonConfig = {
  entry: ["src/index.ts"],
  sourcemap: true,
}
const isProd = process.env.NODE_ENV === "production"

let config = defineConfig([
  {
    ...commonConfig,
    outDir: "dist",
    format: ["esm", "cjs"],
    minify: false,
  },
  {
    ...commonConfig,
    clean: false,
    format: "iife",
    minify: isProd,
    outputOptions: {
      dir: undefined,
      name: "datasetConfig",
      file: `dist/dataset-config.browser.${isProd ? "min." : ""}js`,
    },
  },
])

if (isProd) {
  config = config.filter((item) => item.format === "iife")
}

export default config
