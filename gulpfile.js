const gulp = require('gulp');
const del = require('del');
const fileinclude = require('gulp-file-include');
const i18n = require('gulp-html-i18n');

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

const src = ['*.html',
  '!head.html', // ignore
  '!menu.html', // ignore
  '!js.html', // ignore
]

// Clean dest
gulp.task('clean', function() {
  return del([
    'docs/**/*'
  ]);
});

// Copy english assets to dest
gulp.task('copyEnAssets', function() {
  return gulp.src(['dist/**/*'], {
      base: './'
    })
    .pipe(gulp.dest(paths.scripts.dest + '/en'));
});

// Copy farai assets to dest
gulp.task('copyFaAssets', function() {
  return gulp.src(['dist/**/*'], {
      base: './'
    })
    .pipe(gulp.dest(paths.scripts.dest + '/fa'));
});

// Copy CNAME
gulp.task('copyCNAME', function() {
  return gulp.src(['CNAME'], {
      base: './'
    })
    .pipe(gulp.dest(paths.scripts.dest));
});

// Build HTML files into dest
gulp.task('includeHTML', function() {
  return gulp.src(src)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Localize
gulp.task('localize', function() {
  return gulp.src("docs/*.html")
    .pipe(i18n({
      langDir: './lang',
      createLangDirs: true,
      trace: true
    }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// After localize
gulp.task('afterLocalize', function() {
  return del([
    'docs/*.html'
  ]);
});


// Watch source code changes and run task series
gulp.task('watch', function() {
  return watch(["*.html", "dist/**/*", "lang/**/*"], series('clean', 'copyEnAssets', 'copyFaAssets', 'copyCNAME', 'includeHTML', 'localize', 'afterLocalize'));
});


gulp.task('default', series('clean', 'copyEnAssets', 'copyFaAssets', 'copyCNAME', 'includeHTML', 'localize', 'afterLocalize', 'watch'));