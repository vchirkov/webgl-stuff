/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const base = require('./webpack-base.config');

module.exports = merge({}, base, {
    name: 'demo',
    entry: path.resolve(__dirname, '../demo/index.js'),
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(path.resolve(__dirname, '../demo'), 'index.html'),
                to: path.resolve(__dirname, '../dist/demo', 'index.html')
            }
        ])
    ],
    output: {
        path: path.resolve(__dirname, '../dist/demo'),
        filename: 'index.js'
    }
});