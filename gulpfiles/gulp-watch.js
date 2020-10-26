module.exports = {
    init: (done) => {
        const watchGroup = {
            CommonSass: [
                [setting.base.importPath + 'sass/common/**/*',],
                [compile.sass.common, cleanFile.clear]
            ],
            AppSass: [
                [setting.base.importPath + 'sass/app/**/*'],
                [compile.sass.app, cleanFile.clear]
            ],
            CommonLess: [
                [setting.base.importPath + 'less/common/**/*',],
                [compile.less.common, cleanFile.clear]
            ],
            AppLess: [
                [setting.base.importPath + 'less/app/**/*'],
                [compile.less.app, cleanFile.clear]
            ],
            CommonJs: [
                [
                    setting.base.importPath + "js/common/**/*",
                    setting.base.importPath + "js/core/**/*",
                    setting.base.importPath + "js/js-require.js",
                ],
                [compile.js.common, cleanFile.clear]
            ],
            AppJs: [
                setting.js.app.import,
                [compile.js.app, cleanFile.clear]
            ],
            commonImgs: [
                setting.images.common.import,
                [compile.images.common]
            ],
        };

        Object.keys(watchGroup).forEach(directory => {
            let task = watchGroup[directory];
            let watcher = builder.gulp.watch(
                task[0],
                builder.gulp.series.apply(builder.gulp, task[1])
            );
            bindTask(watcher);
        });
        done();
    }
}

var bindTask = function (target) {
    target.on('change', function (path, stats) {
        console.log(`File ${path} was changed`);
    });
    target.on('add', function (path, stats) {
        console.log(`File ${path} was added`);
    });
    target.on('unlink', function (path, stats) {
        console.log(`File ${path} was removed`);
    });
}
