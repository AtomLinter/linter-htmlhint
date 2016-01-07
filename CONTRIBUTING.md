# Contributing

If you would like to contribute enhancements or fixes, please do the following:

1.  Fork the plugin repository.
2.  Hack on a separate topic branch created from the latest `master`.
3.  Commit and push the topic branch.
4.  Make a pull request.
5.  Welcome to the club!

Please note that modifications should follow these coding guidelines:

-   Indent is 2 spaces.
-   Code should pass `npm test` (alias of `eslint .`).
-   Vertical whitespace helps readability, don’t be afraid to use it.

## Development and Testing

If you are developing or testing this plugin, it's easy to load using
`apm link`.

First make sure you don't have linter-htmlhint installed.

```ShellSession
apm uninstall linter-htmlhint
```

Clone this repository and then from the linter-htmlhint directory:

```ShellSession
npm install
apm link
```

You can reload Atom with <kbd>Ctrl</kbd> + <kbd>Opt</kbd> + <kbd>Cmd</kbd> +
<kbd>l</kbd> and to open the inspector <kbd>Opt</kbd> + <kbd>Cmd</kbd> +
<kbd>i</kbd>.

To put it all back:

```ShellSession
apm unlink
apm install linter-htmlhint
```

Thank you for helping out!
