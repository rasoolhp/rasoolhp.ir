const gulp = require('gulp');
const del = require('del');
const fileinclude = require('gulp-file-include');
const {
  watch,
  series
} = require('gulp');

const paths = {
  scripts: {
    src: './',
    dest: './docs/'
  }
};

// Clean dest
gulp.task('clean', function() {
  return del([
    'docs/**/*'
  ]);
});

// Copy assets to dest
gulp.task('copyAssets', function() {
  return gulp.src(['dist/**/*', 'CNAME'], {
      base: './'
    })
    .pipe(gulp.dest(paths.scripts.dest));
});

// Build HTML files into dest
gulp.task('includeHTML', function() {
  return gulp.src([
      '*.html',
      '!head.html', // ignore
      '!menu.html', // ignore
      '!js.html', // ignore
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// watch source code changes and run task series
gulp.task('watch', function() {
  return watch(["*.html", "dist/**/*"], series('clean', 'copyAssets', 'includeHTML'));
});


gulp.task('default', series('clean', 'copyAssets', 'includeHTML', 'watch'));