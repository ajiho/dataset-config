// 默认参数接口
export interface DatasetParserOptions {
  /** 数据属性名称前缀，用于筛选指定前缀的属性 */
  prefix?: string
  /** 是否将函数名解析为实际的函数引用 */
  parseFunction?: boolean
  /** 排除的属性名称集合 */
  excludeKeys?: string[]
}

// 扩展 Window 接口的全局声明
declare global {
  interface Window {
    [key: string]: unknown
  }
}

// 默认参数
const DEFAULT: Required<DatasetParserOptions> = {
  prefix: "",
  parseFunction: true,
  excludeKeys: [],
}

export default class DatasetParser {
  /** 传入的元素对象 */
  #element: HTMLElement

  /** 用户配置选项 */
  #options: Required<DatasetParserOptions>

  /** 排除的属性名称集合（驼峰格式） */
  #excludeSet: Set<string>

  constructor(element: HTMLElement, options: DatasetParserOptions = {}) {
    this.#element = element

    // 合并默认选项和用户选项
    this.#options = {
      ...DEFAULT,
      ...options,
    }

    // 将排除的属性名称转换为驼峰格式并存储为 Set
    this.#excludeSet = new Set(
      this.#options.excludeKeys.map((key) => this.#toCamelCase(key)),
    )
  }

  parse(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    const prefixLength = this.#options.prefix.length

    for (const key in this.#element.dataset) {
      const value = this.#element.dataset[key]
      if (value === undefined) continue

      if (this.#options.prefix) {
        // 如果设置了前缀且属性名称不匹配，则跳过
        if (!key.startsWith(this.#options.prefix)) continue

        // 去除前缀后的属性名称,并转换为小驼峰格式
        const realKey = this.#pascalToCamel(key.slice(prefixLength))

        // 取基础名称（用于排除检查）
        const baseKey = realKey.split(".")[0]

        if (this.#excludeSet.has(baseKey)) continue

        // 深度设置属性值
        this.#setDeepProperty(data, realKey, this.#parseValue(value))
      } else {
        // 没有前缀
        const camelKey = this.#toCamelCase(key)
        const baseKey = camelKey.split(".")[0]

        if (this.#excludeSet.has(baseKey)) continue

        this.#setDeepProperty(data, camelKey, this.#parseValue(value))
      }
    }

    return data
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
        // 使用类型断言
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

  /**
   * 将连字符格式转换为驼峰格式
   * @param str - 要转换的字符串
   * @returns 转换后的驼峰格式字符串
   */
  #toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase())
  }

  /**
   * 将 PascalCase 转换为 camelCase
   * @param str - 要转换的 PascalCase 字符串
   * @returns 转换后的 camelCase 字符串
   */
  #pascalToCamel(str: string): string {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
}
