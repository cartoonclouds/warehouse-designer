/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { DefinePlugin } = require("webpack");

const cssLoader = "css-loader";
const lessLoader = "less-loader";

const postcssLoader = {
  loader: "postcss-loader",
  options: {
    postcssOptions: {
      plugins: ["autoprefixer"],
    },
  },
};

// https://webpack.js.org/plugins/provide-plugin/
//
// https://medium.com/@bhautikbharadava/environment-variables-webpack-config-using-defineplugin-1a7f38e2236e
// https://dev.to/vyasriday/using-defineplugin-to-define-api-urls-in-webpack-5f1e

module.exports = function (env, { analyze }) {
  const production = env.production || process.env.NODE_ENV === "production";
  return {
    target: "web",
    mode: production ? "production" : "development",
    devtool: production ? undefined : "inline-source-map",
    entry: {
      entry: "./src/main.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: production
        ? "[name].[contenthash].bundle.js"
        : "[name].bundle.js",
    },
    resolve: {
      extensions: [".ts", ".js"],
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    devServer: {
      historyApiFallback: true,
      open: !process.env.CI,
      port: 9000,
    },
    module: {
      rules: [
        { test: /\.(png|svg|jpg|jpeg|gif)$/i, use: "file-loader" },
        {
          test: /\.(woff|woff2|ttf|eot|svg|otf)(\?.*$|$)?$/i,
          use: "file-loader",
        },
        {
          test: /\.s?css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            // "style-loader", // Creates `style` nodes from JS strings
            cssLoader, // Translates CSS into CommonJS
            postcssLoader,
            "sass-loader", // Compiles Sass to CSS
          ],
        },
        {
          test: /\.ts$/i,
          use: ["ts-loader", "@aurelia/webpack-loader"],
          exclude: /node_modules/,
        },
        {
          test: /[/\\]src[/\\].+\.html$/i,
          use: "@aurelia/webpack-loader",
          exclude: /node_modules/,
        },
      ],
    },
    plugins: [
      new DefinePlugin({
        __DEV__: true,
      }),
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: "index.html",
        metadata: { dev: !production },
      }),
      new Dotenv({
        path: `./.env${
          production ? "" : "." + (process.env.NODE_ENV || "development")
        }`,
      }),
      analyze && new BundleAnalyzerPlugin(),
    ].filter((p) => p),
  };
};
