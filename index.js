'use strict';
var gulp       = require('gulp');
var log        = require('gulp-util').log;
// var del        = require('del');
// var vinylPaths = require('vinyl-paths');

/**
 */
module.exports = function(isProd, config) {
    isProd = isProd;
    config = config;

    return {
        getStylesTask: getStylesTask
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

        return gulp.task('styles', function() {
            _getStylesTaskBody(src, dest, destFile);
        });
    }

    function _getStylesTaskBody(src, dest, destFile) {

        log("Compiling styles from src: " + src);

        var sassPaths = config.src.sass.partials;

        return gulp.src(src)
            // .pipe(gulpChanged(config.compiledDir))
            // .pipe($.plumber(taskSetup.plumberErrorHandler))
            .pipe($.if(!isProd(), $.sourcemaps.init()))
            .pipe($.sass({
                includePaths: sassPaths
            }))
            .pipe($.autoprefixer({browsers: ['last 2 versions', 'Explorer >= 8']}))
            .pipe($.if(!isProd(), $.sourcemaps.write()))
            .pipe($.if(isProd(), $.cleanCss()))
            .pipe($.rename(destFile))
            .pipe(gulp.dest(dest));
    }
};