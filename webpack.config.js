const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  entry: "./src/index.js",
  performance: { hints: false },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
  output: {
    publicPath: "http://localhost:3000/",
    clean: true,
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      remotes: {
        mfeAuth: "mfeAuth@http://localhost:4201/remoteEntry.js",
        mfeSupport: "mfeSupport@http://localhost:4202/remoteEntry.js",
        mfeCatalog: "mfeCatalog@http://localhost:4203/remoteEntry.js",
        mfeOrders: "mfeOrders@http://localhost:4205/remoteEntry.js",
        mfeWishlist: "mfeWishlist@http://localhost:4206/remoteEntry.js",
        mfeAdmin: "mfeAdmin@http://localhost:4207/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
        "react-router-dom": { singleton: true, requiredVersion: false },
        "react-redux": { singleton: true, requiredVersion: false },
        "@reduxjs/toolkit": { singleton: true, requiredVersion: false },
        "react-helmet-async": { singleton: true, requiredVersion: false },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
