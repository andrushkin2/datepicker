var gulp = require("gulp"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    notify = require("gulp-notify"),
    gulpsync = require("gulp-sync")(gulp),
    serve = require("gulp-serve"),
    del = require("del");

gulp.task("styles", function() {
    return gulp.src(["./**/*.less", "!node_modules/**/*"], {base : "."})
        .pipe(less({ style: "expanded" }))
        .pipe(autoprefixer({
            browsers: ["last 5 version", "ff >= 26", "safari >= 4", "ie >= 9", "opera 12.1", "ios >= 6", "android >= 3"],
            cascade: true
        }))
        .pipe(gulp.dest("./"))
        .pipe(rename({suffix: ".min"}))
        .pipe(minifycss())
        .pipe(gulp.dest("./"))
        .pipe(notify({ message: "Styles task complete" }));
});

gulp.task("scripts", function() {
    return gulp.src(["./**/*.js", "!node_modules/**/*", "!./**/*.min.js", "!./gulpfile.js", "!./Gruntfile.js"], {base: "."})
        .pipe(rename({suffix: ".min"}))
        .pipe(uglify())
        .pipe(gulp.dest("./"))
        .pipe(notify({ message: "Scripts task complete" }));
});

gulp.task("serve", serve({
    root: ["."],
    port: 3000
}));

gulp.task("default", ["watch-folder"], function(){});

gulp.task("watch", function() {
    gulp.watch("./datepicker.less", gulpsync.sync(["styles"]));
    gulp.watch("./datepicker.js", gulpsync.sync(["scripts"]));
});