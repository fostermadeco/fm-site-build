'use strict';
const config = require('./config.js');
const webpack = require('webpack');

module.exports = function(config, isDist) {
    return {    
        context: __dirname + '../../../public/assets/js',
        entry: {
            app: [
                'webpack/hot/dev-server',
                'webpack-hot-middleware/client',
                './app.js'
            ]
        },
        output: {
            path: __dirname + '../../../public/assets/dist',
            filename: '[name].bundle.js',
            publicPath: '/assets/dev/',
        },
        devServer: {
            contentBase: __dirname + '../../../public/assets/js',
        },
        module: {
            loaders: [{
                test: /\.js?/,
                include: __dirname + '../../../public/assets/js',
                loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015', 'webpack-module-hot-accept'],
            }],
        },
        plugins: isDist ? [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin()
        ] : [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.NoErrorsPlugin(),
            new webpack.HotModuleReplacementPlugin(),
        ],
        // resolve: {
        //     extensions: ['', '.js']
        // },
        // debug: true
    }
}