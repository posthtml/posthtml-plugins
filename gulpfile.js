/*eslint no-console: 0*/

var addsrc = require('gulp-add-src'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    concat = require('gulp-concat'),
    cssNano = require('gulp-cssnano'),
    exec = require('child_process').exec,
    fs = require('fs'),
    gulp = require('gulp'),
    jade = require('gulp-jade'),
    path = require('path'),
    Promise = require('bluebird'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    reactify = require('reactify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    _ = require('lodash');


var isProduction = process.env.NODE_ENV === 'production';
var uglify = isProduction ? require('gulp-uglify') : require('gulp-empty');

var config = {
    css: {
        src: './css/*.css',
        outputName: 'styles.css',
        classesSrc: './js/config/css.json',
        dest: './build/'
    },

    js: {
        src: './js/index.js',
        outputName: 'bundle.js',
        dest: './build/'
    },

    templates: {
        src: './index.jade',
        outputName: 'index.html',
        dest: './'
    }
};


config.browserify = {
    entries: [config.js.src],
    transform: [babelify.configure({presets: ['es2015', 'react']}), reactify],
    debug: ! isProduction,
    cache: {},
    packageCache: {},
    fullPaths: false
};


gulp.task('fetchPlugins', function () {
    var pluginsNames = _.uniq(require('./js/config/pluginsNames.json'));
    var plugins = {};

    var promise = Promise.resolve();
    pluginsNames.forEach(function (pluginName) {
        promise = promise.then(function () {
            return getPackageJson(pluginName).then(function (packageJson) {
                if (! packageJson.description) {
                    return Promise.reject(new Error(pluginName + ': description is empty'));
                }

                if (! packageJson.homepage) {
                    return Promise.reject(new Error(pluginName + ': homepage is empty'));
                }

                plugins[pluginName] = {
                    name: pluginName,
                    description: packageJson.description,
                    url: packageJson.homepage.replace('#readme', '')
                };
                process.stdout.write('.');
            });
        });
    });

    return promise
        .then(function () {
            console.log('');
            var pluginsList = _.values(plugins);
            fs.writeFileSync('./js/config/plugins.json', JSON.stringify(pluginsList));
        })
        .catch(function (error) {
            console.error(error);
            process.exit(1);
        });
});


gulp.task('browserify', function () {
    return bundle(browserify(config.browserify));
});


gulp.task('templates', function () {
    var cssClasses = JSON.parse(fs.readFileSync(config.css.classesSrc, 'utf8'));

    var locals = {
        assets: {
            css: path.join('build', config.css.outputName),
            js: path.join('build', config.js.outputName)
        },

        c: cssClasses
    };

    return gulp.src(config.templates.src)
        .pipe(plumber())
        .pipe(jade({locals: locals}))
        .pipe(gulp.dest(config.templates.dest));
});


gulp.task('css', function () {
    var classes = {};

    var processors = [
        require('postcss-nested'),
        require('postcss-modules')({
            getJSON: function(cssFileName, json) {
                var moduleName = path.basename(cssFileName, '.css');
                classes[moduleName] = json;
            },

            generateScopedName: function(name, filename) {
                return path.basename(filename, '.css') + '_' + name;
            }
        }),
        require('autoprefixer')({browsers: ['> 1%'], cascade: false})
    ];

    return gulp.src(config.css.src)
        .pipe(plumber())
        .pipe(postcss(processors))
        .pipe(addsrc.prepend('./node_modules/normalize.css/normalize.css'))
        .pipe(concat(config.css.outputName))
        .pipe(cssNano())
        .pipe(gulp.dest(config.css.dest))
        .on('end', function () {
            fs.writeFileSync(config.css.classesSrc, JSON.stringify(classes));
        });
});


gulp.task('watch', function () {
    gulp.start('templates', 'css');

    gulp.watch(config.css.src, ['css']);
    gulp.watch(config.templates.src, ['templates']);

    var watcher = watchify(browserify(config.browserify));
    watcher.on('update', function () {
        var currentTime = new Date().toISOString().slice(11, 19);
        console.log('[' + currentTime + '] js updated');
        return bundle(watcher);
    });

    return bundle(watcher);
});


function bundle(b) {
    return b.bundle()
        .on('error', function (error) {
            console.error(error.message);
        })
        .pipe(source(path.basename(config.js.src)))
        .pipe(buffer())
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename(config.js.outputName))
        .pipe(gulp.dest(config.js.dest));
}





function getPackageJson(packageName) {
    var options = {
        timeout: 10000
    };

    return new Promise(function (resolve, reject) {
        exec('npm view --json ' + packageName, options, function (error, stdout, stderr) {
            if (error) {
                reject(error);
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(JSON.parse(stdout));
            }
        });
    });
}
