var compileless = function (target, done) {
    if (setting.less[target].import == 'undefined' || setting.less[target].export == 'undefined') {
        return done();
    }
    if (setting.less[target].import.length < 1 || setting.less[target].export.length < 1) {
        return done();
    }

    let mini = (typeof setting.less[target].mini == 'undefined' || setting.less[target].mini != false);
    let postcss = mini ? [builder.autoprefixer(), builder.cssnano()] : [builder.autoprefixer()];
    let concat = (typeof setting.less[target].concat == 'undefined' || setting.less[target].concat != false);
    let single = !(typeof setting.less[target].single == 'undefined' || setting.less[target].single != false);
    let mini_ext = true;
    if (!mini) {
        mini_ext = false;
    } else {
        if (typeof setting.less[target].mini_ext == 'undefined' || setting.less[target].mini_ext != false) {
            mini_ext = true;
        } else {
            mini_ext = false;
        }
    }

    return builder.gulp
        .src(setting.less[target].import, { base: "./" })
        .pipe(builder.plumber())
        .pipe(builder.less({ includePaths: [setting.server.root], outputStyle: "expanded" }))
        .pipe(builder.gulpif(concat, builder.concat(target + setting.styleSuffix)))
        .pipe(builder.gulpif(single, builder.gulp.dest(setting.base.clearFolder)))
        .pipe(builder.gulpif(mini_ext, builder.rename({ suffix: ".min" })))
        .pipe(builder.rename({ extname: setting.styleSuffix }))
        .pipe(builder.postcss(postcss))
        .pipe(builder.gulp.dest(setting.less[target].export));
};
var moduleVar = {};
Object.keys(setting.less).forEach(element => {
    eval('moduleVar[element] = function ' + element + '_less (cb) { return compileless(element, cb); }');
});

module.exports = moduleVar;
