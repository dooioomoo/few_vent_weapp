const fs = require('fs');
const esConfig = builder.path.resolve(__dirname, '../src/vant/tsconfig.json');
const src = builder.path.resolve(__dirname, '../src/vant/packages');
const parent_path = builder.path.resolve(__dirname, '../src/vant');
const baseCssPath = builder.path.resolve(__dirname, '../src/vant/packages/common/index.wxss');
const exec = builder.util.promisify(require('child_process').exec);
var string = setting.base.weapp_dist;
if (string.charAt(0) == "/") string = string.substr(1);
if (string.charAt(string.length - 1) == "/") string = string.substr(0, string.length - 1);
const esDir = builder.path.resolve(__dirname, "../" + string);
const libConfig = builder.path.resolve(__dirname, '../src/vant/tsconfig.lib.json');
const exampleConfig = builder.path.resolve(__dirname, '../src/vant/tsconfig.example.json');


var tofile = function (cfg) {
    fs.readFile(cfg, (err, data) => {
        if (err) return;
        let new_tsCfg = JSON.parse(data);
        new_tsCfg.compilerOptions.outDir = esDir;
        var json = JSON.stringify(new_tsCfg);
        fs.writeFile(cfg, json, 'utf8', () => { });
    });
}
tofile(esConfig);
tofile(libConfig);
tofile(exampleConfig);

console.log('path:' + __dirname);
console.log('src:' + src);
console.log('esDir:' + esDir);

const tsCompiler = (dist, config) =>
    async function compileTs() {
        await exec(`npx tsc -p ${config}`);
        await exec(`npx tscpaths -p ${config} -s ../packages -o ${dist}`);
    };


const copier = (dist, ext) =>
    function copy() {
        return builder.gulp.src(`${src}/**/*.${ext}`).pipe(builder.gulp.dest(dist));
    };

const staticCopier = (dist) =>
    builder.gulp.parallel(
        copier(dist, 'wxml'),
        copier(dist, 'wxs'),
        copier(dist, 'json')
    );



const lessCompiler = (dist) =>
    function compileLess() {
        return builder.gulp
            .src(`${src}/**/*.less`)
            .pipe(builder.less())
            .pipe(builder.postcss([builder.autoprefixer()]))
            .pipe(
                builder.insert.transform((contents, file) => {
                    if (!file.path.includes('packages' + builder.path.sep + 'common')) {
                        const relativePath = builder.path
                            .relative(
                                builder.path.normalize(`${file.path}${builder.path.sep}..`),
                                baseCssPath
                            )
                            .replace(/\\/g, '/');
                        contents = `@import '${relativePath}';${contents}`;
                    }
                    return contents;
                })
            )
            .pipe(builder.rename({ extname: '.wxss' }))
            .pipe(builder.gulp.dest(dist));
    };

const cleaner = (path) =>
    function clean() {
        return exec(`npx rimraf ${path}`);
    };

module.exports = {
    dist: builder.gulp.series(
        cleaner(esDir),
        // tsCompiler(esDir, esConfig),
        tsCompiler(esDir, libConfig),
        lessCompiler(esDir),
        staticCopier(esDir),
    ),
    buildExample: builder.gulp.series(
        cleaner(esDir),
        tsCompiler(esDir, exampleConfig),
        lessCompiler(esDir),
        staticCopier(esDir),
    ),

};
