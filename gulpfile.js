// npm install --save-dev gulp gulp-uglify gulp-concat yargs gulp-changed gulp-plumber browser-sync gulp-clean
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var yargs = require('yargs').argv;
var browserSync = require('browser-sync');
var gulpSequence = require('gulp-sequence');

var srcPath = __dirname + '/src',
    distPath = __dirname + '/dist';
	
var _line = function (msg) {
	console.log('============================================================================');
	console.log(msg);
	console.log('============================================================================');
};


gulp.task('build', gulpSequence('clean', 'build:copy'));
gulp.task('clean', function () {
    return gulp.src(distPath)
        .pipe(clean());
});

gulp.task('build:copy', function () {
    return gulp.src(['src/**'])
        .pipe(plumber())
        .pipe(changed(distPath))
        .pipe(gulp.dest(distPath));
});

gulp.task('browserSync:reload', function () {
    return browserSync.reload({ stream: true });
});

gulp.task('watch:copy', gulpSequence('build:copy', 'browserSync:reload'));

gulp.task('watch', function () {
	_line('watch');
    return gulp.watch(['src/**'], ['watch:copy']);
});

gulp.task('server', function () {
	_line('server');
    yargs.p = yargs.p || 8088;
    var index = '/index.html';
    browserSync.init({
        server: {
            baseDir: "./dist"
        },
        ui: {
            port: yargs.p + 1,
            weinre: {
                port: yargs.p + 2
            }
        },
        port: yargs.p,
        open: "external",
        //startPath: '/demo/box.html'
        startPath: index
    });
});


// 参数说明
//  -w: 实时监听
//  -s: 启动服务器
//  -p: 服务器启动端口，默认8088
gulp.task('default', ['build'], function (cp) {
	var list = [];
	if (yargs.s) {
		list.push('server');
	}

	if (yargs.w) {
		list.push('watch');
	}
	if (list.length > 0)
		gulpSequence.apply(gulpSequence, list)(cp);
});
