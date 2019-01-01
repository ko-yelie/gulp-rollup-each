const path = require('path')
const fs = require('fs')
const plugin = require('../../lib')
const { Readable } = require('stream')

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

describe('gulp-rollup-each', () => {
  it('should throw an error if it is the wrong option', done => {
    mockSrc('hello.js')
      .pipe(plugin({
        output: { wrongFormat: 'es' }
      }))
      .on('error', err => {
        expect(err.plugin).toBe('gulp-rollup-each')
        done()
      })
  })

  it('can be injected rollup object', done => {
    const mockRollup = {
      rollup () {
        return Promise.reject(new Error('Injected'))
      }
    }

    mockSrc('hello.js')
      .pipe(plugin({}, {}, mockRollup))
      .on('error', err => {
        expect(err.message).toBe('Injected')
        done()
      })
  })
})
