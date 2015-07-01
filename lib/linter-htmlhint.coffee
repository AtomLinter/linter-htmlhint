# coffeelint: disable=max_line_length
linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"
{CompositeDisposable} = require "atom"

class LinterHtmlhint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.php', 'text.html.ruby', ]

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: ['htmlhint', '--verbose', '--extract=auto']

  linterName: 'htmlhint'

  # A regex pattern used to extract information from the executable's output.
  regex:
    'line (?<line>[0-9]+), col (?<col>[0-9]+): (?<message>.+)'

  isNodeExecutable: yes

  # update the ruleset anytime the watched htmlhintrc file changes
  setupHtmlHintRc: =>
    htmlHintRcPath = atom.config.get('linter.linter-htmlhint.htmlhintRcFilePath') || @cwd
    fileName = atom.config.get(
      'linter.linter-htmlhint.htmlhintRcFileName') || '.htmlhintrc'
    config = findFile htmlHintRcPath, [fileName]

    # only add the config file once to the command line
    if config and '-c' not in @cmd
      @cmd = @cmd.concat ['-c', config]

  constructor: (editor) ->
    super(editor)

    @disposables = new CompositeDisposable

    @disposables.add atom.config.observe 'linter-htmlhint.htmlhintExecutablePath', @formatShellCmd

    # reload if path or file name changed of the htmlhintrc file
    @disposables.add atom.config.observe 'linter-htmlhint.htmlHintRcFilePath', @setupHtmlHintRc
    @disposables.add atom.config.observe 'linter-htmlhint.htmlHintRcFileName', @setupHtmlHintRc

  lintFile: (filePath, callback) ->
    super(filePath, callback)

  formatShellCmd: =>
    htmlhintExecutablePath = atom.config.get 'linter-htmlhint.htmlhintExecutablePath'
    @executablePath = "#{htmlhintExecutablePath}"

  formatMessage: (match) ->
    "#{match.message}"[5...-5]


  createMessage: (match) ->
    # use the formatting code in the message to determin type.
    if match.message[1..4] == "[33m"
      level = 'warning'
    else if match.message[1..4] == "[31m"
      level = 'error'
    else
      level = 'info'

    return {
      line: match.line,
      col: match.col,
      level: level,
      message: @formatMessage(match),
      linter: @linterName,
      range: @computeRange match
    }

  destroy: ->
    super
    @disposables.dispose()

module.exports = LinterHtmlhint
