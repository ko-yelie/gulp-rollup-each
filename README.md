# gulp-rollup-each

Gulp plugin for [Rollup](https://rollupjs.org).<br>
Yet another gulp-rollup plugin that allows to input/output multiple files for static site.

## Installation

[npm](https://www.npmjs.com/package/gulp-rollup-each)

```sh
npm i gulp-rollup-each
```

## Usage

```js
const gulp = require('gulp')
const rollupEach = require('gulp-rollup-each')

function scripts () {
  return gulp
    .src([
      'src/**/*.js',
      '!src/**/_*' // exclude modules
    ])
    .pipe(
      rollupEach({
        output: {
          // outputOptions
          format: 'iife'
        }
      })
    )
    .pipe(gulp.dest('dist'))
}
```

with sourcemaps and Buble

```js
const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const rollupEach = require('gulp-rollup-each')
const buble = require('@rollup/plugin-buble')

function scripts () {
  return gulp
    .src([
      'src/**/*.js',
      '!src/**/_*' // exclude modules
    ])
    .pipe(sourcemaps.init())
    .pipe(
      rollupEach(
        {
          // inputOptions
          external: ['jquery'],
          plugins: [
            buble({
              target: {
                ie: 11
              }
            })
          ],
          isCache: true // enable Rollup cache
        },
        {
          // outputOptions
          format: 'iife',
          globals: {
            jquery: 'jQuery'
          }
        }
      )
    )
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
}
```

## Options

### `rollupEach(inputOptions [[, outputOptions], rollup])`

#### `inputOptions`

The 1st argument is the same object as [`inputOptions`](https://rollupjs.org/guide/en#inputoptions).<br>
However, **the `input` option is the file specified in `gulp.src()`**, so it can not be specified as gulp-rollup-each option.

If you want to enable the Rollup [`cache`](https://rollupjs.org/guide/en#cache), set `isCache` option to `true`.

```js
function scripts () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      rollupEach(
        {
          isCache: true // enable Rollup cache
        },
        {
          format: 'iife'
        }
      )
    )
    .pipe(gulp.dest('dist'))
}
```

#### `outputOptions`

The 2nd argument is the same object as [`outputOptions`](https://rollupjs.org/guide/en#outputoptions).<br>
If you omit the 2nd argument, `output` in the 1st argument changes to `outputOptions`.

```js
function scripts () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      rollupEach({
        output: {
          // outputOptions
          format: 'iife'
        }
      })
    )
    .pipe(gulp.dest('dist'))
}
```

You can also pass a function that returns rollup options object as an argument. The function will receive [vinyl](https://github.com/gulpjs/vinyl) file object.

```js
const path = require('path')
const gulp = require('gulp')
const rollupEach = require('gulp-rollup-each')

function scripts () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      rollupEach(
        {
          external: [/* ... */],
          plugins: [/* ... */]
        },
        file => {
          return {
            format: 'umd',
            name: path.basename(file.path, '.js')
          }
        }
      )
    )
    .pipe(gulp.dest('dist'))
}
```

#### `rollup`

You can specify the 3rd argument for replacing `rollup` object by your dependency. It is useful if you want to use a new version of rollup than gulp-rollup-each is using.

```js
function scripts () {
  return gulp
    .src(['src/**/*.js'])
    .pipe(
      rollupEach(
        {},
        {
          format: 'iife'
        },

        // Passing rollup object
        require('rollup')
      )
    )
    .pipe(gulp.dest('dist'))
}
```

## License

MIT
