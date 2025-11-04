import { describe, it, expect, beforeEach, afterEach } from "vitest"
import datasetConfig from "../index.js"

declare global {
  interface Window {
    init?: () => string
  }
}

describe("datasetConfig", () => {
  let element: HTMLElement
  let element2: HTMLElement
  let element3: HTMLElement

  beforeEach(() => {
    document.body.innerHTML = `
    <div
      data-toggle="plugin"
      data-touch-delay="300"
      data-app-position.z-index.background-color="300"
      data-position.x="100"
      data-position.y="200"
      data-draggable="true"
      data-agree="false"
      data-direction="horizontal"
      data-app-max-items="5"
      data-app-other-something="should-ignore"
      data-options='{"a":1,"b":[2,3]}'
      data-rect='[2,3]'
      data-config.foo.bar="hello"
      data-on-init="init"
    ></div>

    <div
      id="element2"
      data-direction="horizontal"
      data-age="100"
      data-agree="true"
    ></div>

    <div
      id="element3"
      data-toggle="plugin"
      data-config.foo.bar="hello"
      data-config.foo.enable="true"
      data-config.foo.delay="3000"
      data-config.bar.count="42"
      data-on-init="init"
    ></div>
    `
    window.init = () => "全局函数"
    element = document.querySelector<HTMLElement>("[data-toggle]")!
    element2 = document.querySelector<HTMLElement>("#element2")!
    element3 = document.querySelector<HTMLElement>("#element3")!
  })

  afterEach(() => {
    delete window.init
  })

  it("默认选项测试 ", () => {
    // const parser = new DatasetParser(element)
    const data = datasetConfig(element)

    expect(data).toEqual({
      toggle: "plugin",
      touchDelay: 300,
      appPosition: {
        zIndex: {
          backgroundColor: 300,
        },
      },
      position: {
        x: 100,
        y: 200,
      },
      rect: [2, 3],
      agree: false,
      draggable: true,
      onInit: window.init,
      direction: "horizontal",
      appMaxItems: 5,
      appOtherSomething: "should-ignore",
      options: {
        a: 1,
        b: [2, 3],
      },
      config: {
        foo: {
          bar: "hello",
        },
      },
    })
  })

  it("测试带前缀的解析", () => {
    const data = datasetConfig(element, { prefix: "app" })

    expect(data).toEqual({
      position: {
        zIndex: {
          backgroundColor: 300,
        },
      },
      maxItems: 5,
      otherSomething: "should-ignore",
    })
  })

  it("携带前缀且排除某个key", () => {
    const data = datasetConfig(element, {
      prefix: "app",
      excludeKeys: ["position"],
    })
    expect(data).toEqual({
      maxItems: 5,
      otherSomething: "should-ignore",
    })
  })

  it("不带前缀且排除某个key", () => {
    const data = datasetConfig(element2, {
      excludeKeys: ["age"],
    })

    expect(data).toEqual({
      direction: "horizontal",
      agree: true,
    })
  })

  it("排除某个带有连字符-的key", () => {
    const data = datasetConfig(element2, {
      excludeKeys: ["foo-bar"],
    })

    expect(data).toEqual({
      direction: "horizontal",
      age: 100,
      agree: true,
    })
  })

  it("测试无效的JSON字符串", () => {
    element.setAttribute("data-invalid", "{ key: value }") // invalid JSON

    const data = datasetConfig(element)

    expect(data.invalid).toBe("{ key: value }")
  })

  it("excludeKeys深度排除:单个键", () => {
    const data = datasetConfig(element3, {
      excludeKeys: ["config.foo.delay"],
    })

    expect(data).toEqual({
      toggle: "plugin",
      config: { foo: { bar: "hello", enable: true }, bar: { count: 42 } },
      onInit: expect.any(Function),
    })
    expect(data.onInit).toBe(window.init)
  })

  it("excludeKeys深度排除:排除整个对象", () => {
    const data = datasetConfig(element3, {
      excludeKeys: ["config.foo"],
    })

    expect(data).toEqual({
      toggle: "plugin",
      config: { bar: { count: 42 } },
      onInit: expect.any(Function),
    })

    expect(data.onInit).toBe(window.init)
  })
})
