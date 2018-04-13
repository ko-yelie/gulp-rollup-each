const path = require('path')
const fs = require('fs')
const plugin = require('../../lib')
const { Readable, Transform } = require('stream')

const fixtureBase = path.resolve(__dirname, '../fixtures')

function mockSrc (fileName) {
  const cwd = process.cwd()
  const filePath = path.resolve(fixtureBase, fileName)

  return new Readable({
    objectMode: true,
    read () {
      this.push({
        cwd,
        path: filePath,
        contents: fs.readFileSync(filePath)
      })
    }
  })
}

function mockTransform (fn) {
  return new Transform({
    objectMode: true,
    transform: fn
  })
}

describe('gulp-rollup-each', () => {
  afterEach(() => {
    process.removeAllListeners('unhandledRejection')
  })

  it('should not catch the latter stream error', done => {
    process.on('unhandledRejection', err => {
      expect(err.message).toBe('test error')
      done()
    })

    mockSrc('test.js')
      .pipe(plugin({
        output: { format: 'es' }
      }))
      .on('error', err => {
        // If it reaches here, it accidentally handles the latter stream error.
        console.error(err)
      })
      .pipe(mockTransform(() => {
        throw new Error('test error')
      }))
  })

  it('can be injected rollup object', done => {
    const mockRollup = {
      rollup () {
        return Promise.reject(new Error('Injected'))
      }
    }

    mockSrc('test.js')
      .pipe(plugin({}, {}, mockRollup))
      .on('error', err => {
        expect(err.message).toBe('Injected')
        done()
      })
  })
})
