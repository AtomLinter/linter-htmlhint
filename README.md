linter-htmlhint
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [htmlhint](https://github.com/yaniswang/HTMLHint). It will be used with files that have the syntax.

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation
```
$ apm install linter-htmlhint
```

### .htmlhintrc
This plugin will search for a htmlhint configuration file called `.htmlhintrc` and use that file if it exists anywhere in the directory tree.  It will stop at the first `.htmlhintrc` file found.

### Development and Testing
If you are developing or testing this plugin, it's easy to load using `apm link`

First make sure you don't have linter-htmlhint installed.
```bash
apm uninstall linter-htmlhint
```

Clone this repository and then from the linter-htmlhint directory:
```bash
npm install
apm link
```

You can reload Atom with `ctrl+opt+cmd+l` and to open the inspector `opt+cmd+i`.

To put it all back:
```bash
apm unlink
apm install linter-htmlhint
```

## Settings
You can configure linter-htmlhint by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```
'linter-htmlhint':
  'htmlhintExecutablePath': null #htmlhint path. run 'which htmlhint' to find the path
```

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass coffeelint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!

## Donation
[![Share the love!](https://chewbacco-stuff.s3.amazonaws.com/donate.png)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8)
