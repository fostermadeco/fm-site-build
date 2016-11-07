var utils           = require('../fm-build-utils')();
var env             = require('../gulp.env')();

var gulp            = require('gulp');
var filter          = require('gulp-filter');
var babel           = require('gulp-babel');
var concat          = require('gulp-concat');
var plumber         = require('gulp-plumber');
var cond            = require('gulp-if');
var uglify          = require('gulp-uglify');
var sourcemaps      = require('gulp-sourcemaps');
var rename          = require('gulp-rename');
var log             = require('gulp-util').log;

module.exports = function(config) {
    var isProd;
    config = config;

    return {
        getScriptsStream: getScriptsStream
    };

    function getScriptsStream() {
        isProd = env.isProd();
        console.log(isProd);
        
        var src = config.allJsFiles;
        var dest = isProd ? config.dist.dir : config.dev.dir;
        var concatFile = config.dev.js.file;
        var destFile = isProd ? config.dist.js.file : config.dev.js.file;

        // error handling for missing files
        return _getScriptsStreamBody(src, concatFile, dest, destFile);
    }

    /**
     * Process Javascript files - bower, other vendor and app
     * Creates file in dev or dist depending on env
     * @return {Stream}
     */
    function _getScriptsStreamBody(src, concatFile, dest, destFile) {
        var filterVendor = filter(['./vendor'], {restore: true});

        utils.logStart("Starting scripts task:");
        utils.logSrc(src);
        utils.logDest(dest + destFile);

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(cond(!isProd, sourcemaps.init()))
            .pipe(filterVendor)
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(filterVendor.restore)
            .pipe(concat(concatFile))
            .pipe(cond(isProd, uglify()))
            .pipe(cond(isProd, rename(destFile)))
            .pipe(cond(!isProd, sourcemaps.write('./')))
            .pipe(gulp.dest(dest))
            .on('end', function() {
                utils.logEnd("Compiled scripts to " + dest + destFile);
            });
    }
};