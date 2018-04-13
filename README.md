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
      output: {
        format: 'iife'
      }
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
      // inputOptions
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
      // outputOptions
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
        name: path.basename(file.path, '.js')
      }
    }))
    .pipe(gulp.dest('dist'))
})
```

## Options

### `rollupEach(inputOptions [[, outputOptions], rollup])`

#### `inputOptions`

The 1st argument is the same object as [`inputOptions`](https://rollupjs.org/#inputoptions).  
However, the `input` option is the file specified in `gulp.src()`, so it can not be specified as gulp-rollup-each option.

#### `outputOptions`

The 2nd argument is the same object as [`outputOptions`](https://rollupjs.org/#outputoptions).  
If you omit the 2nd argument, `output` in the 1st argument changes to `outputOptions`.

You can also pass a function that returns rollup options object as an argument. The function will receive [vinyl](https://github.com/gulpjs/vinyl) file object.

#### `rollup`

You can specify the 3rd argument for replacing `rollup` object by your dependency. It is useful if you want to use a new version of rollup than gulp-rollup-each is using.

```js
gulp.task('rollup', () => {
    return gulp
    .src(['src/*.js'])
    .pipe(
      rollupEach(
        {},
        {
          output: {
            format: 'iife'
          }
        },

        // Passing rollup object
        require('rollup')
      )
    )
    .pipe(gulp.dest('dist'))
})
```

## License

MIT
