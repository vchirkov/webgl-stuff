/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');

const lib = require('./webpack-lib.config');

module.exports = merge({}, lib, {
    name: 'es5',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }]
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.es5.js'
    }
});