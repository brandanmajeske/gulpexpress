// MODULE DEPENDENCIES //

var gulp = require('gulp');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var notify = require('gulp-notify');
var sass = require('gulp-ruby-sass');
var _if = require('gulp-if');
var isWindows = /^win/.test(require('os').platform());
var lr;
var EXPRESS_PORT = 3000;
var EXPRESS_ROOT = __dirname;
var LIVERELOAD_PORT = 35729;

if(isWindows){
	gutil.log(gutil.colors.bgGreen("Is it Windows? " + isWindows));	
}

// 	LIVE RELOAD //

function startLiveReload(){
	lr = require('tiny-lr')();
	lr.listen(LIVERELOAD_PORT);
}


// EXPRESS //

function startExpress(){

	// Dependencies for Express

	var express = require('express');
	var routes = require('./routes');
	var http = require('http');
	var path = require('path');
	var app = express();

	app.set('port', process.env.PORT || EXPRESS_PORT);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon('public/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(require('connect-livereload')());
	app.use(express.json());
	app.use(express.urlencoded());	
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(EXPRESS_ROOT, 'public')));



	// Development Only
	if('development' == app.get('env')){
		app.use(express.errorHandler());
	}

	// Routes
	app.get('/', routes.index);
	app.get('/helloworld', routes.helloworld);

	
	// Start Server 
	http.createServer(app).listen(EXPRESS_PORT, function(){
		gutil.log(gutil.colors.cyan('Express server listening on port ' + EXPRESS_PORT));
	});

}


// NOTIFY LIVE-RELOAD //

function notifyLiveReload(event) {
	var fileName = require('path').relative(EXPRESS_ROOT+'/public', event.path);

	lr.changed({
		body: {
			files: [fileName]
		}
	});	
}

// RELOAD //

function reload(sass,autoprefixer,notify){

	return gulp.src('sass/styles.scss')
		.pipe(sass({style: 'compressed'}))
		.pipe(autoprefixer('last 15 versions'))
		.pipe(gulp.dest('public/stylesheets'))
		.pipe(_if(!isWindows, notify({ message: 'That\'s All Folks!'})));
}

// UGLIFY //

function jsUglify(uglify, concat, gutil){
	gutil.log(gutil.colors.bgBlue('Uglifying your JavaScript!'));
	return gulp.src(EXPRESS_ROOT+'/public/javascripts/*.js')
			.pipe(uglify({ mangle: true, compress: true}))
			.pipe(concat('main.min.js'))
			.pipe(gulp.dest(EXPRESS_ROOT+'/public/javascripts/min/'));
}


// GULP //

gulp.task('default', function(){
	startExpress();
	startLiveReload();
	jsUglify(uglify, concat, gutil);
	reload(sass, autoprefixer, notify);

	gulp.watch('public/**/*.html', notifyLiveReload);

	gulp.watch('public/stylesheets/*.css', notifyLiveReload);
	
	gulp.watch('views/*.jade', notifyLiveReload);
	
	gulp.watch('public/javascripts/*.js', notifyLiveReload);
	

	gulp.watch('public/javascripts/*.js', function(){
		return jsUglify(uglify, concat, gutil);
	});

	gulp.watch('sass/**/*.scss', function(){
		
		return reload(sass, autoprefixer, notify);
	});


});