# linter-htmlhint

A plugin for [Linter] providing an interface to [HTMLHint]. It will be
used with files that have the syntax.

## Installation

The [Linter] package will be installed for you to provide an interface to this package. If you are using an alternative debugging interface that supports linter plugins simply disable [Linter].

```ShellSession
$ apm install linter-htmlhint
```

## Config

This plugin will search for a [HTMLHint] configuration file called `.htmlhintrc` and use that file if it exists in any parent folder. It will stop at the first `.htmlhintrc` file found.

## Settings

You can configure `linter-htmlhint` in Atom's Settings.

[linter]: https://github.com/atom-community/linter "Linter"
[HTMLHint]: https://github.com/yaniswang/HTMLHint "HTMLHint"
