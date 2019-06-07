const fs = require('fs');
const exec = require('child_process').exec;
const gulp = require('gulp');
const mustache = require("gulp-mustache");
const rename = require('gulp-rename');
const csso = require('csso');

const normalizeCss = fs.readFileSync('./node_modules/normalize.css/normalize.css');

gulp.task('watch', function () {
    gulp.watch(['./src/*'], {
        ignoreInitial: false,
    }, render);
});

gulp.task('default', render);


gulp.task('fetchPlugins', function () {
    const pluginsNames = new Set(require('./src/pluginsNames.json'));
    const plugins = {};

    let promise = Promise.resolve();
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
            const pluginsList = Object.values(plugins);
            fs.writeFileSync('./src/plugins.json', JSON.stringify(pluginsList));
        })
        .catch(function (error) {
            console.error(error);
            process.exit(1);
        });
});


function render() {
    const plugins = getPlugins();

    const css = fs.readFileSync('./src/styles.css');
    const combinedCss = normalizeCss + css;
    const minifiedCss = csso.minify(combinedCss).css;

    const js = fs.readFileSync('./src/script.js');

    return gulp.src('./src/template.mustache')
        .pipe(mustache({
            plugins: plugins,
            css: minifiedCss,
            js: js,
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./'));
}


function getPlugins() {
    let plugins = JSON.parse(fs.readFileSync('./src/plugins.json'));
    plugins.forEach(function (plugin) {
        plugin.shortName = plugin.name.replace('posthtml-', '');
    });

    return plugins;
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
