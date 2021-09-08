const webpack = require('webpack');
const process = require('process');
const fs = require('fs-extra');
const chalk = require('react-dev-utils/chalk');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const { paths } = require('../config/utils');
const config = require('../config/webpack.config.build');

const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = FileSizeReporter;

const { webpackConfigBuildDist, webpackConfigBuildLib } = config;

const { log } = console;

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function build(webpackConfig, previousFileSizes) {
  const compiler = webpack(webpackConfig);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      let messages;
      if (err) {
        if (!err.message) {
          return reject(err);
        }

        let errMessage = err.message;

        // Add additional information for postcss errors
        if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
          errMessage += `\nCompileError: Begins at CSS selector ${err.postcssNode.selector}`;
        }

        messages = formatWebpackMessages({
          errors: [errMessage],
          warnings: [],
        });
      } else {
        messages = formatWebpackMessages(
          stats.toJson({ all: false, warnings: true, errors: true }),
        );
      }
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        return reject(new Error(messages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' || process.env.CI.toLowerCase() !== 'false') &&
        messages.warnings.length
      ) {
        log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n',
          ),
        );
        return reject(new Error(messages.warnings.join('\n\n')));
      }

      return resolve({
        stats,
        previousFileSizes,
        warnings: messages.warnings,
      });
    });
  });
}

function buildResult({ stats, previousFileSizes, warnings, buildFolder }) {
  if (warnings.length) {
    log(chalk.yellow('Compiled with warnings.\n'));
    log(warnings.join('\n\n'));
    log(
      `\nSearch for the ${chalk.underline(
        chalk.yellow('keywords'),
      )} to learn more about each warning.`,
    );
    log(`To ignore, add ${chalk.cyan('// eslint-disable-next-line')} to the line before.\n`);
  } else {
    log(chalk.green('Compiled successfully.\n'));
  }

  log('File sizes after gzip:\n');
  printFileSizesAfterBuild(
    stats,
    previousFileSizes,
    buildFolder,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE,
  );
}

log(chalk.blue('Creating a webpack build...\n'));

measureFileSizesBeforeBuild(paths.libBuild)
  .then((previousFileSizes) => {
    fs.emptyDirSync(paths.libBuild); // webpack 5 自身 clean 会失效
    log(chalk.green('\n--- Start building library ---\n'));
    return build(webpackConfigBuildLib, previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      buildResult({
        stats,
        previousFileSizes,
        warnings,
        buildFolder: paths.libBuild,
      });
      return Promise.resolve('handled'); // 继续执行下一步
    },
    (err) => {
      log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    },
  )
  // Second: build dist
  .then(() => measureFileSizesBeforeBuild(paths.distBuild))
  .then((previousFileSizes) => {
    fs.emptyDirSync(paths.distBuild);
    log(chalk.green('\n--- Start building dist ---\n'));
    return build(webpackConfigBuildDist, previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      buildResult({
        stats,
        previousFileSizes,
        warnings,
        buildFolder: paths.distBuild,
      });
    },
    (err) => {
      log(chalk.red('Failed to compile.\n'));
      printBuildError(err);
      process.exit(1);
    },
  )
  .catch((err) => {
    if (err && err.message) {
      log(err.message);
    }
    process.exit(1);
  });
