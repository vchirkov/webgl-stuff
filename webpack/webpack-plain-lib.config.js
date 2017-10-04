/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');

const lib = require('./webpack-lib.config');
const externals = require('./webpack-externals.config');

module.exports = merge({}, lib, externals, {
    name: 'lib-plain',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.plain.js'
    }
});