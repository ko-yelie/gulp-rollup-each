const Transform = require('stream').Transform
const path = require('path')
const defaultRollup = require('rollup')
const applySourceMap = require('vinyl-sourcemaps-apply')
const PluginError = require('plugin-error')

const PLUGIN_NAME = 'gulp-rollup-each'

const cache = {} // cache - (outside of export)

module.exports = function (arg1, arg2, injectedRollup) {
  const rollup = (injectedRollup || defaultRollup).rollup

  return new class extends Transform {
    _transform (file, encoding, cb) {
      const input = path.relative(file.cwd, file.path)
      const ref = path.parse(input) // Input name

      let inputOptions = typeof arg1 === 'function' ? arg1(file) : arg1
      inputOptions = Object.assign({}, inputOptions, {
        input: input,
        cache: inputOptions.isCache ? cache[ref.name] : false
      })

      // Replace `isCache` option for object
      // Prevent Rollup throwing error of unkown `isCache` key.
      delete inputOptions.isCache

      // Extract output options from input options if arg2 does not exist
      arg2 = arg2 == null ? inputOptions.output : arg2
      const outputOptions = typeof arg2 === 'function' ? arg2(file) : arg2

      // SourceMap
      const createSourceMap = file.sourceMap !== undefined
      outputOptions.sourcemap = createSourceMap

      rollup(inputOptions)
        .then(bundle => {
          // cache the bundle
          if (bundle.cache) {
            cache[ref.name] = bundle.cache
          }

          return bundle.generate(outputOptions)
        })
        .then(
          result => {
            const output = result.output[0]

            file.contents = Buffer.from(output.code)

            if (createSourceMap) {
              const map = output.map
              map.file = input
              map.sources = map.sources.map(source =>
                path.relative(file.cwd, source)
              )
              applySourceMap(file, map)
            }

            cb(null, file)
          },
          err => {
            cb(new PluginError(PLUGIN_NAME, err))
          }
        )
    }
  }({
    objectMode: true
  })
}
