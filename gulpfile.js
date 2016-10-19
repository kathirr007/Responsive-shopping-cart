var gulp = require('gulp'),
	$ = require('gulp-load-plugins')({ lazy: true });
	browsersync = require('browser-sync'),
	pngcrush = require('imagemin-pngcrush'),
	clean = require('del'),
	jQuery = require('jquery');

var env,
	jsSources,
	bootstrapSources,
	sassSources,
	htmlSources,
	jsonSources,
	imgSources,
	sourceDir,
	outputDir;

var sassOpts = {};

env = process.env.NODE_ENV || 'development';
sourceDir = 'sources/';
outputDir = env == 'development' ? 'builds/development/' : 'builds/production/';

bootstrapSources = './node_modules/bootstrap-sass/';
fonts = [bootstrapSources + 'assets/fonts/**/*', sourceDir + 'assets/fonts/*.*'];
imgSources = [sourceDir + 'assets/images/**/*'];

jsSources = [bootstrapSources + 'assets/javascripts/bootstrap.min.js', sourceDir + 'assets/js/*.js'];
sassSources = [sourceDir + 'assets/scss/**/*'];
htmlSources = [sourceDir + '*.html'];
jsonSources = [sourceDir + 'assets/json/*.json'];

sassOpts = {
        outputStyle : env == 'development' ? 'nested' : 'compressed',
        precison: 3,
        errLogToConsole: true,
        includePaths: [bootstrapSources + 'assets/stylesheets']
    };


gulp.task('clean', function(){
	clean(outputDir);
});



gulp.task('fonts', function(){
	gulp.src(fonts)
	.pipe(gulp.dest(outputDir + 'assets/fonts'));
});

gulp.task('sass', ['fonts'], function(){
	gulp.src(sassSources)
	.pipe($.sourcemaps.init())
	.pipe($.sass(sassOpts).on('error', $.sass.logError))
	.pipe($.autoprefixer({browsers : ["Android 2.3","Android >= 4","Chrome >= 20","Firefox >= 24","Explorer >= 8","iOS >= 6","Opera >= 12","Safari >= 6"]}))
	.pipe($.sourcemaps.write('./maps'))
	.pipe(gulp.dest(outputDir + 'assets/css/'));
});

gulp.task('html', function(){
	gulp.src(sourceDir + '*.html')
	.pipe($.if(env==='production', $.htmlmin({collapseWhitespace: true})))
	.pipe(gulp.dest(outputDir));
});
gulp.task('images', function(){
	gulp.src(imgSources)
	.pipe($.newer(outputDir + 'assets/images'))
	.pipe($.if(env==='production', $.imagemin({
		progressive: true,
		svgoPlugin: [{removeViewBox: false}],
		use: [pngcrush()]
	})))
	.pipe(gulp.dest(outputDir + 'assets/images'));
});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe($.if(env==='production', $.uglify()))
	.pipe(gulp.dest(outputDir + 'assets/js'));
});

gulp.task('json', function(){
	gulp.src(jsonSources)
	.pipe($.if(env==='production', $.jsonminify()))
	.pipe(gulp.dest(outputDir + 'assets/json'));
});

gulp.task('connect', function(){
	$.connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('browsersync', function(){
	browsersync({
    server: {
        baseDir: outputDir,
        index: 'index.html'
    },
    open: true,
    notify: true
})
});

gulp.task('watch', function(){
	gulp.watch(jsSources, ['js', browsersync.reload]);
	gulp.watch(jsonSources, ['json', browsersync.reload]);
	gulp.watch(sassSources, ['sass', browsersync.reload]);
	gulp.watch(imgSources, ['images', browsersync.reload]);
	gulp.watch(htmlSources, ['html', browsersync.reload]);
});

gulp.task('default', ['html', 'sass', 'js', 'images', 'browsersync',  'json', 'watch']);