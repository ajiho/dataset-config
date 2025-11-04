import { defineConfig } from "tsdown"

const commonConfig = {
  entry: ["src/index.ts"],
  sourcemap: true,
  clean: false,
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
    format: "iife",
    minify: isProd,
    outputOptions: {
      ...sharedOutputOptions,
      file: `dist/dataset-config.browser.${isProd ? "min." : ""}js`,
    },
  },
  {
    ...commonConfig,

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
