var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var path = require('path');
var inject = require('gulp-inject');

var $ = require('gulp-load-plugins')({lazy: true});



gulp.task('build', ['wireup-dependencies', 'create-teplatecache'], optimize);
gulp.task('wireup-dependencies', wireUpDependencies);
gulp.task('create-templatecache', ['clean-templatecache'], createTemplateCache);
gulp.task('clean-templatecache', cleanTemplateCache);
gulp.task('serve-dev', function() { serve(true); });


function _bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        _formatPercent(1 - data.percent, 2) + '%' + difference;
}


function createTemplateCache() {
    _log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.htmlmin({collapseWhitespace: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(_bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
}

function cleanTemplateCache(done) {
    var files = [].concat(config.temp + config.templateCache.file);
    _clean(files, done);
}


function optimize() {
    _log('Optimizing the js, css, and html');

    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css', {restore: true});
    var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
    var jslibFilter = $.filter('**/' + config.optimized.lib, {restore: true});

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(_inject(templateCache, 'templates'))
        .pipe($.useref({searchPath: './'}))
        // Get the css
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)
        //Get the custom javascript
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify())
        .pipe(_getHeader())
        .pipe(jsAppFilter.restore)
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore)
        .pipe(gulp.dest(config.build));
}

function serve(isDev) {
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            PORT: 9000,
            NODE_ENV: isDev === true ? 'dev' : 'build'
        },
        watch: [config.server]
    };
    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('start', function() {
            _log('*** nodemon started');
            _startBrowserSync(isDev === true);
        })
        .on('crash', function() {
            _log('*** nodemon crashed: script crashed for some reason');
        })
        .on('exit', function() {
            _log('*** nodemon exited cleanly');
        });
}

function wireUpDependencies() {
    _log('Wiring JavaScript dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    var js = args.stubs ? [].concat(config.js, config.stubsjs) : config.js;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(_inject(js, '', config.jsOrder))
        .pipe(_inject(config.appBootstrap, 'bootstrap'))
        .pipe(gulp.dest(config.client));
}


function _clean(path, done) {
    _log('Cleaning: ' + $.util.colors.blue(path));
    del(path)
        .then(function() {
            done();
        });
}

function _log(msg) {
    if (typeof msg === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
// gulp.task('index', function(){
//     var target = gulp.src('client/index.html');
//     var sources = gulp.src(['client/**/*.js'],{read:false});
//     return target.pipe(inject(sources))
//         .pipe(gulp.dest('client'));
// })