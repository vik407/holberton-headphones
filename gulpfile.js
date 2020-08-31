"use strict";

const {
    series,
    parallel,
    watch,
    src,
    dest
} = require('gulp');

var pug = require("gulp-pug"),
    changed = require("gulp-changed"),
    plumber = require("gulp-plumber"),
    w3cjs = require("gulp-w3cjs"),
    browserSync = require("browser-sync"),
    htmlSource = Array("./src/**/*.pug", "!./src/**/_*.pug", "!./node_modules"),
    htmlValidate = "./0x*/*.html";

const server = browserSync.create();

// BrowserSync Reload
function browserSyncReload(done) {
    server.reload();
    done();
}

function browserSyncStart(done) {
    server.init({
        server: {
            baseDir: "./0x00-html_advanced/"
        }
    });
    done();
}

function html(done) {
    src(htmlSource).pipe(plumber()).pipe(pug({pretty: true})).pipe(dest('./'));
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
    watch('./src/**/*.pug', series(html, browserSyncReload));
    done();
}

/** main function default
 */
const dev = parallel(browserSyncStart, html, watcher);
const val = parallel(w3c);
exports.validate = val;
exports.default = dev;
