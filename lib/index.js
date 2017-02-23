'use babel';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies
import { CompositeDisposable } from 'atom';
import { readFile as fsReadFile } from 'fs';
import { dirname } from 'path';

const lazyReq = require('lazy-req')(require);

const { findAsync, generateRange } = lazyReq('atom-linter')('findAsync', 'generateRange');
const stripJSONComments = lazyReq('strip-json-comments');
const tinyPromisify = lazyReq('tiny-promisify');

const grammarScopes = [];

let subscriptions;

export function activate() {
  require('atom-package-deps').install('linter-htmlhint');

  subscriptions = new CompositeDisposable();
  subscriptions.add(atom.config.observe('linter-htmlhint.enabledScopes', (scopes) => {
    // Remove any old scopes
    grammarScopes.splice(0, grammarScopes.length);
    // Add the current scopes
    Array.prototype.push.apply(grammarScopes, scopes);
  }));
}

export function deactivate() {
  subscriptions.dispose();
}

const getConfig = async (filePath) => {
  const readFile = tinyPromisify()(fsReadFile);
  const configPath = await findAsync(dirname(filePath), '.htmlhintrc');
  let conf = null;
  if (configPath !== null) {
    conf = await readFile(configPath, 'utf8');
  }
  if (conf) {
    return JSON.parse(stripJSONComments()(conf));
  }
  return null;
};

export function provideLinter() {
  return {
    name: 'htmlhint',
    grammarScopes,
    scope: 'file',
    lintOnFly: true,
    lint: async (editor) => {
      const { HTMLHint } = require('htmlhint');

      const fileText = editor.getText();
      const filePath = editor.getPath();

      if (!fileText) {
        return [];
      }

      const ruleset = await getConfig(filePath);

      const messages = HTMLHint.verify(fileText, ruleset || undefined);

      if (editor.getText() !== fileText) {
        // Editor contents have changed, tell Linter not to update
        return null;
      }

      return messages.map(message => ({
        range: generateRange(editor, message.line - 1, message.col - 1),
        type: message.type,
        text: message.message,
        filePath
      }));
    }
  };
}
