// 默认参数接口
export interface DatasetParserOptions {
  prefix?: string
  parseFunction?: boolean
  excludeKeys?: string[]
}

declare global {
  interface Window {
    [key: string]: unknown
  }
}

const DEFAULT: Required<DatasetParserOptions> = {
  prefix: "",
  parseFunction: true,
  excludeKeys: [],
}

export default class DatasetParser {
  #element: HTMLElement
  #options: Required<DatasetParserOptions>
  // 存储排除路径（每项为 ["config","foo","delay"]）
  #excludePaths: string[][]

  constructor(element: HTMLElement, options: DatasetParserOptions = {}) {
    this.#element = element
    this.#options = { ...DEFAULT, ...options }

    this.#excludePaths = this.#options.excludeKeys.map((path) =>
      this.#normalizePath(path),
    )
  }

  parse(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    const prefixLength = this.#options.prefix.length

    for (const key in this.#element.dataset) {
      const value = this.#element.dataset[key]
      if (value === undefined) continue

      let realKey: string
      if (this.#options.prefix) {
        if (!key.startsWith(this.#options.prefix)) continue
        realKey = this.#pascalToCamel(key.slice(prefixLength))
      } else {
        realKey = this.#toCamelCase(key)
      }

      // 检查是否被排除
      if (this.#isExcluded(realKey)) continue

      this.#setDeepProperty(data, realKey, this.#parseValue(value))
    }

    return data
  }

  // 检查某路径是否在排除列表内（支持深层路径匹配）
  #isExcluded(keyPath: string): boolean {
    const targetPath = this.#normalizePath(keyPath)

    return this.#excludePaths.some((excludePath) => {
      // 如果 excludePath 是 targetPath 的前缀，则匹配
      if (excludePath.length <= targetPath.length) {
        return excludePath.every((part, i) => part === targetPath[i])
      }
      return false
    })
  }

  // 规范化路径为小驼峰数组
  #normalizePath(path: string): string[] {
    return this.#toCamelCase(path)
      .split(".")
      .map((p) => this.#pascalToCamel(p))
  }

  #setDeepProperty(
    obj: Record<string, unknown>,
    keyPath: string,
    value: unknown,
  ): void {
    const keys = this.#toCamelCase(keyPath).split(".")
    let temp = obj

    for (const [index, key] of keys.entries()) {
      if (index === keys.length - 1) {
        temp[key] = value
      } else {
        if (!temp[key] || typeof temp[key] !== "object") {
          temp[key] = {}
        }
        temp = temp[key] as Record<string, unknown>
      }
    }
  }

  #parseValue(val: string): unknown {
    const { parseFunction } = this.#options

    if (parseFunction && typeof (window as Window)[val] === "function") {
      return (window as Window)[val]
    }

    if (val === "true") return true
    if (val === "false") return false
    if (!isNaN(Number(val)) && val.trim() !== "") return Number(val)

    if (
      (val.startsWith("{") && val.endsWith("}")) ||
      (val.startsWith("[") && val.endsWith("]"))
    ) {
      try {
        return JSON.parse(val)
      } catch {
        return val
      }
    }

    return val
  }

  #toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase())
  }

  #pascalToCamel(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
}
