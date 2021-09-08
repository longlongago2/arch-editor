/* eslint-disable no-restricted-syntax */
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {
  getCssLoaders,
  getComplieBanner,
  getFolderSrcFiles,
  paths,
  externals,
  modules,
  alias,
} = require('./utils');

const webpackConfigBuildDist = {
  mode: 'production',
  entry: { 'arch-editor': '/src/index.js' },
  output: {
    path: paths.distBuild,
    filename: '[name].js',
    clean: true,
    library: {
      name: 'ArchEditor',
      type: 'umd',
    },
    assetModuleFilename: 'assets/[name][ext]',
  },
  optimization: {
    minimizer: [
      '...', // 在 webpack@5 中，使用 '...' 来访问默认值
      new CssMinimizerPlugin(),
    ],
  },
  externals: {
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new webpack.ProgressPlugin(),
    new webpack.BannerPlugin({
      entryOnly: true,
      banner: getComplieBanner,
    }),

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
        use: getCssLoaders(),
      },
      {
        test: /\.less$/i,
        use: [
          ...getCssLoaders(true, 2),
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
          options: { presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react'] },
        },
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    modules,
    alias,
  },
};

const entryPoints = {};
const srcFileMap = getFolderSrcFiles();
// exclude static files
const excludeCharacter = `${path.sep}static${path.sep}`;
for (const [key, value] of Object.entries(srcFileMap)) {
  if (value.indexOf(excludeCharacter) < 0) {
    entryPoints[key] = value;
  }
}

const webpackConfigBuildLib = {
  mode: 'production',
  entry: { ...entryPoints },
  output: {
    path: paths.libBuild,
    clean: true,
    library: { type: 'commonjs2' },
    assetModuleFilename: 'assets/[name][ext]',
  },
  externals: {
    ...externals,
    'classnames/bind': 'commonjs2 classnames/bind',
    '@/static/default-image.png': 'commonjs2 ./assets/default-image.png', // assetModuleFilename
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'styles/[name].css' }),
    // Copy src/static files
    new CopyPlugin({
      patterns: [
        {
          context: path.resolve(paths.src, 'static'),
          from: '*.js',
          to: paths.libBuild,
          toType: 'dir',
        },
        {
          context: path.resolve(paths.src, 'static'),
          from: '*.png',
          to: paths.libAsset,
          toType: 'dir',
        },
      ],
    }),
    new webpack.ProgressPlugin(),
    new webpack.BannerPlugin({ banner: getComplieBanner }),

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
        use: getCssLoaders(),
      },
      {
        test: /\.less$/i,
        use: [
          ...getCssLoaders(true, 2),
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
          options: { presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react'] },
        },
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    modules,
    alias,
  },
  devtool: false,
};

module.exports = {
  webpackConfigBuildDist,
  webpackConfigBuildLib,
};
