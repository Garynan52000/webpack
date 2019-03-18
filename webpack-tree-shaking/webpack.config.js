const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  /* 开发模式 */
  mode: 'development',
  /* 备注为使用的 export */
  optimization: {
    usedExports: true
  },
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist/**'],
    }),
    new HtmlWebpackPlugin({
      title: 'webpack-tree-shaking',
      template: './index.html'
    }),
  ]
};