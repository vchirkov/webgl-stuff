/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');

module.exports = {
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