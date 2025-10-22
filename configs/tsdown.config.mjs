import { defineConfig } from "tsdown"

const commonConfig = {
  entry: ["src/index.ts"],
  sourcemap: true,
}

const sharedOutputOptions = {
  dir: undefined,
  name: "datasetConfig",
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
      ...sharedOutputOptions,
      file: `dist/dataset-config.browser.${isProd ? "min." : ""}js`,
    },
  },
  {
    ...commonConfig,
    clean: false,
    format: "umd",
    minify: isProd,
    outputOptions: {
      ...sharedOutputOptions,
      file: `dist/dataset-config.umd.${isProd ? "min." : ""}js`,
    },
  },
])

if (isProd) {
  config = config.filter((item) => ["iife", "umd"].includes(item.format))
}

export default config
