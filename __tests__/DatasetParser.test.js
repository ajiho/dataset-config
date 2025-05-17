import DatasetParser from "../src/DatasetParser"

describe("DatasetParser", () => {
  let element, element2

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

    `

    window.init = () => "全局函数"
    element = document.querySelector("[data-toggle]")
    element2 = document.querySelector("#element2")
  })

  afterEach(() => {
    delete window.init
  })

  test("默认选项测试", () => {
    const parser = new DatasetParser(element)
    const data = parser.parse()

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

  test("测试带前缀的解析", () => {
    const parser = new DatasetParser(element, { prefix: "app" })
    const data = parser.parse()

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

  test("携带前缀且排除某个key", () => {
    const parser = new DatasetParser(element, {
      prefix: "app",
      excludeKeys: ["position"],
    })
    const data = parser.parse()

    expect(data).toEqual({
      maxItems: 5,
      otherSomething: "should-ignore",
    })
  })

  test("不带前缀且排除某个key", () => {
    const parser = new DatasetParser(element2, {
      excludeKeys: ["age"],
    })
    const data = parser.parse()

    expect(data).toEqual({
      direction: "horizontal",
      agree: true,
    })
  })

  test("排除某个带有连字符-的key", () => {
    const parser = new DatasetParser(element2, {
      excludeKeys: ["foo-bar"],
    })
    const data = parser.parse()

    expect(data).toEqual({
      direction: "horizontal",
      age: 100,
      agree: true,
    })
  })

  test("测试无效的JSON字符串", () => {
    element.setAttribute("data-invalid", "{ key: value }") // invalid JSON
    const parser = new DatasetParser(element)
    const data = parser.parse()

    expect(data.invalid).toBe("{ key: value }")
  })
})
