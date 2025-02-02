const { rspack } = require("@rspack/core");
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";
const path = require("path");
const {
  ModuleFederationPlugin,
} = require("@module-federation/enhanced/rspack");

/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
  context: __dirname,
  entry: {
    main: "./src/index.ts",
  },
  output: {
    publicPath: "/",
  },

  devServer: {
    port: 8080,
    historyApiFallback: true,
    watchFiles: [path.resolve(__dirname, "src")],
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },

  experiments: {
    css: true,
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /[\\/]node_modules[\\/]/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              sourceMap: true,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: {
                targets: [
                  "chrome >= 87",
                  "edge >= 88",
                  "firefox >= 78",
                  "safari >= 14",
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "hello",
      filename: "remoteEntry.js",
      exposes: {
        "./Foo": "./src/Foo",
      },
      shared: {
        react: { eager: true },
        "react-dom": { eager: true },
        "react-router-dom": { eager: true },
      },
    }),
    new rspack.HtmlRspackPlugin({
      template: "./src/index.html",
    }),
    isDev ? new refreshPlugin() : null,
  ],
};
