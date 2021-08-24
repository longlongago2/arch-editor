/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const escape = require('escape-string-regexp');

const root = fs.realpathSync(process.cwd());

const pkgJson = require(path.resolve(root, 'package.json'));

const miniCssExtraLoader = MiniCssExtractPlugin.loader;

const { name, version, author, dependencies, peerDependencies } = pkgJson;

const getCssLoaders = (useModules = false, importLoaders = 1, usePostcss = true, cssExtra = true) => {
  const rules = [
    !cssExtra && { loader: 'style-loader' },
    cssExtra && { loader: miniCssExtraLoader },
    {
      loader: 'css-loader',
      options: {
        importLoaders,
        modules: useModules && {
          // lib打包css不能使用hash，否则导致外部引用的时候不能不能还原hash，导致使用者不能使用less
          localIdentName: cssExtra ? 'ArchEditor-[local]' : '[name]--[local]--[hash:base64:8]',
          exportLocalsConvention: 'camelCase', // 连字符自动转驼峰，方便在js中对象引用
        },
      },
    },
    usePostcss && {
      loader: 'postcss-loader',
      options: { postcssOptions: { plugins: [['postcss-preset-env', { stage: 0 }]] } },
    },
  ].filter(Boolean);
  return rules;
};

const getComplieBanner = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const h = date.getHours();
  const checkTime = (v) => {
    if (v < 10) return `0${v}`;
    return v;
  };
  const m = checkTime(date.getMinutes());
  const s = checkTime(date.getSeconds());
  const timestap = `${year}/${month}/${day} ${h}:${m}:${s}`;
  return `ArchEditor v${version}\nAuthor: ${author}\nBuild Time: ${timestap}`;
};

const getFolderSrcFiles = () => {
  const src = path.resolve(root, 'src');
  if (!fs.existsSync(src)) return null;
  const fileMap = {};
  function readdirDeepSync(_path) {
    fs.readdirSync(_path).forEach((filename) => {
      const fPath = path.join(_path, filename);
      const stat = fs.statSync(fPath);
      if (stat.isDirectory()) {
        readdirDeepSync(fPath);
      } else {
        const ext = path.extname(fPath);
        if (ext === '.js') {
          const basename = path.basename(fPath, '.js');
          fileMap[basename] = fPath;
        }
      }
    });
  }
  readdirDeepSync(src);
  return fileMap;
};

const translatePathSep = (_path) => _path.split(path.sep).join('/');

const ignoredFiles = (appSrc) => new RegExp(`^(?!${escape(path.normalize(`${appSrc}/`).replace(/[\\]+/g, '/'))}).+/node_modules/`, 'g');

// externals
const externals = {};
const allDependencies = { ...dependencies, ...peerDependencies };
const dependencyKeys = Object.keys(allDependencies);
dependencyKeys.forEach((key) => {
  externals[key] = `commonjs2 ${key}`;
});
const sourceFileMap = getFolderSrcFiles();
if (sourceFileMap) {
  const src = path.resolve(root, 'src');
  const fileNames = Object.keys(sourceFileMap);
  fileNames.forEach((filename) => {
    const filePath = translatePathSep(sourceFileMap[filename]);
    const srcPath = translatePathSep(src);
    const srcAliasPath = filePath.replace(srcPath, '@');
    const key = srcAliasPath.replace(/\.js$/g, '');
    const value = `commonjs2 ./${filename}`;
    externals[key] = value;
  });
}

module.exports = {
  appName: name,
  getCssLoaders,
  getComplieBanner,
  getFolderSrcFiles,
  ignoredFiles,
  externals,
  paths: {
    root,
    libBuild: path.resolve(root, 'lib'),
    libAsset: path.resolve(root, 'lib/assets'),
    distBuild: path.resolve(root, 'dist'),
    serve: path.resolve(root, 'serve'),
    public: path.resolve(root, 'public'),
    src: path.resolve(root, 'src'),
    appHtml: path.resolve(root, 'public/index.html'),
    appIndexJs: path.resolve(root, 'index.js'),
    yarnLockFile: path.resolve(root, 'yarn.lock'),
    appTsConfig: path.resolve(root, 'tsconfig.json'),
  },
  modules: [path.resolve(root, 'src'), 'node_modules'],
  alias: {
    '@': path.resolve(root, 'src'),
    theme: path.resolve(root, 'src/variables.less'),
  },
};
