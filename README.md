# gulp-rollup-each

Gulp plugin for Rollup.  
Yet another gulp-rollup plugin that allows to input/output multiple files for static site.

## Usage

```js
var gulp = require('gulp')
var rollupEach = require('gulp-rollup-each')

gulp.task('rollup', () => {
  return gulp.src([
      'src/*.js',
      '!src/**/_*' // exclude modules
    ])
    .pipe(rollupEach({
      // bundle.generate( options )
      format: 'iife'
    }))
    .pipe(gulp.dest('dist'))
})
```

with sourcemaps and Buble

```js
var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var rollupEach = require('gulp-rollup-each')
var rollupBuble = require('rollup-plugin-buble')

gulp.task('rollup', () => {
  return gulp.src([
      'src/*.js',
      '!src/**/_*' // exclude modules
    ])
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

You can also pass a function that returns rollup options object as an argument. The function will receive [vinyl](https://github.com/gulpjs/vinyl) file object.

```js
var path = require('path')
var gulp = require('gulp')
var rollupEach = require('gulp-rollup-each')

gulp.task('rollup', () => {
  return gulp.src([
      'src/*.js',
      '!src/**/_*' // exclude modules
    ])
    .pipe(rollupEach({
      plugins: [/* ... */]
    }, (file) => {
      return {
        format: 'umd',
        moduleName: path.basename(file.path, '.js')
      }
    }))
    .pipe(gulp.dest('dist'))
})
```

## Options

### `rollupEach([rollupOptions,] generateOptions)`

#### `rollupOptions`

The 1st argument is the same object as [`rollup.rollup(options)`](https://github.com/rollup/rollup/wiki/JavaScript-API#rolluprollup-options-).  
However, the `entry` option is the file specified in `gulp.src()`, so it can not be specified as gulp-rollup-each option.

#### `generateOptions`

The 2nd argument is the same object as [`bundle.generate(options)`](https://github.com/rollup/rollup/wiki/JavaScript-API#bundlegenerate-options-).  
If you omit the 2nd argument, the 1st argument changes to `generateOptions`.

You can also pass a function that returns rollup options object as an argument. The function will receive [vinyl](https://github.com/gulpjs/vinyl) file object.

## License

MIT
