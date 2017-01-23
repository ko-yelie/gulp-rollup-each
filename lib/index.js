const Transform = require('stream').Transform
const path = require('path')
const rollup = require('rollup').rollup
const applySourceMap = require('vinyl-sourcemaps-apply')

module.exports = function (arg1, arg2) {
  return new class extends Transform {
    _transform (file, encoding, cb) {
      const entry = path.relative(file.cwd, file.path)
      const rollupOptions = Object.assign({}, arg1, {
        entry: entry
      })
      const generateOptions = arg2 || arg1
      const createSourceMap = file.sourceMap !== undefined

      generateOptions.sourceMap = createSourceMap

      rollup(rollupOptions).then((bundle) => {
        const result = bundle.generate(generateOptions)

        file.contents = Buffer.from(result.code)

        if (createSourceMap) {
          result.map.file = entry
          result.map.sources = result.map.sources.map(source => path.relative(file.cwd, source))
          applySourceMap(file, result.map)
        }

        cb(null, file)
      })
    }
  }({ objectMode: true })
}
