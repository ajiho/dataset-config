// 默认参数
const DEFAULT = {
  // 数据属性名称前缀，用于筛选指定前缀的属性
  prefix: "",
  // 是否将函数名解析为实际的函数引用
  parseFunction: true,
  // 排除的属性名称集合
  excludeKeys: [],
}

// 数据集解析器类
class DatasetParser {
  // 传入的元素对象
  #element
  // 用户配置选项
  #options
  // 排除的属性名称集合（驼峰格式）
  #excludeSet

  /**
   * 构造函数
   * @param {HTMLElement} element - 要解析的元素
   * @param {Object} options - 配置选项
   */
  constructor(element, options = {}) {
    this.#element = element

    // 合并默认选项和用户选项
    this.#options = {
      ...DEFAULT,
      ...options,
    }
    // 将排除的属性名称转换为驼峰格式并存储为 Set
    this.#excludeSet = new Set(this.#options.excludeKeys.map(this.#toCamelCase))
  }

  /**
   * 解析 data-* 属性为对象
   * @returns {Object} 解析后的数据对象
   */
  parse() {
    const data = {}
    const prefixLength = this.#options.prefix.length

    for (const key in this.#element.dataset) {
      if (this.#options.prefix) {
        // 如果设置了前缀且属性名称不匹配，则跳过
        if (!key.startsWith(this.#options.prefix)) continue

        // 去除前缀后的属性名称,并转换为小驼峰格式
        const realKey = this.#pascalToCamel(key.slice(prefixLength))

        // 取基础名称（用于排除检查）
        const baseKey = realKey.split(".")[0]

        if (this.#excludeSet.has(baseKey)) continue

        // 深度设置属性值
        this.#setDeepProperty(
          data,
          realKey,
          this.#parseValue(this.#element.dataset[key]),
        )
      } else {
        // 没有前缀
        const camelKey = this.#toCamelCase(key)
        const baseKey = camelKey.split(".")[0]

        if (this.#excludeSet.has(baseKey)) continue

        this.#setDeepProperty(
          data,
          key,
          this.#parseValue(this.#element.dataset[key]),
        )
      }
    }

    return data
  }

  /**
   * 深度设置对象属性
   * @param {Object} obj - 目标对象
   * @param {string} keyPath - 属性路径（以点分隔）
   * @param {*} value - 要设置的值
   */
  #setDeepProperty(obj, keyPath, value) {
    const keys = this.#toCamelCase(keyPath).split(".")
    let temp = obj

    for (const [index, key] of keys.entries()) {
      if (index === keys.length - 1) {
        temp[key] = value
      } else {
        if (!temp[key] || typeof temp[key] !== "object") {
          temp[key] = {}
        }
        temp = temp[key]
      }
    }
  }

  /**
   * 解析数据值，将字符串转换为实际类型
   * @param {string} val - 要解析的值
   * @returns {*} 解析后的值
   */
  #parseValue(val) {
    if (this.#options.parseFunction && typeof window[val] === "function") {
      return window[val]
    }
    if (val === "true") return true
    if (val === "false") return false
    if (!isNaN(val) && val.trim() !== "") return Number(val)

    if (
      (val.startsWith("{") && val.endsWith("}")) ||
      (val.startsWith("[") && val.endsWith("]"))
    ) {
      try {
        return JSON.parse(val)
      } catch (e) {
        return val
      }
    }

    return val
  }

  /**
   * 将连字符格式转换为驼峰格式
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的驼峰格式字符串
   */
  #toCamelCase(str) {
    return str.replace(/-([a-z])/g, (_, p1) => p1.toUpperCase())
  }

  /**
   * 将 PascalCase 转换为 camelCase
   * @param {string} str - 要转换的 PascalCase 字符串
   * @returns {string} 转换后的 camelCase 字符串
   */
  #pascalToCamel(str) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
}

export default DatasetParser
