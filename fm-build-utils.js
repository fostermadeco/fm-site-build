var notify      = require('gulp-notify');
var util        = require('gulp-util');
var log         = util.log;
var fs          = require('fs');
var _           = require('lodash');

module.exports = function() {
    var notifyInfo = {
        title: 'Gulp'
    };

    return {
        plumberErrorHandler: plumberErrorHandler,
        checkIfFileExists: checkIfFileExists,
        checkIfDirExists: checkIfDirExists,
        logStart: logStart,
        logEnd: logEnd,
        logList: logList,
        logInfo: logInfo,
        logSrc: logSrc, 
        logDest: logDest,
        logError: logError,
    };

    //////////

    function plumberErrorHandler() {
        errorHandler: notify.onError({
            title: notifyInfo.title,
            message: 'Error: <%= error.message %>'
        });
    }

    function checkIfFileExists(fileName) {
        return fs.existsSync(fileName, fs.F_OK);
    }

    function checkIfDirExists(path) {
        return fs.statSync(path);
    }

    function logStart(msg) {
        log(util.colors.bgBlue("::START::"), msg);
    }

    function logEnd(msg) {
        log(util.colors.bgGreen(":: END ::"), msg);
    }

    function logList(list) {
        if (_.isArray(list)) {
            items = _.map(list, function(item) {
                log("          -> " + item);
            });
        } else {
            log("          -> " + list);
        }
    }

    function logSrc(list) {
        log("          SOURCE:");
        logList(list);
    }

    function logDest(list) {
        log("          DESTINATION:");
        logList(list);
    }

    function logInfo(msg) {
        log(":: INFO ::", msg);
    }

    function logError(msg) {
        log(util.colors.bgRed("::ERROR!:: " + msg));
    }

};
