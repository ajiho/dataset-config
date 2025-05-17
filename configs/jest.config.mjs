/** @type {import('jest').Config} */
const config = {
  rootDir: "..",
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  clearMocks: true,
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    // "/node_modules/(?!(is-what)/)",//白名单转译这些模块,该方式比较繁琐
    "<rootDir>node_modules/",
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": [
      "babel-jest",
      {
        presets: [["@babel/preset-env", { targets: { node: "current" } }]],
      },
    ],
  },

  // 覆盖率相关
  // 测试覆盖率报告输出目录
  coverageDirectory: "coverage",
  coverageProvider: "babel",
  // 覆盖率阈值，如果没有达到阈值则测试失败
  coverageThreshold: {
    // 全局的
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      //未覆盖的语句超过 10 条
      statements: -10,
    },
  },
}

export default config
