const gulp = require('gulp')
const rollupEach = require('../lib')
const rollupBabel = require('rollup-plugin-babel')
const rollupResolve = require('rollup-plugin-node-resolve')
const rollupCommon = require('rollup-plugin-commonjs')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('default', () => {
  return gulp.src([
      'src/**/*.js',
      '!src/**/modules/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(rollupEach({
      plugins: [
        rollupBabel(),
        rollupResolve({
          jsnext: true,
          main: true
        }),
        rollupCommon()
      ]
    }, {
      format: 'iife'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})
