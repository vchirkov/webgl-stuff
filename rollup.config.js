import image from '@rollup/plugin-image';
import {string} from 'rollup-plugin-string';
import postcss from 'rollup-plugin-postcss'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default [{
    input: 'src/index.js',
    output: {
        file: 'dist/index.js',
        format: 'cjs'
    },
    plugins: [
        string({include: '**/*.glsl'}),
        image(),
    ]
}, {
    input: 'demo/index.js',
    output: {
        file: 'dist/demo/index.js',
        format: 'iife'
    },
    plugins: [
        string({include: '**/*.glsl'}),
        image(),
        postcss({plugins: []}),
        nodePolyfills(),
        resolve(),
        commonjs({transformMixedEsModules: true}),
    ]
}];
