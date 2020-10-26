var compileSass = function (target, done) {
    if (setting.sass[target].import == 'undefined' || setting.sass[target].export == 'undefined') {
        return done();
    }
    if (setting.sass[target].import.length < 1 || setting.sass[target].export.length < 1) {
        return done();
    }

    let mini = (typeof setting.sass[target].mini == 'undefined' || setting.sass[target].mini != false);
    let postcss = mini ? [builder.autoprefixer(), builder.cssnano()] : [builder.autoprefixer()];
    let concat = (typeof setting.sass[target].concat == 'undefined' || setting.sass[target].concat != false);
    let single = !(typeof setting.sass[target].single == 'undefined' || setting.sass[target].single != false);
    let mini_ext = true;
    if (!mini) {
        mini_ext = false;
    } else {
        if (typeof setting.sass[target].mini_ext == 'undefined' || setting.sass[target].mini_ext != false) {
            mini_ext = true;
        } else {
            mini_ext = false;
        }
    }

    return builder.gulp
        .src(setting.sass[target].import, { base: "./" })
        .pipe(builder.plumber())
        .pipe(builder.sass({ includePaths: [setting.server.root], outputStyle: "expanded" }))
        .pipe(builder.gulpif(concat, builder.concat(target + setting.styleSuffix)))
        .pipe(builder.gulpif(single, builder.gulp.dest(setting.base.clearFolder)))
        .pipe(builder.gulpif(mini_ext, builder.rename({ suffix: ".min" })))
        .pipe(builder.postcss(postcss))
        .pipe(builder.gulp.dest(setting.sass[target].export));
};
var moduleVar = {};
Object.keys(setting.sass).forEach(element => {
    eval('moduleVar[element] = function ' + element + '_sass (cb) { return compileSass(element, cb); }');
});

module.exports = moduleVar;
