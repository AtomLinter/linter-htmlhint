path = require 'path'

{CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      default: path.join __dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint'
      type: 'string'
      description: 'HTMLHint Executable Path'
  activate: ->
    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.config.observe 'linter-htmlhint.executablePath',
      (executablePath) =>
        @executablePath = executablePath

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: ['text.html.basic', 'text.html.angular', 'text.html.mustache']
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) ->
        filePath = textEditor.getPath()
        htmlhintrc = helpers.findFile(filePath, '.htmlhintrc')
        text = textEditor.getText()
        parameters = [filePath,'--format','json']

        if htmlhintrc and '-c' not in parameters
          parameters = parameters.concat ['-c', htmlhintrc]

        return helpers.execNode(@executablePath, parameters, {}).then (output) ->
          # console.log('output', output)
          linterResults = JSON.parse output
          return [] unless linterResults.length
          linterMessages = linterResults[0].messages
          return linterMessages.map (msg) ->
            range : [[msg.line-1, msg.col-1], [msg.line-1, msg.col-1]]
            type : msg.type
            text : msg.message
            filePath : filePath
