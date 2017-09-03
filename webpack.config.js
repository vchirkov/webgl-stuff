const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        test: './test/index.js'
    },
    output: {
        filename: '[name].js',
        libraryTarget: "umd",
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.glsl$/,
                use: 'text-loader'
            },
            {
                test: /\.png/,
                use: 'base64-image-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(path.resolve(__dirname, './test'), 'index.html'),
                to: path.resolve(__dirname, './dist', 'test.html')
            }
        ])
    ],
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0'
    },
    devtool: 'source-map'
};