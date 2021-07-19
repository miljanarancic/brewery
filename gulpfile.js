'use strict';

const browserSync = require("browser-sync").create();
var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var jquery = require('gulp-jquery');
var $ = require('jquery');
var concat = require('gulp-concat');

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('./src/sass/index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function(done) {
    gulp.src("src/js/**/*.js")
      .pipe(concat('index.js'))
      .pipe(gulp.dest('./dist/'))
    done()
  });

gulp.task(
    "default",
    gulp.series(["scripts", "sass"], () => {
        browserSync.init({
            server: "./dist",
        });

        gulp.watch("src/js/**/*.js", gulp.series("scripts"));
        gulp.watch("src/sass/**/*.scss", gulp.series("sass"));
        gulp.watch("dist/*.html").on("change", browserSync.reload);
        gulp.watch("src/**/*").on("change", browserSync.reload);

        //gulp.watch("src/assets/fonts/**/*", gulp.series("fonts"));
        //gulp.watch("src/assets/images/**/*", gulp.series("images"));
        //gulp.watch("src/js/**/*.js", gulp.series("babel")).on("change", browserSync.reload);
    })
);
