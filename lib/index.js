const Transform = require('stream').Transform
const path = require('path')
const rollup = require('rollup').rollup
const applySourceMap = require('vinyl-sourcemaps-apply')
const PluginError = require('gulp-util').PluginError

const PLUGIN_NAME = 'gulp-rollup-each'

module.exports = function (arg1, arg2) {
  return new class extends Transform {
    _transform (file, encoding, cb) {
      const input = path.relative(file.cwd, file.path)

      let inputOptions = typeof arg1 === 'function' ? arg1(file) : arg1
      inputOptions = Object.assign({}, inputOptions, {
        input: input
      })

      // Extract output options from input options if arg2 does not exist
      arg2 = arg2 == null ? inputOptions.output : arg2
      const outputOptions = typeof arg2 === 'function' ? arg2(file) : arg2

      const createSourceMap = file.sourceMap !== undefined

      outputOptions.sourcemap = createSourceMap

      rollup(inputOptions)
        .then(bundle => {
          return bundle.generate(outputOptions)
        })
        .then(
          result => {
            file.contents = Buffer.from(result.code)

            if (createSourceMap) {
              result.map.file = input
              result.map.sources = result.map.sources.map(source => path.relative(file.cwd, source))
              applySourceMap(file, result.map)
            }

            cb(null, file)
          },
          err => {
            cb(new PluginError(PLUGIN_NAME, err))
          }
        )
    }
  }({ objectMode: true })
}
