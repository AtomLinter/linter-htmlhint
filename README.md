# linter-htmlhint

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides
an interface to [htmlhint](https://github.com/yaniswang/HTMLHint). It will be
used with files that have the syntax.

## Installation

Linter package must be installed in order to use this plugin. If Linter is not
installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation

```ShellSession
$ apm install linter-htmlhint
```

### .htmlhintrc

This plugin will search for a htmlhint configuration file called `.htmlhintrc`
and use that file if it exists anywhere in the directory tree. It will stop at
the first `.htmlhintrc` file found.

## Settings

You can configure linter-htmlhint by editing `~/.atom/config.cson` (choose Open
Your Config in Atom menu):

```coffeescript
'linter-htmlhint':
  'htmlhintExecutablePath': null #htmlhint path. run 'which htmlhint' to find the path
```

[linter]: https://github.com/AtomLinter/Linter "Linter"
