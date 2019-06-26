
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notifier = require('node-notifier');
const { series } = gulp;

const notify = function(cb) {
    notifier.notify(
        {
            title: 'Server Action',
            message: 'Restarting Server...'
        }
    );
    cb();
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

exports.serve = series(notify, serve);
