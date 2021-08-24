const fs = require('fs');
const process = require('process');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const clearConsole = require('react-dev-utils/clearConsole');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const { checkBrowsers } = require('react-dev-utils/browsersHelper');
const { choosePort, createCompiler, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils');
const openBrowser = require('react-dev-utils/openBrowser');
const { paths, appName } = require('../config/utils');
const { compilerConfig, devServerConfig } = require('../config/webpack.config.serve');

const useYarn = fs.existsSync(paths.yarnLockFile);
const useTypeScript = fs.existsSync(paths.appTsConfig);
const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const host = '0.0.0.0';
const DEFAULT_PORT = 3000;

checkBrowsers(paths.root, isInteractive)
  // We attempt to use the default port but if it is busy, we offer the user to
  // run on a different port. `choosePort()` Promise resolves to the next free port.
  .then(() => choosePort(host, DEFAULT_PORT))
  .then((port) => {
    if (port == null) {
      // We have not found a port.
      return;
    }

    const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true';
    const urls = prepareUrls('http', host, port);
    let devServer;
    const devSocket = {
      warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config: compilerConfig,
      devSocket,
      urls,
      useYarn,
      useTypeScript,
      tscCompileOnError,
      webpack,
    });
    // Launch WebpackDevServer.
    devServer = new WebpackDevServer(compiler, { ...devServerConfig, host, port });
    devServer.listen(port, host, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      if (isInteractive) {
        clearConsole();
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => {
        devServer.close();
        process.exit();
      });
    });

    if (isInteractive || process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', () => {
        devServer.close();
        process.exit();
      });
      process.stdin.resume();
    }
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
