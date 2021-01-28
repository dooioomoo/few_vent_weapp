const path = require('path');
const { exec } = require('child_process');
const serve = require('webpack-serve');
const config = require('./webpack.doc.dev');
const fs = require('fs');
global.requireLocal = function (name) {
    return require(path.join(__dirname + '\\..\\..\\..\\', name))
}
global.setting = requireLocal("./gulpfiles/gulp-settings");
var string = setting.base.weapp_dist;
if (string.charAt(0) == "/") string = string.substr(1);
if (string.charAt(string.length - 1) == "/") string = string.substr(0, string.length - 1);
const esDir = path.resolve(__dirname + '\\..\\..\\..\\', string);

const esConfig = path.resolve(__dirname, '../tsconfig.json');
const libConfig = path.resolve(__dirname, '../tsconfig.lib.json');
const exampleConfig = path.resolve(__dirname, '../tsconfig.example.json');

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
const gulpConfig = path.resolve(__dirname, './compiler.js');
serve({}, { config });
const p = exec(`npx gulp -f ${gulpConfig} buildExample --color`);
p.stdout.on('data', (stdout) => console.info(stdout));
p.stderr.on('data', (stderr) => console.info(stderr));
