/**
 * Created by vlad.chirkov on 10/4/17.
 */
const gulp = require('gulp');
const gutil = require('gulp-util');
const gclean = require('gulp-clean');
const webpack = require('webpack');
const sequence = require('run-sequence');

const lib = require('./webpack/webpack-lib.config');
const min = require('./webpack/webpack-lib-min.config');
const plainLib = require('./webpack/webpack-plain-lib.config');
const plainMin = require('./webpack/webpack-plain-lib-min.config');
const demo = require('./webpack/webpack-demo.config');


gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(gclean());
});

gulp.task('lib', function (done) {
    runWebpack(lib, done);
});

gulp.task('min', function (done) {
    runWebpack(min, done);
});

gulp.task('plain-lib', function (done) {
    runWebpack(plainLib, done);
});

gulp.task('plain-min', function (done) {
    runWebpack(plainMin, done);
});

gulp.task('demo', function (done) {
    runWebpack(demo, done);
});

gulp.task('build-full', function (done) {
    sequence(['lib', 'min'], done);
});

gulp.task('build-plain', function (done) {
    sequence(['plain-lib', 'plain-min'], done);
});

gulp.task('build', function (done) {
    sequence('clean', ['build-full', 'build-plain', 'demo'], done);
});

// common function to run webpack
function runWebpack(config, done) {
    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
}