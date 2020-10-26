var compile = function (target, done) {
    if (setting.images[target].import == undefined || setting.images[target].export == undefined) {
        return done();
    }
    if (setting.images[target].import.length < 1 || setting.images[target].export.length < 1) {
        return done();
    }
    return builder.gulp
        .src(setting.images[target].import)
        .pipe(builder.plumber())
        .pipe(builder.gulp.dest(setting.images[target].export));
}

var ImgMini = function (done) {

    if (setting.images == undefined) {
        return done();
    }

    if (setting.images.length < 1) {
        return done();
    }

    var imgPath = [];

    Object.keys(setting.images).forEach(element => {
        setting.images[element].export.forEach(exportPath => {
            imgPath.push(exportPath);
        });
    });

    var R = imgPath.map(function (element) {
        console.log(element + '**/*');
        return builder.gulp
            .src(element + '**/*', { allowEmpty: true })
            .pipe(
                builder.imagemin(
                    [
                        builder.imagemin.gifsicle({ interlaced: true }),
                        builder.imagemin.mozjpeg({ progressive: true }),
                        builder.imagemin.optipng({ optimizationLevel: 5 }),
                        builder.imagemin.svgo({
                            plugins: [
                                {
                                    removeViewBox: false,
                                    collapseGroups: true,
                                },
                            ],
                        }),
                    ],
                    { verbose: true }
                )
            )
            .pipe(builder.gulp.dest(element));
    });

    return builder.merge(R);
}

var moduleVar = {};

Object.keys(setting.images).forEach(element => {
    eval('moduleVar[element] = function ' + element + '_images (cb) { return compile(element, cb); }');
});

moduleVar.ImageMini = ImgMini;

module.exports = moduleVar;
