const gulp = require('gulp');
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

// Build HTML files
async function includeHTML() {
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
}

// Copy assets
async function copyAssets() {
  gulp.src(['dist/**/*', 'CNAME'], {
      base: './'
    })
    .pipe(gulp.dest(paths.scripts.dest));
}

// Build HTML files and Copy assets
async function buildAndReload() {
  // NOTE: If you want, You can add await before these functions.
  includeHTML();
  copyAssets();
  // TODO: add live refresh server
}


exports.includeHTML = includeHTML;

exports.default = async function() {
  // Build and reload at the first time
  buildAndReload();
  // Watch task
  watch(["*.html", "dist/**/*"], series(buildAndReload));
};