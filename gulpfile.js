/**
 * Created by vlad.chirkov on 10/4/17.
 */
const gulp = require('gulp');
const gutil = require('gulp-util');
const gclean = require('gulp-clean');
const webpack = require('webpack');
const sequance = require('run-sequence');

const lib = require('./webpack/webpack-lib.config');
const es5 = require('./webpack/webpack-lib-es5.config');
const min = require('./webpack/webpack-lib-min.config');

const plainLib = require('./webpack/webpack-plain-lib.config');
const plainES5 = require('./webpack/webpack-plain-lib-es5.config');
const plainMin = require('./webpack/webpack-plain-lib-min.config');

const demo = require('./webpack/webpack-demo.config');


gulp.task('clean', function (done) {
    gulp.src('./dist', {read: false})
        .pipe(gclean())
        .pipe(done);
});

gulp.task('lib', function (done) {
    runWebpack(lib, done);
});

gulp.task('es5', function (done) {
    runWebpack(es5, done);
});

gulp.task('min', function (done) {
    runWebpack(min, done);
});

gulp.task('plain-lib', function (done) {
    runWebpack(plainLib, done);
});

gulp.task('plain-es5', function (done) {
    runWebpack(plainES5, done);
});

gulp.task('plain-min', function (done) {
    runWebpack(plainMin, done);
});

gulp.task('demo', function (done) {
    runWebpack(demo, done);
});

gulp.task('build-full', function (done) {
    sequance(['lib', 'es5', 'min'], done);
});

gulp.task('build-plain', function (done) {
    sequance(['plain-lib', 'plain-es5', 'plain-min'], done);
});

gulp.task('build', function (done) {
    sequance('clean', ['build-full', 'build-plain', 'demo'], done);
});


// common function to run webpack
function runWebpack(config, done) {
    webpack(config, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack', err);
        gutil.log('[webpack]', stats.toString({colors: true}));
        done();
    });
}