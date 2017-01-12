var utils       = require('../fm-build-utils')();
var env         = require('../env')();

var gulp        = require('gulp');
var _           = require('lodash');
var argv        = require('yargs').argv;
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

module.exports = function(config) {
    var isProd = env.isProd();
    config = config;
    var settings = require('../webpack.config')(config, isProd);
    var bundler = webpack( settings );

    return {
        getWatchStream: getWatchStream
    };

    function getWatchStream() {
        var files = config.templates.indexes;
        files.push(config.dev.dir + '*.*');
        
        // error handling for missing files

        return _getWatchStreamBody(files);
    }

    /**
     * Start browser-sync and watch css and js
     */
    function _getWatchStreamBody(files) {    
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
            https: true,
            cors: true,
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'info',
            notify: true,
            reloadDelay: 0,
            middleware: [
                webpackDevMiddleware(bundler, {
                    publicPath: '/assets/dev',
                    stats: { colors: true }
                }),
                webpackHotMiddleware(bundler)
            ]
        };

        browserSync(watchOptions);

        function reload() {
            browserSync.reload();
        }

        console.log(config.allJsFiles);

        gulp.watch(config.allCssFiles, ['_styles']);
        gulp.watch(config.allJsFiles, ['_scripts']);
        gulp.watch(config.templates.indexes).on('change', reload);
    }
};

