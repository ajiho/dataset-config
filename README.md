# dataset-config

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://www.lujiahao.com/sponsor)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![npm version](https://img.shields.io/npm/v/dataset-config)](https://www.npmjs.com/package/dataset-config)
[![cdn version](https://data.jsdelivr.com/v1/package/npm/dataset-config/badge)](https://www.jsdelivr.com/package/npm/dataset-config)
[![codecov](https://codecov.io/gh/ajiho/dataset-config/graph/badge.svg?token=G2P1AI238H)](https://codecov.io/gh/ajiho/dataset-config)
[![Test](https://img.shields.io/github/actions/workflow/status/ajiho/dataset-config/test.yml?label=Test&logo=github&style=flat-square&branch=main)](https://github.com/ajiho/dataset-config/actions/workflows/test.yml)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-fcc72b.svg?logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/ajiho/dataset-config/blob/main/LICENSE)
[![size limit](https://img.shields.io/badge/size%20limit-520B-brightgreen.svg)](https://github.com/ajiho/dataset-config/blob/main/configs/size-limit.mjs)

---

遵循 [`dataset`规范](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 从dom上提取属性并提供了一些有用的额外功能,灵感来源于[lilconfig](https://github.com/antonk52/lilconfig)、[cosmiconfig](https://github.com/cosmiconfig/cosmiconfig)

> [!NOTE]
> 如果您在开发js插件时,想支持通过`data-*`属性的方式初始化时传递参数,那么这个库对您来说尤其有用,如果您是一个喜欢用原生js开发插件的狂热爱好者,那么把这部分逻辑抽离出来,会让您的库变得更加优雅和简洁。

## 特性

- 零依赖
- 体积极小
- 支持 true/false/number/JSON 自动解析
- 支持前缀过滤
- 支持无限层点语法对象解析
- 支持全局函数解析
- 支持排除字段
- 支持 AMD/CommonJS

## 安装

- [npm](https://www.npmjs.com/package/dataset-config): `npm install dataset-config --save`
- CDN
  ```html
  <script src="https://unpkg.com/dataset-config@latest/dist/dataset-config.browser.min.js"></script>
  <!-- or -->
  <script src="https://cdn.jsdelivr.net/npm/dataset-config@latest/dist/dataset-config.browser.min.js"></script>
  ```

## 用法

想象页面上有以下html结构：

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dataset-config Demo</title>
  </head>
  <body>
    <div
      id="demo"
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
      data-config.foo.enable="true"
      data-on-init="init"
    ></div>

    <script>
      function init() {
        console.log("this is global")
      }
    </script>
  </body>
</html>
```

然后我们使用`dataset-config`解析数据

```js
import datasetConfig from "dataset-config"

const options = datasetConfig(document.querySelector("#demo"), {})
```

解析得到的`options`结果如下：

```js
const options = {
  toggle: "plugin",
  touchDelay: 300,
  style: { zIndex: 10000 },
  position: { x: 100, y: 200 },
  draggable: true,
  direction: "horizontal",
  appMaxItems: 5,
  appOtherSomething: "should-ignore",
  options: { a: 1, b: [2, 3] },
  rect: [2, 3],
  config: { foo: { bar: "hello", enable: true } },
  onInit: function init() {
    console.log("this is global")
  },
}
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
