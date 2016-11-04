var utils           = require('../fm-build-utils')();

var gulp       = require('gulp');
var modernizr  = require('gulp-modernizr');
var uglify     = require('gulp-uglify');
var rename     = require('gulp-rename');
var cond       = require('gulp-if');

module.exports = function(isProd, config) {
    isProd = isProd;
    config = config;

    return {
        getModTask: getModTask
    };

    function getModTask(options) {
        var src = config.src.js.files;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var destFile = isProd ? config.dist.js.modFile : config.dev.js.modFile;
        
        // error handling for missing files

        return _getModTaskBody(src, dest, destFile, config.modernizrOptions);
    }

    /**
     * Builds modernizr file, list of tests to add: https://modernizr.com/download
     */
    function _getModTaskBody(src, dest, destFile, options) {

        utils.logStart("Creating modernizr file");
        utils.logDest(dest + destFile);
        
        gulp.src(src)
            .pipe(modernizr(options))
            .pipe(cond(isProd, uglify()))
            .pipe(rename(destFile))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Created modernizr file at " + dest + destFile);
            });
    }
};
