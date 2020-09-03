"use strict";

const {
    series,
    parallel,
    watch,
    src,
    dest
} = require('gulp');
const { logError } = require('gulp-sass');

var pug = require("gulp-pug"),
    changed = require("gulp-changed"),
    sass = require("gulp-sass"),
    plumber = require("gulp-plumber"),
    w3cjs = require("gulp-w3cjs"),
    browserSync = require("browser-sync"),
    htmlSource = Array("./src/**/*.pug", "!./src/**/_*.pug", "!./node_modules"),
    cssSource = Array("./src/**/*.scss", "!./src/**/_*.scss", "!./node_modules"),
    htmlValidate = "./*.html";

const server = browserSync.create();

// BrowserSync Reload
function browserSyncReload(done) {
    server.reload();
    done();
}

// BrowserSync Stream (for handling sass/css files)
function browserSyncStream(done) {
    server.stream();
    done();
}

function browserSyncStart(done) {
    server.init({
        server: {
            baseDir: "./"
        }
    });
    done();
}

function html(done) {
    src(htmlSource).pipe(plumber()).pipe(pug({ pretty: true })).pipe(dest('./'));
    done();
}

function css(done) {
    src(cssSource).pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('./'))
        .pipe(server.stream());
    done();
}

function w3c(done) {
    return src(htmlValidate).pipe(w3cjs({
        verifyMessage: function (type, message) { // prevent logging error message
            if (message.indexOf('Element') === 0)
                return true;
            

            // allow message to pass through
            return false;
        }
    })).pipe(w3cjs.reporter());
    done();
}

function watcher(done) {
    watch('./src/*.pug', series(html, browserSyncReload));
    watch('./src/*.scss', series(css));
    done();
}

/** main function default
 */
const dev = parallel(browserSyncStart, html, css, watcher);
const val = parallel(w3c);
exports.validate = val;
exports.default = dev;
