var utils           = require('../fm-build-utils')();

var gulp       = require('gulp');
var _          = require('lodash');
var argv       = require('yargs').argv;
var browserSync = require('browser-sync');

module.exports = function(isProd, config) {
    isProd = isProd;
    config = config;

    return {
        getWatchTask: getWatchTask
    };

    function getWatchTask() {
        var files = config.templates.indexes;
        files.push(config.dev.dir + '*.*');
        
        // error handling for missing files

        return _getWatchTaskBody(files);
    }

    /**
     * Start browser-sync and watch css and js
     */
    function _getWatchTaskBody(files) {    
        utils.logStart("Starting watch");
        
        var proxy = argv.proxy || config.localUrl;

        var watchOptions = {
            proxy: proxy,
            files: files,
            ghostMode: { // these are the defaults t,f,t,t
                clicks: true,
                location: false,
                forms: true,
                scroll: true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'info',
            notify: true,
            reloadDelay: 0 //1000
        };

        browserSync(watchOptions);

        function reload() {
            browserSync.reload();
        }

        gulp.watch(config.allCssFiles, ['_styles']);
        gulp.watch(config.allJsFiles, ['_scripts']);
        gulp.watch(config.templates.indexes).on('change', reload);
    }
};

