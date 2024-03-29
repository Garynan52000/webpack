const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const PORT = 3000;
const PUBLIC_PATH = '/';

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.js',
    print: './src/print.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: PUBLIC_PATH
  },
  /* 将编译后的代码映射回原始源代码 */
  devtool: 'inline-source-map', 
  /* webpack-dev-server 启动目录  */
  devServer: {
    port: PORT,
    contentBase: './dist',
    publicPath: PUBLIC_PATH
  },
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
};
