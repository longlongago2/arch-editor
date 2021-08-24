// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { getCssLoaders, ignoredFiles, paths, modules, alias } = require('./utils');

const compilerConfig = {
  mode: 'development',
  target: 'web', // 必须填写web，以解决 browserlist 导致 HMR 失效
  entry: { app: './index.js' },
  output: {
    path: paths.serve,
    filename: '[name].bundle.js',
    assetModuleFilename: 'assets/[name][ext]',
    // clean: true, // When using favicon + output.clean + webpack-dev-server, the second compile loses the favicon https://github.com/jantimon/html-webpack-plugin/issues/1639
  },
  devtool: 'inline-source-map',
  plugins: [
    new ESLintPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(paths.public, 'index.html'),
      favicon: path.resolve(paths.public, 'favicon.ico'),
      title: 'archEditor',
    }),
    new ReactRefreshWebpackPlugin(),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.css$/,
        use: getCssLoaders(false, 1, false, false),
      },
      {
        test: /\.less$/i,
        use: [
          ...getCssLoaders(true, 2, false, false),
          {
            loader: 'less-loader',
            options: { lessOptions: { strictMath: true } },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [require.resolve('react-refresh/babel')],
          },
        },
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    alias,
    modules,
  },
};

module.exports = {
  compilerConfig,
  devServerConfig: {
    publicPath: '/',
    compress: true,
    hot: true,
    quiet: true,
    clientLogLevel: 'none',
    contentBase: paths.serve,
    watchContentBase: true,
    watchOptions: { ignored: ignoredFiles(paths.src) },
  },
};
