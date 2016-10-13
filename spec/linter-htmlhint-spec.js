'use babel';

import * as path from 'path';

const lint = require('../lib/index.js').provideLinter().lint;

describe('The htmlhint provider for Linter', () => {
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
      return atom.workspace.open(bad).then(editor => lint(editor)).then((messages) => {
        expect(messages.length).toEqual(1);

        // test only the first error
        expect(messages[0].type).toBe('error');
        expect(messages[0].text).toBe('Doctype must be declared first.');
        expect(messages[0].filePath).toBe(bad);
        expect(messages[0].range).toEqual([[0, 0], [0, 5]]);
      });
    });
  });

  it('finds nothing wrong with a valid file (good.html)', () => {
    waitsForPromise(() => {
      const good = path.join(__dirname, 'fixtures', 'good.html');
      return atom.workspace.open(good).then(editor => lint(editor)).then((messages) => {
        expect(messages.length).toBe(0);
      });
    });
  });
});
