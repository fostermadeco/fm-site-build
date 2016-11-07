var utils           = require('../fm-build-utils')();

var gulp         = require('gulp');
var revDelete    = require('gulp-rev-delete-original');
var revDel       = require('rev-del');
var _            = require('lodash');
var cond         = require('gulp-if');
var rev          = require('gulp-rev');
var plumber      = require('gulp-plumber');
var revCollector = require('gulp-rev-collector');

module.exports = function(config) {
    config = config;

    return {
        getRevisionStream: getRevisionStream,
        createStreamsForRevReplace: createStreamsForRevReplace
    };

    function getRevisionStream(options) {
        var dest = config.dist.dir;

        var src = [
            config.dist.dir + config.dist.js.file,
            config.dist.dir + config.dist.css.file,
            config.dist.dir + config.dist.js.modFile
        ];
        
        // error handling for missing files

        return _getRevisionStreamBody(src, dest);
    }

    /**
     * Creates a new dist version of the ts css and js.
     * @return {Stream}
     */
    function _getRevisionStreamBody(src, dest) {
        utils.logStart('Creating version of js and css.');

        utils.logSrc(src);
        utils.logDest(dest);

        return gulp.src(src)
            .pipe(plumber(utils.plumberErrorHandler))
            .pipe(rev())
            .pipe(gulp.dest(dest))
            .pipe(revDelete())
            .pipe(rev.manifest({merge: true }))
            .pipe(revDel({ dest: dest }))
            .pipe(gulp.dest(dest));
    }

    function _getDestination(file) {
        // file in root
        if (file.indexOf('/') === -1) {
            return '';
        }
        // _html/footer.html -> _html/
        return file.replace(/\/([^/]*)$/, '') + '/'; 
    }
    
    function createStreamsForRevReplace () {
        config.templates.indexes.forEach(function(file, i) {
            gulp.task('_revreplace-' + i, function() {
                var manifest = config.dist.dir + 'rev-manifest.json';
                var dest = _getDestination(file);
                // gulp-rev-collector replaces versioned revision file reference as opposed to
                // gulp-rev-replace which replaces original file listed in manifest
                return gulp.src([manifest, file])
                    .pipe(plumber(utils.plumberErrorHandler))
                    .pipe( revCollector({
                        replaceReved: true
                    }))
                    .pipe(gulp.dest(dest));
            });
        });
    }
};

