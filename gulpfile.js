var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps  = require('gulp-sourcemaps');

gulp.task('sass',function(){
  gulp.src('assets/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['components'],
        outFile: 'assets/css/main.css',
        sourceMap: true,
        outputStyle: 'compressed'
      }))
      .pipe(sourcemaps.write(''))
      .pipe(gulp.dest('assets/css'));
  gulp.src('assets/scss/woocommerce.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: ['components'],
        outFile: 'assets/css/woocommerce.css',
        sourceMap: true,
        outputStyle: 'compressed'
      }))
      .pipe(sourcemaps.write(''))
      .pipe(gulp.dest('assets/css'));
});

gulp.task('browser-sync', function() {
    browserSync.init(["assets/css/*.css", "assets/scripts/*.js"], {
      proxy: "http://foxelectronics.loco"
    });
});

gulp.task('default', ['sass', 'browser-sync'], function () {
    gulp.watch("assets/scss/**/*.scss", ['sass']);
});