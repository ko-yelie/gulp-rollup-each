const gulp = require('gulp')
const rollupEach = require('../lib')
const { getBabelOutputPlugin } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const sourcemaps = require('gulp-sourcemaps')

function scripts () {
  return gulp
    .src(['src/**/*.js', '!src/**/modules/*.js'])
    .pipe(sourcemaps.init())
    .pipe(
      rollupEach(
        {
          isCache: true,
          plugins: [
            getBabelOutputPlugin({
              presets: ['@babel/preset-env'],
              allowAllFormats: true,
            }),
            nodeResolve({
              jsnext: true,
              main: true
            }),
            commonjs()
          ]
        },
        {
          format: 'iife'
        }
      )
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
}

function watch () {
  gulp.watch('src/**/*.js', scripts)
}

function copy () {
  return gulp.src('src/**/*.html').pipe(gulp.dest('dist'))
}

exports.scripts = scripts
exports.watch = watch
exports.default = gulp.parallel(copy, scripts)
