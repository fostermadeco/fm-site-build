var utils           = require('../fm-build-utils')();

var gulp            = require('gulp');
var cond            = require('gulp-if');
var sass            = require('gulp-sass');
var plumber         = require('gulp-plumber');
var gulpChanged     = require('gulp-changed');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var cleanCss        = require('gulp-clean-css');
var rename          = require('gulp-rename');
var del             = require('del');
var vinylPaths      = require('vinyl-paths');
var concat = require('gulp-concat');

/**
 */
module.exports = function(isProd, config) {
    isProd = isProd;
    config = config;

    return {
        getStylesTask: getStylesTask,
        getCleanStylesTask: getCleanStylesTask,
        getCombineStylesTask: getCombineStylesTask
    };

    ////////////

    function getStylesTask() {
        var src = config.allCssFiles;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var destFile = isProd ? config.dist.css.appFile : config.dev.css.appFile;

        // an error is thrown anyway 
        // if (!utils.checkIfDirExists(dest)) {
        //     utils.logError('Stylesheet dest dir does not exist: ' + dest);
        //     return;    
        // }

        // return gulp.task('styles', function() {
        //     _getStylesTaskBody(src, dest, destFile);
        // });
        return _getStylesTaskBody(src, dest, destFile);
    }

    function _getStylesTaskBody(src, dest, destFile) {

        utils.logStart("Processing styles");
        utils.logSrc(src);
        utils.logDest(dest + destFile);

        var sassPaths = config.src.sass.partials;

        return gulp.src(src)
            .pipe(cond(!isProd, gulpChanged(dest)))
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(cond(!isProd, sourcemaps.init()))
            .pipe(sass({
                includePaths: sassPaths
            }))
            .pipe(autoprefixer({browsers: ['last 2 versions', 'Explorer >= 8']}))
            .pipe(cond(!isProd, sourcemaps.write()))
            .pipe(cond(isProd, cleanCss()))
            .pipe(rename(destFile))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Done compiling sass for dest: " + dest + destFile);
            });
    }

    function getCleanStylesTask() {
        return _getCleanStylesTaskBody();
    }

    /*
     *   
     */
    function _getCleanStylesTaskBody() {
        var appFile = config.dist.css.appFile;
        var vendorFile = config.dist.vendor.css.file;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var filesToDelete = [
            dest + vendorFile,
            dest + appFile
        ];

        return del(filesToDelete);
    }

    function getCombineStylesTask() {
        var dest = config.dist.dir;
        var vendorFile = config.dist.vendor.css.file;
        var appFile = config.dist.css.appFile;
        var destFile = config.dist.css.file;

        var src = [
            dest + vendorFile,
            dest + appFile
        ];
        return _getCombineStylesTaskBody(src, dest, destFile);
    }

    /**
     * @function Combines two already created files: vendor.css and main.css,
     * just for dist because source maps need to be in place for dev
     * @return {Stream} 
     */
    function _getCombineStylesTaskBody(src, dest, destFile) {
        utils.logStart('Combining vendor and app styles');
        utils.logSrc(src);

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(concat(destFile))
            .pipe(vinylPaths(del))
            .pipe(gulp.dest(dest));
    }

};