path = require 'path'

module.exports =
  config:
    htmlhintExecutablePath:
      default: path.join __dirname, '..', 'node_modules', 'htmlhint', 'bin'
      title: 'HTMLHint Executable Path'
      type: 'string'

  activate: ->
    console.log 'activate linter-htmlhint'
