var utils           = require('../fm-build-utils')();
var env             = require('../env')();

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
module.exports = function(config) {
    var isProd;
    config = config;

    return {
        getStylesStream: getStylesStream,
        getCleanStylesStream: getCleanStylesStream,
        getCombineStylesStream: getCombineStylesStream
    };

    ////////////

    function getStylesStream() {
        isProd = env.isProd();
        var src = config.allCssFiles;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var destFile = isProd ? config.dist.css.appFile : config.dev.css.appFile;

        // an error is thrown anyway 
        if (!utils.checkIfDirExists(dest)) {
            utils.logError('Stylesheet dest dir does not exist: ' + dest);
            return;    
        }

        return _getStylesStreamBody(src, dest, destFile);
    }

    /*
     * Processes Sass files and creates new combined file.
     */
    function _getStylesStreamBody(src, dest, destFile) {

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

    function getCleanStylesStream() {
        return _getCleanStylesBody();
    }

    /*
     * Deletes production style files
     * Dist specific.
     */
    function _getCleanStylesBody() {
        var appFile = config.dist.css.appFile;
        var vendorFile = config.dist.vendor.css.file;
        var dest = config.dist.dir;
        var filesToDelete = [
            dest + vendorFile,
            dest + appFile
        ];

        return del(filesToDelete);
    }

    /*
     * Returns 
     * Dist specific.
     */
    function getCombineStylesStream() {
        var dest = config.dist.dir;
        var vendorFile = config.dist.vendor.css.file;
        var appFile = config.dist.css.appFile;
        var destFile = config.dist.css.file;

        var src = [
            dest + vendorFile,
            dest + appFile
        ];
        return _getCombineStylesStreamBody(src, dest, destFile);
    }

    /**
     * Combines two already created files: vendor.css and main.css,
     * just for dist because source maps need to be in place for dev
     * @return {Stream} 
     */
    function _getCombineStylesStreamBody(src, dest, destFile) {
        utils.logStart('Combining vendor and app styles');
        utils.logSrc(src);

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(concat(destFile))
            .pipe(vinylPaths(del))
            .pipe(gulp.dest(dest));
    }

};