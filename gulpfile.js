/**
 * Created by vlad.chirkov on 10/4/17.
 */
const gulp = require('gulp');
const gutil = require('gulp-util');
const gclean = require('gulp-clean');
const sequence = require('run-sequence');

const webpack = require('webpack');
const merge = require('webpack-merge');

const lib = require('./webpack/webpack-lib.config');
const min = require('./webpack/webpack-lib-min.config');
const plainLib = require('./webpack/webpack-plain-lib.config');
const plainMin = require('./webpack/webpack-plain-lib-min.config');
const demo = require('./webpack/webpack-demo.config');


gulp.task('clean', () => gulp.src('./dist', {read: false}).pipe(gclean()));

gulp.task('lib', done => runWebpack(lib, done));

gulp.task('min', done => runWebpack(min, done));

gulp.task('plain-lib', done => runWebpack(plainLib, done));

gulp.task('plain-min', done => runWebpack(plainMin, done));

gulp.task('demo', done => runWebpack(demo, done));

gulp.task('watch', (done) => runWebpack(merge(demo, {watch: true}), done));

gulp.task('build-full', done => sequence(['lib', 'min'], done));

gulp.task('build-plain', done => sequence(['plain-lib', 'plain-min'], done));

gulp.task('build', done => sequence('clean', ['build-full', 'build-plain', 'demo'], done));

function runWebpack(config, done) {
    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError('webpack', err);

        gutil.log('[webpack]', stats.toString({colors: true}));

        if (config.watch) {
            gutil.log(gutil.colors.magenta('Watching...'));
        } else {
            done && done();
        }
    });
}