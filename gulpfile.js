var gulp		= require('gulp'),
	browserSync = require('browser-sync'),
	autoPrefixer= require('gulp-autoprefixer'),
	concat		= require('gulp-concat'),
	jade		= require('gulp-jade'),
	less		= require('gulp-less'),
	sass        = require('gulp-sass');
	minifyCSS	= require('gulp-minify-css'),
	print		= require('gulp-print'),
	rename		= require('gulp-rename'),
	uglify		= require('gulp-uglify'),
	setPrefix = [
		'last 2 version',
		'> 1%',
		'opera 12.1', 
		'safari 6',
		'ie 9',
		'bb 10',
		'android 4'
	],
	files = {
		template : {
			watch	: "template/**/*.jade",
			source 	: "template/*.jade",
			dest 	: "public/"
		},
		less : {
			watch 	: "less/**/*.less",
			source 	: "less/style.less",
			dest 	: "public/assets/css/"
		},
		sass : {
			watch 	: "sass/**/*.scss",
			source 	: "sass/style.scss",
			dest 	: "public/assets/css/"
		},
		js : {
			source : [
				"bower_components/jquery/dist/jquery.js",
				"bower_components/bootstrap/dist/js/bootstrap.min.js"
			],
			dest   : "public/assets/js/"
		},
		font : {
			source : [
				"bower_components/bootstrap-sass/assets/fonts/bootstrap/*"
			],
			dest   : "public/assets/fonts/"
		},
		maps : {
			dest: '../maps/'
		}
	}
;

// BrowserSync 

gulp.task('browser-sync', function () {
	browserSync({
		proxy: 'localhost:42600',
		open: false
	});
});

gulp.task('bs-reload', function () {
	browserSync.reload();
});

// Build
gulp.task('build:template', function(){
	gulp.src(files.template.source)
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest(files.template.dest))
		.pipe(print(function (file) { return file + 'has successfully created.'}));
	browserSync.reload();
});

gulp.task('build:less', function() {
	gulp.src(files.less.source)
	.pipe(less())
	.pipe(autoPrefixer(setPrefix))
	.pipe(gulp.dest(files.less.dest))
	.pipe(print(function (file) { return file + 'has succesfully created.'}))
	.pipe(browserSync.reload({ stream: true }))
	.pipe(rename('style.min.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest(files.less.dest))
	.pipe(print(function(file){ return file + 'succesfully created.' }))
	.pipe(browserSync.reload({ stream: true}));
});

gulp.task('build:sass', function() {
	gulp.src(files.sass.source)
	.pipe(sass())
	.pipe(autoPrefixer(setPrefix))
	.pipe(gulp.dest(files.sass.dest))
	.pipe(print(function (file) { return file + 'has succesfully created.'}))
	.pipe(browserSync.reload({ stream: true }))
	.pipe(rename('style.min.css'))
	.pipe(minifyCSS())
	.pipe(gulp.dest(files.sass.dest))
	.pipe(print(function(file){ return file + 'succesfully created.' }))
	.pipe(browserSync.reload({ stream: true}));
});
gulp.task('build:js', function(){
	gulp.src(files.js.source)
	.pipe(concat('core.js'))
	.pipe(gulp.dest(files.js.dest))
	.pipe(print(function (file) { return file + ' has succesfully created.' }));
	browserSync.reload();
});

//Watch files
gulp.task('watch', function() {
	gulp.watch(files.template.watch, function(file) {
		gulp.src(file.path).pipe(print(function(file) { return file + 'has modified.'}));
		gulp.start('build:template');
	});
	
	gulp.watch(files.less.watch, function (file) {
		gulp.src(file.path).pipe(print(function (file) { return file + 'has modified.'}));
		gulp.start('build:less');
	});
	gulp.watch(files.js.source, 
	function (file){
		gulp.src(file.path).pipe(print(function(file){
			return file + ' has modified.'
		}));
		gulp.start('build:js');
	});
	gulp.watch(files.sass.watch, function (file) {
		gulp.src(file.path).pipe(print(function (file) { return file + 'has modified.'}));
		gulp.start('build:sass');
	});
});

//default
gulp.task('default', ['browser-sync', 'build:template', 'build:less', 'build:sass', 'build:js', 'watch']);