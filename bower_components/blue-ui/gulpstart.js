'use strict';

var gulp = require('gulp'),
	gutil = require('gulp-util'),
	clean = require('gulp-clean');

gulp.task('init', function () {
	gutil.log('Removing the current gulpfile');
	gulp.src('./gulpfile.js', {read: false})
		.pipe(clean());
})

gulp.task('copyDistGulpfile', ['init'], function () {
	gulp.src('./node_modules/blue-build/dist/gulpfile.js')
		.pipe(gulp.dest('./'));
});

gulp.task('default', ['copyDistGulpfile']);