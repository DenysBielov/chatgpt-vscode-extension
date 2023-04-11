//@ts-check

"use strict";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const extensionConfig = {
  target: "node", // VS Code extensions run in a Node.js-context 📖 -> https://webpack.js.org/configuration/node/
  mode: "none", // this leaves the source code as close as possible to the original (when packaging we set this to 'production')

  entry: "./src/extension.ts", // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
  output: {
    // the bundle is stored in the 'dist' folder (check package.json), 📖 -> https://webpack.js.org/configuration/output/
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
  },
  externals: {
    vscode: "commonjs vscode", // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
    // modules added here also need to be added in the .vscodeignore file
  },
  resolve: {
    // support reading TypeScript and JavaScript files, 📖 -> https://github.com/TypeStrong/ts-loader
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
  devtool: "nosources-source-map",
  infrastructureLogging: {
    level: "log", // enables logging required for problem matchers
  },
};

const getAppsConfig = () => {
  const basePath = path.join(__dirname, "src", "apps");

  /** @type WebpackConfig */
  return {
    context: basePath,
    mode: "development",
    entry: {
      chat: "./chat/chat.tsx",
      conversations: "./conversations/conversations.tsx",
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "media", "build"),
    },
    plugins: [new MiniCssExtractPlugin()],
    devtool: "source-map",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            process.env.NODE_ENV !== "production"
              ? "style-loader"
              : MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  };
};

module.exports = [extensionConfig, getAppsConfig()];
