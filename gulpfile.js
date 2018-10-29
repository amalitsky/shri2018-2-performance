const gulp = require('gulp');
const deploy = require('gulp-gh-pages');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();

const cssFiles = 'styles.css';
const jsFiles = 'scripts.js';
const publicFolder = 'public';

gulp.task('minify-html', () => {
  return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(publicFolder));
});

gulp.task('minify-css', () => {
  return gulp.src(cssFiles)
    .pipe(cleanCSS())
    .pipe(gulp.dest(publicFolder));
});

gulp.task('minify-js', () => {
  return gulp.src(jsFiles)
    .pipe(uglify())
    .on('error', function(err) {
      console.error('Error in compress task', err.toString());
    })
    .pipe(gulp.dest(publicFolder));
});

gulp.task('build', [
  'minify-js',
  'minify-css',
  'minify-html'
]);

gulp.task('serve', ['build'], function() {
  browserSync.init({
    server: 'public',
    open: false
  });

  gulp.watch(jsFiles, ['minify-js'], browserSync.reload);
  gulp.watch(cssFiles, ['minify-css'], browserSync.reload);
  gulp.watch('index.html', ['minify-html'], browserSync.reload);
});

/*
gulp.task('serve', ['compile-css'], function() {
  browserSync.init({
    server: 'public',
    open: false
  });

  gulp.watch(lessFiles, ['compile-css']);
  gulp.watch('public/index.html').on('change', browserSync.reload);
});*/

gulp.task('default', ['serve']);

/** Push build to gh-pages */
gulp.task('deploy', function() {
  return gulp.src(publicFolder).pipe(deploy());
});
