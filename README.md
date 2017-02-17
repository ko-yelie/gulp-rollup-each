# gulp-rollup-each

Gulp plugin for Rollup.  
Yet another gulp-rollup plugin that allows to input/output multiple files.

## Usage

```js
var gulp = require('gulp')
var rollupEach = require('gulp-rollup-each')

gulp.task('rollup', () => {
  return gulp.src('src/*.js')
    .pipe(rollupEach({
      // bundle.generate( options )
      format: 'iife'
    })
    .pipe(gulp.dest('dist'))
  )
})
```

with sourcemaps and Buble

```js
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var rollupEach = require('gulp-rollup-each')
var rollupBuble = require('rollup-plugin-buble')

gulp.task('rollup', () => {
  return gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(rollupEach({
      // rollup.rollup( options )
      external: [
        'jquery'
      ],
      plugins: [
        rollupBuble({
          target: {
            ie: 11
          }
        })
      ]
    }, {
      // bundle.generate( options )
      format: 'iife',
      globals: {
        jquery: 'jQuery'
      }
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
})
```

## License

MIT
