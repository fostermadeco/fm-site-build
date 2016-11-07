var options     = require('./fm-site-build.options.js')();
var build       = require('fm-site-build')(options);
var gulp        = require('gulp');

// get subtasks so they can be run
build.setSubTasks();

// ---- PUBLIC GULP TASKS ----

gulp.task('help', build.getTaskListing());

gulp.task('dev', function() {
    build.getDevSequence();
});

gulp.task('watch', function() {
    build.getWatchSequence();
});

gulp.task('dist', function() {
    build.getDistSequence();
});

// ---- END fm-site-build BOILERPLATE ----