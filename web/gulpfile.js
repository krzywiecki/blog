var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var notify = require('gulp-notify');
var ftp = require('gulp-ftp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var imageop = require('gulp-image-optimization');

var CONFIG = {
	root: './',
	ftp: {
		host: '',
		user: '',
		pass: '',
		remotePath: ''
	},
};

gulp.task('sass', function () {
	var g = sass(CONFIG.root + 'sass/layout.scss', { style: 'compressed', cacheLocation: '../app/cache/sass' })
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest(CONFIG.root + 'dist/css'))
	.pipe(notify({ message: 'Finished compile SASS files'}));

	if ( CONFIG.ftp.host ) {
		g.pipe(ftp({
			host: CONFIG.ftp.host,
			user: CONFIG.ftp.user,
			pass: CONFIG.ftp.pass,
			remotePath: CONFIG.ftp.remotePath + 'dist/css/'
		})).pipe(notify({ message: 'layout.css uploaded'}));
	};

	return g;
});

gulp.task('app.js', function() {
  var g = gulp.src(CONFIG.root + 'js/app.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(CONFIG.root + 'dist/js'))
    .pipe(notify({ message: 'app.min.js created'}));

    if ( CONFIG.ftp.host ) {
		g.pipe(ftp({
			host: CONFIG.ftp.host,
			user: CONFIG.ftp.user,
			pass: CONFIG.ftp.pass,
			remotePath: CONFIG.ftp.remotePath + 'dist/js/'
		})).pipe(notify({ message: 'app.min.js uploaded'}));
	};

	return g;
});

gulp.task('sprite-upload', function () {
	return gulp.src(CONFIG.root + 'img/sprite*.png')
	.pipe(ftp({
		host: CONFIG.ftp.host,
		user: CONFIG.ftp.user,
		pass: CONFIG.ftp.pass,
		remotePath: CONFIG.ftp.remotePath + 'dist/img/'
	})).pipe(notify({ message: 'sprite.png uploaded'}));
});

gulp.task('images', function(cb) {
    gulp.src(['img/**/*.png','img/**/*.jpg','img/**/*.gif','img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest('dist/img')).on('end', cb).on('error', cb);
});

gulp.task('default', function() {
    gulp.watch(CONFIG.root + 'sass/**/*.scss', ['sass']);

    if ( CONFIG.ftp.host ) {
	    gulp.watch(CONFIG.root + 'sass/modules/_sprites.scss', ['sprite-upload']);
	}

    gulp.watch(CONFIG.root + 'js/app.js', ['app.js']);
    gulp.watch(CONFIG.root + 'js/libs/*.js', ['libs.js']);
});

gulp.task('build', ['sass', 'app.js', 'images']);
