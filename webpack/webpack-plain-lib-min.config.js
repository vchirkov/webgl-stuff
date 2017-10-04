/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');

const min = require('./webpack-lib-min.config');
const externals = require('./webpack-externals.config');

module.exports = merge({}, min, externals, {
    name: 'min-plain',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.plain.min.js'
    }
});