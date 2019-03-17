/* node */
const path = require('path');
const express = require('express');
const webpack = require('webpack');

/* middleware 中间件 */
const webpackDevMiddleware = require('webpack-dev-middleware');

/* webpack plugins */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/* configs */
const app = express();
const port = 3000;
const config = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    /* 确保在http：// localhost：3000上正确提供文件。 */
    publicPath: '/'
  },
  /* 将编译后的代码映射回原始源代码 */
  devtool: 'inline-source-map', 
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist/**'],
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack Dev Management',
      template: './index.html'
    })
  ]
}
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(port, function () {
  console.log(`Example app listening on port ${port}!\n`);
});