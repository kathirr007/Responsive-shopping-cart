var gulp = require('gulp'),
	$ = require('gulp-load-plugins')({ lazy: true });
	pngcrush = require('imagemin-pngcrush'),
	clean = require('del');

var env,
	jsSources,
	sassSources,
	htmlSources,
	jsonSources,
	sassStyle,
	sourceDir,
	outputDir;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle = 'expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle = 'compressed';
}

sourceDir = 'sources/';
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = ['components/scripts/rclick.js',
				 'components/scripts/pixgrid.js',
				 'components/scripts/tagline.js',
				 'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [sourceDir + '*.html'];
jsonSources = [sourceDir + 'js/*.json'];


gulp.task('js', function(){
	gulp.src(jsSources)
	.pipe(concat('script.js'))
	.pipe(browserify())
	.pipe(gulpif(env==='production', uglify()))
	.pipe(gulp.dest(outputDir + 'js'))
	.pipe(connect.reload())
});

gulp.task('compass', function(){
	gulp.src(sassSources)
	.pipe(compass({
		sass: 'components/sass',
		css: outputDir + 'css',
		images: outputDir + 'images',
		style: sassStyle
	}))
		.on('error', gutil.log)
	// .pipe(gulp.dest('builds/development/css'))
	.pipe(connect.reload())
});

gulp.task('html', function(){
	gulp.src('builds/development/*.html')
	.pipe(gulpif(env==='production', minifyhhtml()))
	.pipe(gulpif(env==='production', gulp.dest(outputDir)))
	.pipe(connect.reload())
});
gulp.task('images', function(){
	gulp.src('builds/development/images/**/*.*')
	.pipe(gulpif(env==='production', imagemin({
		progressive: true,
		svgoPlugin: [{removeViewBox: false}],
		use: [pngcrush()]
	})))
	.pipe(gulpif(env==='production', gulp.dest(outputDir + 'images')))
	.pipe(connect.reload())
});

gulp.task('json', function(){
	gulp.src('builds/development/js/*.json')
	.pipe(gulpif(env==='production', minifyhhtml()))
	.pipe(gulpif(env==='production', gulp.dest(outputDir + 'js')))
	.pipe(connect.reload())
});

gulp.task('connect', function(){
	connect.server({
		root: outputDir,
		livereload: true
	});
});

gulp.task('watch', function(){
	gulp.watch(coffeeSources, ['coffee']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('builds/development/js/*.json', ['json']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
	gulp.watch('builds/development/*.html', ['html']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'images', 'connect', 'html', 'json', 'watch']);