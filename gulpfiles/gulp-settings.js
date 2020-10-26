
const exportPath = "../assets/";
const importPath = "./src/";
const JsGlobal = requireLocal(importPath + "js/js-require.js");
const vo = "vendor/";
const commonFonts = exportPath + "fonts/";

/**
 * sass,less等编译参数
 * mini:默认true,是否最小化
 * concat:默认true,是否合并
 * single:默认false，是否直接单文件转换，会存放到scss文件同目录
 * mini_ext:默认true，压缩式是否增加.min
 */


module.exports = {
    styleSuffix: ".css",
    base: {
        exportPath: exportPath,
        importPath: importPath,
        clearFolder: exportPath + "temp/",
    },
    server: {
        root: '/',
        name: 'localhost',
        port: '3000',
    },
    less: {
        common: {
            import: [
                importPath + "less/common/common.less"
            ],
            export: [
                exportPath + "css/",
            ],
        },
        app: {
            import: [
                importPath + "less/app/app.less"
            ],
            export: [
                exportPath + "css/",
            ],
        },
        weapp: {
            mini: true,
            mini_ext: false,
            concat: false,
            single: true,
            import: [
                "../pages/**/*.less"
            ],
            export: [
                ".",
            ],
        },
    },
    sass: {
        common: {
            import: [
                importPath + "sass/common/common.scss"
            ],
            export: [
                exportPath + "css/",
            ],
        },
        app: {
            import: [
                importPath + "sass/app/app.scss"
            ],
            export: [
                exportPath + "css/",
            ],
        },
        weapp: {
            mini: true,
            mini_ext: false,
            concat: false,
            single: true,
            import: [
                "../pages/**/*.scss"
            ],
            export: [
                ".",
            ],
        },
    },
    js: {
        common: {
            concat: true,
            import: JsGlobal.list.concat([
                importPath + "js/common/**/*",
                importPath + "js/core/*.js",
            ]),
            export: [
                exportPath + 'js/'
            ],
        },
        app: {
            concat: true,
            mini: false,
            import: [
                importPath + "js/object/*.js"
            ],
            export: [
                exportPath + 'js/'
            ],
        },
    },
    images: {
        common: {
            import: [
                importPath + "imgs/**/*"
            ],
            export: [
                exportPath + 'images/'
            ],
        },
    },
    fonts: {
        common: [
            [vo + "fortawesome/font-awesome/webfonts/**/*", commonFonts + "fontawesome"],
            [vo + "webfontkit/roboto/fonts/**/*", commonFonts + "roboto"],
            [vo + "webfontkit/open-sans/fonts/**/*", commonFonts + "open-sans"],
        ]
    }
}
