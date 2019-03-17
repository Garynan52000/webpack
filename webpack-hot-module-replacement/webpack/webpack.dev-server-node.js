const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const port = 3000;
const config = require('./webpack.dev-server.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

/* 显示声明入口文件 */
webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
/* 显示配置 devServer 选项 */
const server = new webpackDevServer(compiler, options);

server.listen(port, 'localhost', () => {
  console.log(`dev server listening on port ${port}`);
});