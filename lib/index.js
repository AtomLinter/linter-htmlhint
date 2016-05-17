'use babel';

import * as fs from 'fs';
import * as path from 'path';
import { findAsync, rangeFromLineNumber } from 'atom-linter';
import stripJsonComments from 'strip-json-comments';
import { HTMLHint } from 'htmlhint';
import promisify from 'tiny-promisify';

const readFile = promisify(fs.readFile);
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

export const config = {};

export function activate() {
  require('atom-package-deps').install('linter-htmlhint');
}

function getConfig(filePath) {
  return findAsync(path.dirname(filePath), '.htmlhintrc')
    .then(configPath => {
      if (configPath) {
        return readFile(configPath, 'utf8');
      }
      return null;
    })
    .then(conf => {
      if (conf) {
        return JSON.parse(stripJsonComments(conf));
      }
      return null;
    });
}

export function provideLinter() {
  return {
    name: 'htmlhint',
    grammarScopes: GRAMMAR_SCOPES,
    scope: 'file',
    lintOnFly: true,
    lint: editor => {
      const text = editor.getText();
      const filePath = editor.getPath();

      if (!text) {
        return Promise.resolve([]);
      }

      return getConfig(filePath)
        .then(ruleset => HTMLHint.verify(text, ruleset || undefined))
        .then(messages => messages.map(message => ({
          range: rangeFromLineNumber(editor, message.line - 1, message.col - 1),
          type: message.type,
          text: message.message,
          filePath
        })));
    }
  };
}
