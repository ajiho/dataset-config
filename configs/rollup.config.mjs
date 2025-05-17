import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import terser from "@rollup/plugin-terser"
import { defineConfig } from "rollup"
import pgk from "../package.json" with { type: "json" }
import path from "node:path"

const isProd = process.env.NODE_ENV === "production"

const plugins = [
  resolve(),
  commonjs(),
  babel({
    babelHelpers: "bundled",
    exclude: ["node_modules/**"],
    configFile: "./configs/babel.config.mjs",
  }),
]

if (isProd) {
  // 如果生产环境
  plugins.push(
    terser({
      output: {
        comments() {
          return false
        },
      },
    }),
  )
}

const input = "src/index.js"

const name = path.basename(pgk.name, path.extname(pgk.name))

let config = defineConfig([
  // amd
  {
    input,
    output: {
      file: `dist/${name}.amd.${isProd ? "min." : ""}js`,
      format: "amd",
      sourcemap: true,
    },
    plugins,
  },
  // iife
  {
    input,
    output: {
      file: `dist/${name}.browser.${isProd ? "min." : ""}js`,
      format: "iife",
      name: "datasetConfig",
      sourcemap: true,
    },
    plugins,
  },
  // ESM
  {
    input,
    output: {
      file: "dist/esm/index.mjs",
      format: "esm",
      sourcemap: true,
    },
    plugins,
  },

  // CJS
  {
    input,
    output: {
      file: "dist/cjs/index.js",
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
    plugins,
  },
])

if (isProd) {
  // 只保留amd和iife,esm cjs 不需要再次压缩
  config = config.filter((item) => ["iife", "amd"].includes(item.output.format))
}

export default config
