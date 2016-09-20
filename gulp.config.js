module.exports = function() {
    var client = './src/client/';
    var server = './src/server/';
    var clientApp = client + 'app/';
    var report = './report/';
    var root = './';
    var specRunnerFile = 'specs.html';
    var temp = './.tmp/';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({devDependencies: true}).js;
    var bower = {
        json: require('./bower.json'),
        directory: './bower_components/',
        ignorePath: '../..'
    };
    var nodeModules = 'node_modules';

    var config = {
        /**
         * File paths
         */
        // all javascript that we want to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: client + 'styles/**/*.css',
        sasscss: temp + 'mws.css',
        fonts: bower.directory + 'font-awesome/fonts/**/*.*',
        html: client + '**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client + 'images/**/*.*',
        index: client + 'index.html',
        // app js, with no specs
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js',
            '!' + clientApp + '**/app.bootstrap.js'
        ],
        jsOrder: [
            '**/app.module.js',
            '**/*.module.js',
            '**/*.js'
        ],
        appBootstrap: clientApp + '**/app.bootstrap.js',
        sass: client + 'styles/scss/mws.scss',
        report: report,
        root: root,
        server: server,
        source: 'src/',
        stubsjs: [
            bower.directory + 'angular-mocks/angular-mocks.js',
            client + 'stubs/**/*.js'
        ],
        temp: temp,

        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },

        /**
         * plato
         */
        plato: {js: clientApp + '**/*.js'},

        /**
         * browser sync
         */
        browserReloadDelay: 1000,

        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false
            }
        },

        /**
         * Bower and NPM files
         */
        bower: bower,
        packages: [
            './package.json',
            './bower.json'
        ],

        /**
         * specs.html, our HTML spec runner
         */
        specRunner: client + specRunnerFile,
        specRunnerFile: specRunnerFile,

        /**
         * The sequence of the injections into specs.html:
         *  1 testlibraries
         *  2 bower
         *  3 js
         *  4 spechelpers
         *  5 specs
         *  6 templates
         */
        testlibraries: [
            nodeModules + '/jasmine-core/lib/jasmine-core.js'
        ],
        specHelpers: [client + 'tests/**/*.js'],
        specs: [client + '/tests/**/*.js'],

        /**
         * Node settings
         */
        nodeServer: './src/server/server.js',
        defaultPort: '7203'
    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
        return options;
    };

    /**
     * karma settings
     */
    config.karma = getKarmaOptions();

    return config;

    ////////////////

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                'http://usmlrs1296.arrow.com:7782/snap/assets/angular/snap.min.js',
                clientApp + '**/*.module.js',
                clientApp + '**/ajax.js',
                clientApp + '**/*.config.js',
                clientApp + '**/*.constants.js',
                clientApp + '**/*.provider.js',
                clientApp + '**/*.service.js',
                clientApp + '**/*.filter.js',
                clientApp + '**/*.directive.js',
                clientApp + '**/*.component.js',
                clientApp + '**/*.route.js',
                client + 'test-helpers/*.js',
                client + 'tests/**/*.js'
            ),
            exclude: [clientApp + 'blocks/data/ajax.js'],
            coverage: {
                dir: './coverage',
                reporters: [
                    // reporters not supporting the `file` property
                    {type: 'html'}
                    // reporters supporting the `file` property, use `subdir` to directly
                    // output them in the `dir` directory.
                    // omit `file` to output to the console.
                    //{type: 'cobertura', subdir: '.', file: 'cobertura.txt'},
                    //{type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt'},
                    //{type: 'teamcity', subdir: '.', file: 'teamcity.txt'},
                    //{type: 'text'}, //, subdir: '.', file: 'text.txt'},
                    //{type: 'text-summary'} //, subdir: '.', file: 'text-summary.txt'}
                    //{type: 'lcov', file: 'lcov.info'}
                ]
            },
            preprocessors: {}
        };
        options.preprocessors[clientApp + '**/!(*.spec)+(.js)'] = ['coverage'];
        return options;
    }
};
