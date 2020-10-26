var compile = function (target, done) {
    if (setting.fonts[target] == undefined) {
        return done();
    }
    if (setting.fonts[target].length < 1) {
        return done();
    }
    var importPath = setting.fonts[target];
    var R = importPath.map(function (element) {
        return builder.gulp
            .src(element[0])
            .pipe(builder.plumber())
            .pipe(builder.gulp.dest(element[1]));
    });
    return builder.merge(R);
}

var moduleVar = {};
Object.keys(setting.fonts).forEach(element => {
    eval('moduleVar[element] = function ' + element + '_font (cb) { return compile(element, cb); }');
});

module.exports = moduleVar;
