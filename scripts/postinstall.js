/**
 * NOTE: fix bug #9880: https://github.com/facebook/create-react-app/issues/9880
 * Environment:
 * webpack: "5.40.0"
 * react-dev-utils: "11.0.4"
 */
const replace = require('replace-in-file');

const fixFormatWebpackMessages = async () => {
  try {
    await replace({
      files: 'node_modules/react-dev-utils/formatWebpackMessages.js',
      from: "let lines = message.split('\\n');",
      to: `let lines = [];

  if (typeof message === 'string') {
    lines = message.split('\\n');
  } else if (message && message['message']) {
    lines = message['message'].split('\\n');
  }`,
    });
  } catch (e) {
    console.log('error while trying to fix  "formatWebpackMessages.js"', e);
  }
};

fixFormatWebpackMessages();
