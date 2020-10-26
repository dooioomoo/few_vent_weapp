
const importPath = "./";
const path = require('path');
const { exec } = require('child_process');

global.requireLocal = function (name) {
    return require(path.join(__dirname, name))
}
global.setting = require(importPath + "gulpfiles/gulp-settings");
global.builder = require(importPath + 'gulpfiles/gulp-require.js');
global.compile = require(importPath + "gulpfiles/gulp-compile");
global.cleanFile = {
    clear: () => {
        return builder.clean(setting.base.clearFolder);
    }
};

const ex = {
    watch: require(importPath + 'gulpfiles/gulp-watch.js'),
};

var init_compile = function (task, v) {
    let run_array = [];
    Object.keys(setting[v]).forEach(directory => {
        run_array.push(task[directory]);
    });
    return run_array;
}

var init_syncWatch = function (done) {
    builder.gulp.watch(
        [
            "./**/*.php",
            "./**/*.html",
            setting.base.exportPath + "**/*",
        ],
        builder.browserSync_reload
    )
    done()
};
// console.log(init_compile(compile.sass, 'sass'));

exports.sass = builder.gulp.series.apply(builder.gulp, [init_compile(compile.sass, 'sass'), cleanFile.clear]);
exports.less = builder.gulp.series.apply(builder.gulp, [init_compile(compile.less, 'less'), cleanFile.clear]);
exports.js = builder.gulp.series.apply(builder.gulp, [init_compile(compile.js, 'js'), cleanFile.clear]);
exports.images = builder.gulp.series.apply(builder.gulp, init_compile(compile.images, 'images'));
exports.fonts = builder.gulp.series.apply(builder.gulp, init_compile(compile.fonts, 'fonts'));
exports.imgmini = compile.images.ImageMini;

exports.init = builder.gulp.series(
    exports.sass,
    exports.js,
    exports.images,
    exports.fonts,
    exports.imgmini,
    cleanFile.clear,
);
exports.weapp = builder.gulp.series(compile.weapp.dist);
exports.watch = builder.gulp.series(exports.init, ex.watch.init);
exports.sync = builder.gulp.series(exports.init, ex.watch.init, init_syncWatch, builder.browserSync_start);
exports.default = builder.gulp.series(exports.init);
