'use babel';

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies
import { CompositeDisposable } from 'atom';

// Dependencies
let dirname;
let HTMLHint;
let findAsync;
let fsReadFile;
let generateRange;
let tinyPromisify;
let stripJSONComments;

// Configuration
let disableWhenNoHtmlhintConfig;

// Internal variables
const phpEmbeddedScope = 'text.html.php';

// Internal functions
const getConfig = async (filePath) => {
  const readFile = tinyPromisify(fsReadFile);
  const configPath = await findAsync(dirname(filePath), '.htmlhintrc');
  let conf = null;
  if (configPath !== null) {
    conf = await readFile(configPath, 'utf8');
  }
  if (conf) {
    return JSON.parse(stripJSONComments(conf));
  }
  return null;
};

const phpScopedEditor = editor => (
  editor.getCursors().some(cursor => (
    cursor.getScopeDescriptor().getScopesArray().some(scope => (
      scope === phpEmbeddedScope
    ))
  ))
);

const removePHP = str => str.replace(/<\?(?:php|=)?(?:[\s\S])+?\?>/gi, (match) => {
  const newlines = match.match(/\r?\n|\r/g);
  const newlineCount = newlines ? newlines.length : 0;

  return '\n'.repeat(newlineCount);
});

const loadDeps = () => {
  if (loadDeps.loaded) {
    return;
  }
  if (!dirname) {
    ({ dirname } = require('path'));
  }
  if (!HTMLHint) {
    ({ HTMLHint } = require('htmlhint'));
  }
  if (!findAsync || !generateRange) {
    ({ findAsync, generateRange } = require('atom-linter'));
  }
  if (!fsReadFile) {
    ({ readFile: fsReadFile } = require('fs'));
  }
  if (!tinyPromisify) {
    tinyPromisify = require('tiny-promisify');
  }
  if (!stripJSONComments) {
    stripJSONComments = require('strip-json-comments');
  }
  loadDeps.loaded = true;
};

export default {
  activate() {
    this.idleCallbacks = new Set();
    let depsCallbackID;
    const installLinterHtmlhintDeps = () => {
      this.idleCallbacks.delete(depsCallbackID);
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-htmlhint');
      }
      loadDeps();
    };
    depsCallbackID = window.requestIdleCallback(installLinterHtmlhintDeps);
    this.idleCallbacks.add(depsCallbackID);

    this.grammarScopes = [];

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-htmlhint.enabledScopes', (scopes) => {
      // Remove any old scopes
      this.grammarScopes.splice(0, this.grammarScopes.length);
      // Add the current scopes
      Array.prototype.push.apply(this.grammarScopes, scopes);
    }));
    this.subscriptions.add(atom.config.observe('linter-htmlhint.disableWhenNoHtmlhintConfig', (value) => {
      disableWhenNoHtmlhintConfig = value;
    }));
  },

  deactivate() {
    this.idleCallbacks.forEach(callbackID => window.cancelIdleCallback(callbackID));
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'htmlhint',
      grammarScopes: this.grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: async (editor) => {
        if (!atom.workspace.isTextEditor(editor)) {
          return null;
        }

        const filePath = editor.getPath();
        if (!filePath) {
          // Invalid path
          return null;
        }

        const isPhPEditor = phpScopedEditor(editor);

        const fileText = editor.getText();
        const text = isPhPEditor ? removePHP(fileText) : fileText;
        if (!text) {
          return [];
        }

        // Ensure that all dependencies are loaded
        loadDeps();

        const ruleset = await getConfig(filePath);
        if (!ruleset && disableWhenNoHtmlhintConfig) {
          return null;
        }

        const messages = HTMLHint.verify(text, ruleset || undefined);

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
};
