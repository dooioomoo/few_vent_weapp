var compile = function (target, done) {
    if (setting.js[target].import == undefined || setting.js[target].export == undefined) {
        return done();
    }
    if (setting.js[target].import.length < 1 || setting.js[target].export.length < 1) {
        return done();
    }

    let mini = (typeof setting.js[target].mini == 'undefined' || setting.js[target].mini != false);
    let concat = (typeof setting.js[target].concat == 'undefined' || setting.js[target].concat != false);
    let single = !(typeof setting.js[target].single == 'undefined' || setting.js[target].single != false);
    let mini_ext = true;
    if (!mini) {
        mini_ext = false;
    } else {
        if (typeof setting.js[target].mini_ext == 'undefined' || setting.js[target].mini_ext != false) {
            mini_ext = true;
        } else {
            mini_ext = false;
        }
    }
    let jsext = mini_ext ? {
        min: ".min.js",
    } : { min: ".js", };

    return builder.gulp
        .src(setting.js[target].import, { base: "./" })
        .pipe(builder.gulpif(concat, builder.concat(target + ".js")))
        .pipe(builder.gulpif(single, builder.gulp.dest(setting.base.clearFolder)))
        .pipe(builder.gulpif(mini,
            builder.minify({
                ext: jsext,
                ignoreFiles: [".combo.js", ".min.js", "-min.js"],
                noSource: true
            })
        ))
        .pipe(builder.gulp.dest(setting.js[target].export));


}
var moduleVar = {};

Object.keys(setting.js).forEach(element => {
    eval('moduleVar[element] = function ' + element + '_javascript (cb) { return compile(element, cb); }');
});

module.exports = moduleVar;
