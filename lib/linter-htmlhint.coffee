linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"

class LinterHtmlhint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['text.html.basic']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: ['htmlhint', '--verbose', '--extract=auto']

  linterName: 'htmlhint'

  # A regex pattern used to extract information from the executable's output.
  regex:
    'line (?<line>[0-9]+), col (?<col>[0-9]+): (?<message>.+)'

  isNodeExecutable: yes

  constructor: (editor) ->
    super(editor)

    config = findFile @cwd, ['.htmlhintrc']
    if config
      @cmd = @cmd.concat ['-c', config]

    atom.config.observe 'linter-htmlhint.htmlhintExecutablePath', @formatShellCmd

  formatShellCmd: =>
    htmlhintExecutablePath = atom.config.get 'linter-htmlhint.htmlhintExecutablePath'
    @executablePath = "#{htmlhintExecutablePath}"

  formatMessage: (match) ->
    "#{match.message}"[5...-5].replace "<", "&lt;"

  destroy: ->
    atom.config.unobserve 'linter-htmlhint.htmlhintExecutablePath'

module.exports = LinterHtmlhint
