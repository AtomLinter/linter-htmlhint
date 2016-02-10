'use babel';

import * as path from 'path';
import { execNode, find, rangeFromLineNumber } from 'atom-linter';

const GRAMMAR_SCOPES = [
  'text.html.angular',
  'text.html.basic',
  'text.html.erb',
  'text.html.gohtml',
  'text.html.jsp',
  'text.html.mustache',
  'text.html.handlebars',
  'text.html.ruby'
];

export const config = {
  executablePath: {
    title: 'Executable Path',
    description: 'HTMLHint Node Script Path',
    type: 'string',
    default: path.join(__dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint')
  }
};

let executablePath = '';

export function activate() {
  require('atom-package-deps').install('linter-htmlhint');

  executablePath = atom.config.get('linter-htmlhint.executablePath');

  atom.config.observe('linter-htmlhint.executablePath', newValue => {
    executablePath = newValue;
  });
}

export function provideLinter() {
  return {
    name: 'htmlhint',
    grammarScopes: GRAMMAR_SCOPES,
    scope: 'file',
    lintOnFly: false,
    lint: editor => {
      const text = editor.getText();
      const filePath = editor.getPath();

      if (!text) {
        return Promise.resolve([]);
      }

      const parameters = [filePath, '--format', 'json'];
      const htmlhintrc = find(path.dirname(filePath), '.htmlhintrc');

      if (htmlhintrc) {
        parameters.push('-c');
        parameters.push(htmlhintrc);
      }

      return execNode(executablePath, parameters, {}).then(output => {
        const results = JSON.parse(output);

        if (!results.length) {
          return [];
        }

        const messages = results[0].messages;

        return messages.map(message => ({
          range: rangeFromLineNumber(editor, message.line - 1, message.col - 1),
          type: message.type,
          text: message.message,
          filePath
        }));
      });
    }
  };
}
