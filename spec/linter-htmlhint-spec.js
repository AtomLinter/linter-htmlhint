'use babel';

import * as path from 'path';

describe('The htmlhint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'index.js')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() =>
      Promise.all([
        atom.packages.activatePackage('linter-htmlhint'),
        atom.packages.activatePackage('language-html')
      ])
    );
  });

  it('detects invalid coding style in bad.html and report as error', () => {
    waitsForPromise(() => {
      const bad = path.join(__dirname, 'fixtures', 'bad.html');
      return atom.workspace.open(bad).then(editor => lint(editor)).then(messages => {
        expect(messages.length).toEqual(1);

        // test only the first error
        expect(messages[0].type).toEqual('error');
        expect(messages[0].text).toEqual('Doctype must be declared first.');
        expect(messages[0].filePath).toMatch(/.+bad\.html$/);
        expect(messages[0].range).toEqual([[0, 0], [0, 13]]);
      });
    });
  });

  it('finds nothing wrong with a valid file (good.html)', () => {
    waitsForPromise(() => {
      const good = path.join(__dirname, 'fixtures', 'good.html');
      return atom.workspace.open(good).then(editor => lint(editor)).then(messages => {
        expect(messages.length).toEqual(0);
      });
    });
  });
});
