var gulp = require('gulp'),
	$ = require('gulp-load-plugins')({ lazy: true });
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
sassSources = [sourceDir + 'assets/components/sass/main.scss'];
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
	.pipe(gulp.dest(outputDir + 'assets/css/'))
	.pipe($.connect.reload());
});

gulp.task('html', function(){
	gulp.src(sourceDir + '*.html')
	.pipe($.if(env==='production', $.htmlmin({collapseWhitespace: true})))
	.pipe(gulp.dest(outputDir))
	.pipe($.connect.reload());
});
gulp.task('images', function(){
	gulp.src(imgSources)
	.pipe($.newer(outputDir + 'assets/images'))
	.pipe($.if(env==='production', $.imagemin({
		progressive: true,
		svgoPlugin: [{removeViewBox: false}],
		use: [pngcrush()]
	})))
	.pipe(gulp.dest(outputDir + 'assets/images'))
	.pipe($.connect.reload());
});

gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe($.if(env==='production', $.uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe($.connect.reload());
});

gulp.task('json', function(){
	gulp.src('builds/development/js/*.json')
	.pipe($.if(env==='production', $.jsonminify()))
	.pipe(gulp.dest(outputDir + 'assets/json'))
	.pipe($.connect.reload());
});

gulp.task('connect', function(){
	$.connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('watch', function(){
	gulp.watch(jsSources, ['js']);
	gulp.watch(jsonSources, ['json']);
	gulp.watch(sassSources, ['sass']);
	gulp.watch(imgSources, ['images']);
	gulp.watch(htmlSources, ['html']);
});

gulp.task('default', ['html', 'sass', 'js', 'images', 'connect',  'json', 'watch']);