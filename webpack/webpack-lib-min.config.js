/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');

const libES5 = require('./webpack-lib-es5.config');

module.exports = merge({}, libES5, {
        name: 'min',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({sourceMap: false})
        ],
        output: {
            path: path.resolve(__dirname, '../dist'),
            filename: 'index.min.js'
        }
    }
);