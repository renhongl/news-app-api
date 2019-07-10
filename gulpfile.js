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
const { exec } = require('child_process');
const open = require('gulp-open');
const os = require('os');
const livereload = require('gulp-livereload');

livereload({ start: true });

//For system notification
const notify = function (cb) {
    notifier.notify(
        {
            title: 'Server Action',
            message: 'Starting Server...'
        }
    );
    cb();
}

//For live load swagger
const liveLoad = function (cb) {
    return gulp.src('./static/doc/api.json')
        .pipe(livereload());
}

//For watch js file
const watch = function (cb) {
    livereload.listen();
    return gulp.watch('./static/doc/api.json', parallel(liveLoad));
}

//Command for generate swagger json file
const generateSwagger = function () {
    exec('npx swagger-jsdoc -d ./swaggerDef.js -o ./static/doc/api.json', function (error) {
        if (error) {
            console.log(error);
        }
        console.log('Generated swagger json');
    });
}

//For serve application
const serve = function (cb) {
    generateSwagger();
    return nodemon({
        script: './app.js',
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
        generateSwagger();
    });
}

const browser = os.platform() === 'linux' ? 'google-chrome' : (
    os.platform() === 'darwin' ? 'google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));

//For open browser automatically
const openBrowser = function (cb) {
    return gulp.src(__filename)
        .pipe(open({ app: browser, allowEmpty: true, uri: 'http://localhost:3000/doc' }));
}

exports.serve = series(notify, parallel(serve, openBrowser, watch));
exports.watch = watch;
