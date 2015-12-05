path = require 'path'

{BufferedNodeProcess} = require 'atom'

module.exports =
  activate: ->
    @executablePath = path.resolve "#{__dirname}/../node_modules/htmlhint/bin/htmlhint"
    @scopes =  ['text.html.angular', 'text.html.basic', 'text.html.erb', 'text.html.gohtml', 'text.html.jsp', 'text.html.mustache', 'text.html.handlebars', 'text.html.ruby']

  deactivate: ->
    @lastProcess.kill()

  provideLinter: ->
    helpers = require('atom-linter')
    provider =
      grammarScopes: @scopes
      scope: 'file'
      lintOnFly: true
      lint: (textEditor) =>
        filePath = textEditor.getPath()
        htmlhintrc = helpers.findFile(filePath, '.htmlhintrc')
        text = textEditor.getText()
        args = [filePath, '--format', 'mini']
        command = @executablePath

        if htmlhintrc and '-c' not in args
          args = args.concat ['-c', htmlhintrc]


        return new Promise (resolve, reject)=>
          linterMessages = []
          stdout = (data)->
            # split lines and parse json objects
            data.match(/[^\r\n]+/g).forEach (d)->
              linterMessages.push JSON.parse d

          exit = ->
            resolve(linterMessages)

          @lastProcess = new BufferedNodeProcess({command, args, stdout, exit})
