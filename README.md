# dataset-config

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![npm](https://img.shields.io/npm/v/dataset-config)](https://www.npmjs.com/package/dataset-config)
[![cdn version](https://data.jsdelivr.com/v1/package/npm/dataset-config/badge)](https://www.jsdelivr.com/package/npm/dataset-config)
[![codecov](https://codecov.io/gh/ajiho/dataset-config/graph/badge.svg?token=G2P1AI238H)](https://codecov.io/gh/ajiho/dataset-config)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/dataset-config/test.yml?label=Unit%20Test&branch=main)](https://github.com/ajiho/dataset-config/actions/workflows/test.yml)

---

遵循 [`dataset`规范](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 从dom上提取属性并提供了一些有用的额外功能

> [!NOTE]
> 如果您在开发js插件时,想支持通过`data-*`属性的方式初始化和传递参数,那么这个库对您来说尤其有用

## 特性

- 支持 true/false/number/JSON 解析
- 支持前缀过滤
- 支持无限层点语法对象解析
- 支持全局函数解析
- 支持排除字段

## 安装

- [npm](https://www.npmjs.com/package/dataset-config): `npm install dataset-config --save`
- CDN
  ```html
  <script src="https://unpkg.com/dataset-config@latest/dist/dataset-config.browser.min.js"></script>
  <!-- or -->
  <script src="https://cdn.jsdelivr.net/npm/dataset-config@latest/dist/dataset-config.browser.min.js"></script>
  ```

## 用法

```html
<div
  data-toggle="plugin"
  data-touch-delay="300"
  data-style.z-index="10000"
  data-position.x="100"
  data-position.y="200"
  data-draggable="true"
  data-direction="horizontal"
  data-app-max-items="5"
  data-app-other-something="should-ignore"
  data-options='{"a":1,"b":[2,3]}'
  data-rect="[2,3]"
  data-config.foo.bar="hello"
  data-on-init="init"
></div>

<script>
  function init() {}

  const el = document.querySelector("[data-toggle]")

  let config = datasetConfig(el, options)

  // config最终的结果会被转换为如下形式:
  config = {
    toggle: "plugin",
    touchDelay: 300,
    style: {
      zIndex: 10000,
    },
    position: {
      x: 100,
      y: 200,
    },
    draggable: true,
    onInit: func,
    direction: "horizontal",
    appMaxItems: 5,
    appOtherSomething: "should-ignore",
    options: {
      a: 1,
      b: [2, 3],
    },
    rect: [2, 3],
    config: {
      foo: {
        bar: "hello",
      },
    },
  }
</script>
```

## 选项

### `prefix`

有时候您想避免冲突您可以加一个前缀用以区分

```js
let config = datasetConfig(el, {
  prefix: "app",
})
```

### `parseFunction`

是否需要解析全局函数,默认为`true`

### `excludeKeys`

排除某些key不会被解析,默认值为:`[]`

## 浏览器支持

具体可以查看[.browserslistrc](https://github.com/ajiho/dataset-config/blob/main/.browserslistrc)文件。

## 变更日志

每个版本的详细更改记录在[CHANGELOG.md](https://github.com/ajiho/dataset-config/blob/main/CHANGELOG.md)中.

## License

[MIT](https://github.com/ajiho/dataset-config/blob/master/LICENSE)

Copyright (c) 2025-present, ajiho
