var gulp = require('gulp');
var inject = require('gulp-inject');

gulp.task('index', function(){
    var target = gulp.src('client/index.html');
    var sources = gulp.src(['client/**/*.js'],{read:false});
    return target.pipe(inject(sources))
        .pipe(gulp.dest('client'));
})