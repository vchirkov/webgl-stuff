/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const base = require('./webpack-base.config');

module.exports = merge({}, base, {
    name: 'docs',
    entry: path.resolve(__dirname, '../docs/index.js')
});