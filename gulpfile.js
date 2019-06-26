
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const notifier = require('node-notifier');


gulp.task('start', function (done) {
    notifier.notify(
        {
            title: 'Server Action',
            message: 'Starting Server...'
        }
    );
    nodemon({
        script: './src/index.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' },
        done: done
    }).on('restart', function () {
        notifier.notify(
            {
                title: 'Server Action',
                message: 'Restarting Server...'
            }
        );
    });
});