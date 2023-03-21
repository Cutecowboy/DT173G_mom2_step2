const {src, dest, parallel, series, watch} = require('gulp');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const htmlmin = require("gulp-htmlmin");
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
// file paths 

const files = {
    htmlPath: "src/**/*.html",
    sassPath: "src/sass/*.scss",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*"
}

// copy HTML, minify the html code and send to pub
function copyHTML() {
    return src(files.htmlPath)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('pub'))

}

// SASS tasks, concatinate SASS files into one, minify and send to pub

function sassTask() {
    return src(files.sassPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(dest('pub/css'));
}

// js tasks, concatinate JS files, minify and send to pub
function jsTask() {
    return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(dest('pub/js'));
}

// img tasks compress the img and send to pub
function imageTask(){
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('pub/images'));
}

// watch function, watch for file changes, if so update the pub file with the changed file(s)

function watchTask() {
    watch([files.htmlPath, files.sassPath, files.jsPath, files.imagePath], parallel(copyHTML, sassTask, jsTask, imageTask))
}

// reload function, attempt at getting a liveserver i.e. when a edit is made the browser will automatically reload

function reload() {
    livereload.listen();
    watch('pub/**').on('change', livereload.changed);
}

// exports default, running gulp will run the following: if any edits are made it will update pub file(s), liveserver will run simantaneously and refresh the page

exports.default = series(
    parallel(copyHTML, sassTask, jsTask, imageTask),
    parallel(reload, watchTask)
    );

