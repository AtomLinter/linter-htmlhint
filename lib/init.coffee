path = require 'path'

module.exports =
  configDefaults:
    htmlhintExecutablePath: path.join __dirname, '..', 'node_modules', 'htmlhint', 'bin'

  activate: ->
    console.log 'activate linter-htmlhint'
