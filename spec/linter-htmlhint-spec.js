'use babel';

import * as path from 'path';

import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach
} from 'jasmine-fix';

const { lint } = require('../lib/index.js').provideLinter();

describe('The htmlhint provider for Linter', () => {
  const badFile = path.join(__dirname, 'fixtures', 'bad.html');
  const goodFile = path.join(__dirname, 'fixtures', 'good.html');

  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-htmlhint');
    await atom.packages.activatePackage('language-html');
  });

  it('detects invalid coding style in bad.html and report as error', async () => {
    const editor = await atom.workspace.open(badFile);
    const messages = await lint(editor);

    expect(messages.length).toEqual(1);
    expect(messages[0].type).toBe('error');
    expect(messages[0].text).toBe('Doctype must be declared first.');
    expect(messages[0].filePath).toBe(badFile);
    expect(messages[0].range).toEqual([[0, 0], [0, 5]]);
  });

  it('finds nothing wrong with a valid file (good.html)', async () => {
    const editor = await atom.workspace.open(goodFile);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  describe('The "Disable when no HTMLHint config is found" option', () => {
    it('lints files with no config when disabled', async () => {
      atom.config.set('linter-htmlhint.disableWhenNoHtmlhintConfig', false);

      const editor = await atom.workspace.open(badFile);
      spyOn(editor, 'getPath').andReturn(__dirname);
      const messages = await lint(editor);

      expect(messages.length).toEqual(3);
    });

    it("doesn't lint files with no config when enabled", async () => {
      atom.config.set('linter-htmlhint.disableWhenNoHtmlhintConfig', true);

      const editor = await atom.workspace.open(badFile);
      spyOn(editor, 'getPath').andReturn(__dirname);
      const messages = await lint(editor);

      expect(messages).toBe(null);
    });
  });
});
