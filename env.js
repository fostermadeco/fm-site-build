module.exports = function() {

    return {
        setToProd: setToProd,
        isProd: isProd
    };

    //////////////

    function setToProd() {
        process.env.NODE_ENV = 'production';
    }

    function isProd() {
        return process.env.NODE_ENV === 'production';
    }

};