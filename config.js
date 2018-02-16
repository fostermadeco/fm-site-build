/**
 * Sets up Gulp config options based on input from gulp.options.js
 * Don't edit this file if necessary, edit gulp.options.js
 */
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');

module.exports = function(options) {

    function processBowerFiles(files, bowerDir) {
        var bowerFiles = _.extend({}, files);
        bowerFiles.fonts = _.map(bowerFiles.fonts, function(file) {
            return file + '*.{woff,eot,ttf,woff2,svg}';
        });
        bowerFiles = _.each(bowerFiles, function(files, group) {
            bowerFiles[group] = _.map(files, function(file){
                return bowerDir + file;
            });
        });
        return bowerFiles;
    }

    function getSassPartialDirs(srcSass) {
        var dirs = fs.readdirSync(srcSass).filter(function(file) {
            return fs.statSync(path.join(srcSass, file)).isDirectory();
        });
        return _.map(dirs, function(dir) {
            return srcSass + dir + '/';
        });
    }

    var bower = {
        dir: options.bowerDir,
        files: processBowerFiles(options.bowerFiles, options.bowerDir)
    };

    var src = {
        dir: options.srcDir,
        sass: {
            dir: options.srcSass,
            files: options.srcSass + '*.scss',
            partials: getSassPartialDirs(options.srcSass),
        },
        js: {
            dir: options.srcJs,
            files: [
                options.srcJs + '*.js',
                options.srcJs + '**/*.js',
            ],
            vendor: {
                dir: options.srcJs + 'vendor/'
            }
        }
    };

    var dev = {
        dir: options.devDir,
        js: {
            file: 'main.js',
            modFile: 'modernizr.js'
        },
        css: {
            appFile: 'app.css',
            file: 'main.css'
        },
        vendor: {
            css: {
                file: 'vendor.css'
            }
        },
        fonts: {
            dir: options.devDir + 'fonts'
        }
    };

    var dist = {
        dir: options.distDir,
        css: {
            appFile: 'app-min.css',
            file: 'main-min.css'
        },
        js: {
            file: 'main-min.js',
            modFile: 'modernizr-min.js'
        },
        vendor: {
            css: {
                file: 'vendor-min.css'
            }
        },
        fonts: {
            dir: options.distDir + 'fonts'
        }
    };

    var config = {
        bower: bower,
        templates: {
            indexes: options.indexFiles
        },
        src: src,
        dev: dev,
        dist: dist,
        vendor: {
            dir: options.vendorDir,
            js: {
                dir: options.vendorDir + 'js/',
                files: bower.files.js.concat([options.vendorDir + 'js/*.js'])
            },
            css: {
                dir: options.vendorDir + 'css/',
                files: bower.files.css.concat([options.vendorDir + 'css/*.css'])
            }
        },
        localUrl: options.localUrl,
        modernizrOptions: options.modernizr,
        cssUrlImports: options.cssUrlImports || [],
    };

    // bower, other vendor and app
    config.allJsFiles = config.vendor.js.files.concat(config.src.js.files);
    config.allVendorCss = config.bower.files.css.concat(config.vendor.css.files);
    config.allCssFiles = config.src.sass.files;

    return config;
};