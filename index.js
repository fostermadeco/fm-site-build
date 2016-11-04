var gulp         = require('gulp');
var log          = require('gulp-util').log;
var cond         = require('gulp-if');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss     = require('gulp-clean-css');
var rename       = require('gulp-rename');
var _          = require('lodash');

/**
 */
module.exports = function(isProd, options) {
    var config       = require('./config.js')(options);

    var styles       = require('./tasks/styles')(isProd, config);
    var scripts      = require('./tasks/scripts')(isProd, config);
    var mod          = require('./tasks/mod')(isProd, config);
    var bower          = require('./tasks/bower')(isProd, config);
    var watch          = require('./tasks/watch')(isProd, config);
    var revision          = require('./tasks/revision')(isProd, config);

    return {
        getSubTasks: getSubTasks,
        getTasksForRevReplace: getTasksForRevReplace
    };

    ////////////

    function getSubTasks() {
        /* DEV */
        gulp.task('_styles', function() {
            return styles.getStylesTask();
        });

        gulp.task('_scripts', function() {
            return scripts.getScriptsTask();
        });

        gulp.task('_mod', function() {
            return mod.getModTask();
        });

        /* MISC STYLES */
        gulp.task('_styles-clean', function() {
            return styles.getCleanStylesTask();
        });
        gulp.task('_combine-all-styles', function() {
            return styles.getCombineStylesTask();
        });

        /* BOWER */
        gulp.task('_bower:css', function() {
            return bower.getBowerCssTask();
        });       
        gulp.task('_bower:fonts', function() {
            return bower.getBowerFontsTask();
        });
        gulp.task('_bower:images', function() {
            return bower.getBowerImagesTask();
        });

        /* WATCH */
        gulp.task('_startWatch', function() {
            return watch.getWatchTask();
        });

        /* DIST */
        gulp.task('_revision', function() {
            return revision.getRevisionTask();
        });

        revision.createTasksForRevReplace();

    }

    function getTasksForRevReplace() {
        return _.map(config.templates.indexes, function(file, i) {
            return 'revreplace-' + i;
        });
    }
};