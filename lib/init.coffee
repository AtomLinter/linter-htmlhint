path = require 'path'

{CompositeDisposable} = require 'atom'

module.exports =
  config:
    executablePath:
      default: path.join __dirname, '..', 'node_modules', 'htmlhint', 'bin', 'htmlhint'
      type: 'string'
      description: 'HTMLHint Executable Path'
  activate: ->
      console.log 'activate linter-htmlhint'
      # console.log 'config', @config
      # console.log 'dirname', __dirname
      @subscriptions = new CompositeDisposable
      @subscriptions.add atom.config.observe 'linter-htmlhint.executablePath',
        (executablePath) =>
          @executablePath = executablePath
      @scopes =  ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.handlebars', 'text.html.ruby']

  deactivate: ->
    @subscriptions.dispose()

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: @scopes
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) ->
        filePath = textEditor.getPath()
        htmlhintrc = helpers.findFile(filePath, '.htmlhintrc')
        text = textEditor.getText()
        parameters = [filePath,'--format','json']

        if htmlhintrc and '-c' not in parameters
          parameters = parameters.concat ['-c', htmlhintrc]

        return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then (output) ->
          # console.log('output', output)
          linterResults = JSON.parse output
          return [] unless linterResults.length
          linterMessages = linterResults[0].messages
          return linterMessages.map (msg) ->
            range : [[msg.line-1, msg.col-1], [msg.line-1, msg.col-1]]
            type : msg.type
            text : msg.message
            filePath : filePath
