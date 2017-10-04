/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');

const es5 = require('./webpack-lib-es5.config');
const externals = require('./webpack-externals.config');

module.exports = merge({}, es5, externals, {
    name: 'es5-plain',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'index.plain.es5.js'
    }
});