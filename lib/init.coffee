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
      @scopes =  ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.php', 'text.html.ruby']

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
        parameters = [ filePath ]

        if htmlhintrc and '-c' not in parameters
          parameters = parameters.concat ['-c', htmlhintrc]

        return helpers.execNode(atom.config.get('linter-htmlhint.executablePath'), parameters, {}).then (output) ->
          # console.log('output', output)
          parsed = helpers.parse(output, 'line (?<line>[0-9]+), col (?<col>[0-9]+): (?<message>.+)')

          parsed.map (match) ->

            # use the formatting code in the message to determin type.
            if match.text[1..4] == "[33m"
              match.type = 'warning'
            else if match.text[1..4] == "[31m"
              match.type = 'error'
            else
              match.type = 'info'

            # remove the formatting codes:
            match.text = match.text[5...-5]

            # add filepath to return object
            match.filePath = filePath

            # console.log 'match', match
            return match

          return parsed
