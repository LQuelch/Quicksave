const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");

const pages = ["index", "settings"];

module.exports = {
  entry: pages.reduce((config, page) => {
    config[page] = `./src/renderer/${page}.js`;
    return config;
  }, {}),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ].concat(
    pages.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./src/renderer/${page}.html`,
          filename: `${page}.html`,
          chunks: [page],
        })
    )
  ),
  module: {
    rules:
      [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
  }
}