'use babel';

import { CompositeDisposable } from 'atom';

const grammarScopes = [];

export function activate() {
  require('atom-package-deps').install('linter-htmlhint');

  const subscriptions = new CompositeDisposable();
  subscriptions.add(atom.config.observe('linter-htmlhint.enabledScopes', scopes => {
    // Remove any old scopes
    grammarScopes.splice(0, grammarScopes.length);
    // Add the current scopes
    Array.prototype.push.apply(grammarScopes, scopes);
  }));
}

function getConfig(filePath) {
  const fs = require('fs');
  const path = require('path');
  const readFile = require('tiny-promisify')(fs.readFile);
  const { findAsync } = require('atom-linter');

  return findAsync(path.dirname(filePath), '.htmlhintrc')
    .then(configPath => {
      if (configPath) {
        return readFile(configPath, 'utf8');
      }
      return null;
    })
    .then(conf => {
      if (conf) {
        return JSON.parse(require('strip-json-comments')(conf));
      }
      return null;
    });
}

export function provideLinter() {
  return {
    name: 'htmlhint',
    grammarScopes,
    scope: 'file',
    lintOnFly: true,
    lint: editor => {
      const { HTMLHint } = require('htmlhint');

      const text = editor.getText();
      const filePath = editor.getPath();

      if (!text) {
        return Promise.resolve([]);
      }

      return getConfig(filePath)
        .then(ruleset => HTMLHint.verify(text, ruleset || undefined))
        .then(messages => {
          const { rangeFromLineNumber } = require('atom-linter');

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
