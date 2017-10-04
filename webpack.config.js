const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
    entry: {
        index: './src/index.js',
        test: './demo/index.js'
    },
    output: {
        filename: '[name].js',
        libraryTarget: 'umd',
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
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0'
    },
    devtool: 'source-map'
};

const libConfig = Object.assign({}, config, {
    name: 'lib',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index.js'
    }
});

const demoConfig = Object.assign({}, config, {
    name: 'demo',
    entry: './demo/index.js',
    output: {
        path: path.resolve(__dirname, './dist/demo'),
        filename: 'index.js'
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.join(path.resolve(__dirname, './demo'), 'index.html'),
                to: path.resolve(__dirname, './dist/demo','index.html')
            }
        ])
    ],
});


module.exports = [libConfig, demoConfig];