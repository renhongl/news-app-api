/**
 * Gulpfile for news-app-api
 * @feature start server by run koa application
 * @feature system notify when start or restart server
 * @feature pretty developing code to predefine format
 */


const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notifier = require('node-notifier');
const { series, parallel } = gulp;
const prettier = require('@bdchauvette/gulp-prettier');

const notify = function(cb) {
    notifier.notify(
        {
            title: 'Server Action',
            message: 'Starting Server...'
        }
    );
    cb();
}

const prettify = function(cb) {
    gulp.src('./src/**/*.js')
    .pipe(prettier({
        singleQuote: true,
        trailingComma: 'all'
    }))
    .pipe(gulp.dest(file => file.base))
}

const watch = function(cb) {
    gulp.watch('./src/**/*.js', series(prettify));
}

const serve = function(cb) {
    return nodemon({
        script: './src/index.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' },
        done: cb
    }).on('restart', function () {
        notifier.notify(
            {
                title: 'Server Action',
                message: 'Restarting Server...'
            }
        );
    });
}

exports.serve = series(notify, parallel(serve));
