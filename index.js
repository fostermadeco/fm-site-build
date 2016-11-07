var env          = require('./env')();

var gulp         = require('gulp');
var log          = require('gulp-util').log;
var cond         = require('gulp-if');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss     = require('gulp-clean-css');
var rename       = require('gulp-rename');
var _            = require('lodash');
var taskListing  = require('gulp-task-listing');
var runSequence  = require('run-sequence');


/**
 * Main package file that contains public functions to retrieve tasks.
 * Retrieves task streams for all tasks.
 */
module.exports = function(options) {
    var config       = require('./config.js')(options);

    var styles       = require('./tasks/styles')(config);
    var scripts      = require('./tasks/scripts')(config);
    var mod          = require('./tasks/mod')(config);
    var bower        = require('./tasks/bower')(config);
    var watch        = require('./tasks/watch')(config);
    var revision     = require('./tasks/revision')(config);

    return {
        setSubTasks: setSubTasks,
        getTaskNamesForRevReplace: getTaskNamesForRevReplace,
        getTaskListing: getTaskListing,
        getDevSequence: getDevSequence,
        getWatchSequence: getWatchSequence,
        getDistSequence: getDistSequence
    };

    ////////////
    
    /*
     * Sets all sub tasks for use in public tasks
     */
    function setSubTasks() {
        /* DEV */
        gulp.task('_styles', function() {
            return styles.getStylesStream();
        });

        gulp.task('_scripts', function() {
            return scripts.getScriptsStream();
        });

        gulp.task('_mod', function() {
            return mod.getModStream();
        });

        /* MISC STYLES */
        gulp.task('_styles-clean', function() {
            return styles.getCleanStylesStream();
        });
        gulp.task('_combine-all-styles', function() {
            return styles.getCombineStylesStream();
        });

        /* BOWER */
        gulp.task('_bower:css', function() {
            return bower.getBowerCssStream();
        });       
        gulp.task('_bower:fonts', function() {
            return bower.getBowerFontsStream();
        });
        gulp.task('_bower:images', function() {
            return bower.getBowerImagesStream();
        });

        /* WATCH */
        gulp.task('_startWatch', function() {
            return watch.getWatchStream();
        });

        /* DIST */
        gulp.task('_revision', function() {
            return revision.getRevisionStream();
        });

        revision.createStreamsForRevReplace();

    }

    /*
     * Returns lists of task names for templates that have versioning
     */
    function getTaskNamesForRevReplace() {
        return _.map(config.templates.indexes, function(file, i) {
            return '_revreplace-' + i;
        });
    }

    /*
     * Returns task listing 
     * Allows for task listing package dependency to be within package
     */
    function getTaskListing() {
        return taskListing;
    }

    /*
     * Returns sequence of tasks to for main 'dev' task
     * Allows tasks to be set through package
     */
    function getDevSequence() {
        return runSequence(
            ['_bower:images', '_bower:fonts', '_bower:css'],
            '_styles', 
            '_scripts', 
            '_mod'
        );
    }

    /*
     * Returns sequence of tasks to for main 'watch' task
     * Allows tasks to be set through package
     */
    function getWatchSequence() {
        return runSequence('dev', '_startWatch');
    }

    /*
     * Returns sequence of tasks to for main 'dist' task
     * Allows tasks to be set through package
     */
    function getDistSequence() {
        env.setToProd();

        // have to re-get all tasks because env is set
        setSubTasks();

        runSequence(
            ['_bower:images', '_bower:fonts', '_scripts', '_mod'],
            ['_bower:css', '_styles'],
            '_combine-all-styles',
            '_styles-clean', 
            '_revision', 
            getTaskNamesForRevReplace()
        );
    }
};