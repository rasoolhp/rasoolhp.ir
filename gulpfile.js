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
    src: 'src',
    dest: 'docs'
  }
};

const includeSrc = ['./src/**/*.html',
  '!./src/templates/**/*',
  '!./src/languages/**/*'
]

// Clean dest
gulp.task('clean', function() {
  return del(['docs']);
});

// Copy english assets to dest
gulp.task('copyEnAssets', function() {
  return gulp.src(['./src/dist/**/*'], {
      base: './src/'
    })
    .pipe(gulp.dest(paths.scripts.dest + '/en'));
});

// Copy farai assets to dest
gulp.task('copyFaAssets', function() {
  return gulp.src(['./src/dist/**/*'], {
      base: './src/'
    })
    .pipe(gulp.dest(paths.scripts.dest + '/fa'));
});

// Copy CNAME
gulp.task('copyCNAME', function() {
  return gulp.src(['./src/CNAME'])
    .pipe(gulp.dest(paths.scripts.dest));
});

// Build HTML files into dest
gulp.task('includeHTML', function() {
  return gulp.src(includeSrc)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Localize
gulp.task('localize', function() {
  return gulp.src("docs/**/*.html")
    .pipe(i18n({
      langDir: './src/languages',
      createLangDirs: true,
      trace: true
    }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// After localize
gulp.task('afterLocalize', function() {
  return del([
    'docs/**',
    '!docs/en',
    '!docs/fa',
    '!docs/CNAME'
  ]);
});


// Watch source code changes and run task series
gulp.task('watch', function() {
  return watch(["src/**/*"], series('clean', 'includeHTML', 'localize', 'copyEnAssets', 'copyFaAssets', 'copyCNAME', 'afterLocalize'));
});


gulp.task('default', series('clean', 'includeHTML', 'localize', 'copyEnAssets', 'copyFaAssets', 'copyCNAME', 'afterLocalize', 'watch'));