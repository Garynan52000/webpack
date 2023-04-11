# [Writing a Loader](https://v4.webpack.js.org/contribute/writing-a-loader/)

loader 是导出函数的 node module。当此 loader 程序应转换资源时，将调用此函数。给定的函数将使用提供给它的 `this` 上下文访问 [Loader API](https://v4.webpack.js.org/api/loaders/)。

## [Setup](https://v4.webpack.js.org/contribute/writing-a-loader/#setup)

在我们深入研究不同类型的 loader 之前，包括它们的用法和示例，让我们看一下可以在本地开发和测试 loader 的三种方法。

<br>

要测试单个 loader，您可以简单地使用 `path.resolve` 来规定本地文件中配置对象：

<br>

```
# webpack.config.js
module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve('path/to/loader.js'),
            options: {/* ... */}
          }
        ]
      }
    ]
  }
};
```

<br>

对于多个 loader，你可以利用 `resolveLoader.modules` 配置来更新 webpack 搜索 loader 的位置

<br>

```
# webpack.config.js
module.exports = {
  //...
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders')
    ]
  }
};
```

<br>

最后但同样重要的是，如果您已经为您的 loader 创建了一个单独的包，您可以将它 [`npm link`](https://docs.npmjs.com/cli/v9/commands/npm-link) 到您想要测试它的项目。

## [Simple Usage](https://v4.webpack.js.org/contribute/writing-a-loader/#simple-usage)

当单个 loader 应用于资源时，loader 仅使用一个参数调用 -- 一个包含资源文件内容的字符串。

<br>

同步的 loader 可以简单地返回表示转换模块的单个值。在更复杂的情况下，loader 可以使用 `this.callback(err, values...)` 函数返回任意数量的值。错误要么传递给 `this.callback` 函数，要么在同步 loader 中抛出。

<br>

> loader 预期返回一个或两个值。第一个值是 `string` 或 `buffer`。第二个可选值是作为 JavaScript 对象的 SourceMap。

## [Complex Usage](https://v4.webpack.js.org/contribute/writing-a-loader/#complex-usage)

当多个 loader 链式调用时，重要的是要记住它们是以倒序执行的，如从右到左，或从下到上执行。

<br>

- 最先调用最后一个 loader 将传递原始资源的内容。
- 第一个 loader，最后调用，预期会返回 JavaScript 值（string or buffer） 和一个可选的源映射对象。
- 中间的 loader 将使用链中前一个 loader 的结果执行。

## [Guidelines 准则](https://v4.webpack.js.org/contribute/writing-a-loader/#guidelines)

编写 loader 时应遵循以下准则。它们按重要性排序，有些仅适用于特定场景，请阅读后面的详细部分以获取更多信息。

#### [Keep them simple 保持简单](https://v4.webpack.js.org/contribute/writing-a-loader/#simple)

loader 应该只做一个任务。这不仅使维护每个 loader 的工作更容易，而且还允许链起来调用以在更多场景中使用。

#### [Utilize chaining 利用链式](https://v4.webpack.js.org/contribute/writing-a-loader/#chaining)

利用 loader 可以链接在一起的事实。与其编写一个处理多个任务的 loader，不如编写多个更简​​单的 loader 来分担这项工作。隔离它们不仅可以使每个单独的 loader 保持简单，而且可以让它们用于您最初没有想到的事情。

<br>

以使用带查询参数或配置对象的 loader 处理渲染模板为例。它可以写成一个从源代码编译模板的 loader，执行它并返回一个模块，该模块导出包含 HTML 代码的字符串。然而，根据指南，存在一个简单的 `apply-loader`，可以与其他开源加载器链接：

<br>

- `jade-loader`: 将模板转换为导出函数的模块。
- `apply-loader`: 使用 loader 选项执行函数并返回原始 HTML。
- `html-loader`: 接受 HTML 并输出有效的 JavaScript 模块。

#### [Emit modular output 模块化输出](https://v4.webpack.js.org/contribute/writing-a-loader/#modular)

保持输出模块化。loader 生成的模块应该遵循与普通模块相同的设计原则。

#### [Make sure they're stateless 保证无状态](https://v4.webpack.js.org/contribute/writing-a-loader/#stateless)

确保 loader 不保留模块转换之间的状态。每次运行都应始终独立于其他已编译模块以及同一模块的先前编译。

#### [Employ loader utilities 使用 loader 公共包](https://v4.webpack.js.org/contribute/writing-a-loader/#loader-utilities)

利用 [`loader-utils`](https://github.com/webpack/loader-utils) 包。它提供了多种有用的工具，但最常用的工具之一是检索传递给加载程序的选项。与 `loader-utils` 一起，[`schema-utils`](https://github.com/webpack-contrib/schema-utils) 包应该用于一致的基于 JSON Schema 的加载程序选项验证。这是一个同时使用两者的简短示例：

<br>

```
import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

const schema = {
  type: 'object',
  properties: {
    test: {
      type: 'string'
    }
  }
};

export default function(source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Example Loader');

  // Apply some transformations to the source...

  return `export default ${ JSON.stringify(source) }`;
}
```
