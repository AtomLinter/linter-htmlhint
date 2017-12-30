'use babel';

import * as path from 'path';
// eslint-disable-next-line no-unused-vars
import { it, fit, wait, beforeEach, afterEach } from 'jasmine-fix';

const { lint } = require('../lib/index.js').provideLinter();

describe('The htmlhint provider for Linter', () => {
  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-htmlhint');
    await atom.packages.activatePackage('language-html');
  });

  it('detects invalid coding style in bad.html and report as error', async () => {
    const bad = path.join(__dirname, 'fixtures', 'bad.html');
    const editor = await atom.workspace.open(bad);
    const messages = await lint(editor);

    expect(messages.length).toEqual(1);
    expect(messages[0].type).toBe('error');
    expect(messages[0].text).toBe('Doctype must be declared first.');
    expect(messages[0].filePath).toBe(bad);
    expect(messages[0].range).toEqual([[0, 0], [0, 5]]);
  });

  it('finds nothing wrong with a valid file (good.html)', async () => {
    const good = path.join(__dirname, 'fixtures', 'good.html');
    const editor = await atom.workspace.open(good);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  it('lints an invalid file (bad.html) with a default configuration when no config file is present', async () => {
    atom.config.set('linter-htmlhint.disableWhenNoHtmhintConfig', false);

    const bad = path.join(__dirname, 'fixtures', 'bad.html');
    const editor = await atom.workspace.open(bad);
    spyOn(editor, 'getPath').andReturn(__dirname);
    const messages = await lint(editor);

    expect(messages.length).toEqual(3);
  });

  it('does not lint an invalid file (bad.html) when no config is found and the disable option set', async () => {
    atom.config.set('linter-htmlhint.disableWhenNoHtmhintConfig', true);

    const bad = path.join(__dirname, 'fixtures', 'bad.html');
    const editor = await atom.workspace.open(bad);
    spyOn(editor, 'getPath').andReturn(__dirname);
    const messages = await lint(editor);

    expect(messages).toBe(null);
  });
});
