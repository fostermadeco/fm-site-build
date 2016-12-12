var utils           = require('../fm-build-utils')();
var env             = require('../env')();

var gulp            = require('gulp');
var modernizr       = require('gulp-modernizr');
var uglify          = require('gulp-uglify');
var cond            = require('gulp-if');
var plumber         = require('gulp-plumber');
var sourcemaps      = require('gulp-sourcemaps');
var cleanCss        = require('gulp-clean-css');
var rename          = require('gulp-rename');
var replace         = require('gulp-replace');
var concat          = require('gulp-concat');

module.exports = function(config) {
    var isProd;
    config = config;

    return {
        getBowerCssStream: getBowerCssStream,
        getBowerFontsStream: getBowerFontsStream,
        getBowerImagesStream: getBowerImagesStream,
    };

    function getBowerCssStream() {
        isProd = env.isProd();

        // note this includes other css in vendor folder (not bower) rethink this
        var src = config.allVendorCss;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var destFile = isProd ? config.dist.vendor.css.file : config.dev.vendor.css.file;
        
        // error handling for missing files

        return _getBowerCssStreamBody(src, dest, destFile);
    }

    /**
     * Builds vendor.css for development or production
     * Replaces ../fonts references in css with ./fonts
     * @return {Stream}
     */
    function _getBowerCssStreamBody(src, dest, destFile) {
        utils.logStart("Concatnating vendor css");
        utils.logSrc(src);
        utils.logDest(dest + destFile);
       
        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(cond(!isProd, sourcemaps.init()))
            .pipe(concat(destFile))
            .pipe(replace('url(\'../fonts', 'url(\'./fonts'))
            .pipe(cond(!isProd, sourcemaps.write()))
            .pipe(cond(isProd, cleanCss()))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Created modernizr file at " + dest + destFile);
            });

    }

    function getBowerFontsStream() {
        isProd = env.isProd();

        var src = config.bower.files.fonts;
        var dest = isProd ? config.dist.fonts.dir : config.dev.fonts.dir;
        
        // error handling for missing files

        return _getBowerFontsStreamBody(src, dest);
    }

    /**
     * Copy fonts from bower for development
     * @return {Stream}
     */
    function _getBowerFontsStreamBody(src, dest) {
        utils.logStart("Copying bower fonts");
        utils.logSrc(src);
        utils.logDest(dest);

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Copied bower fonts to " + dest);
            });

    }

    function getBowerImagesStream() {
        isProd = env.isProd();

        var src = config.bower.files.images;
        var dest = isProd ? config.dist.dir : config.dev.dir;

        // error handling for missing files

        return _getBowerImagesStreamBody(src, dest);
    }

    /**
     * Copy images files from bower
     * @return {Stream}
     */
    function _getBowerImagesStreamBody(src, dest) {
        utils.logStart("Copying bower images");
        utils.logSrc(src);
        utils.logDest(dest);
        if (src.length === 0) {
            utils.logInfo("No bower images to copy. Specify in options.");
        }

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(rename({dirname: ''}))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Copied bower images to " + dest);
            });
    }

};