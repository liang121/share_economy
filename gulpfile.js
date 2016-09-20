var gulp = require('gulp');
var inject = require('gulp-inject');
var $ = require('gulp-load-plugins')({lazy: true});



gulp.task('build', ['wireup-dependencies', 'create-teplatecache'], optimize);
gulp.task('wireup-dependencies', wireUpDependencies);
gulp.task('create-templatecache', ['clean-templatecache'], createTemplateCache);


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




function optimize() {
    _log('Optimizing the js, css, and html');

    // Filters are named for the gulp-useref path
    // var cssFilter = $.filter('**/*.css', {restore: true});
    // var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
    // var jslibFilter = $.filter('**/' + config.optimized.lib, {restore: true});

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
            PORT: port,
            NODE_ENV: isDev === true ? 'dev' : 'build'
        },
        watch: [config.server]
    };
    if (args.verbose) {
        console.log(nodeOptions);
    }

    return $.nodemon(nodeOptions)
        .on('restart', ['vet'], function(ev) {
            _log('*** nodemon restarted');
            _log('files changed:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now ...');
                browserSync.reload({stream: false});
            }, config.browserReloadDelay);
        })
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


// gulp.task('index', function(){
//     var target = gulp.src('client/index.html');
//     var sources = gulp.src(['client/**/*.js'],{read:false});
//     return target.pipe(inject(sources))
//         .pipe(gulp.dest('client'));
// })