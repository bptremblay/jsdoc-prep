var ractive = require('ractive');
var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');
var _minimatch = require('minimatch');
var sys = require('sys');
var FILE_ENCODING = 'utf8';
var SCAN_PATH = '';
var stat;

/**
 * Filter files.
 *
 * @param files
 * @param excludes
 * @return {Array<Object>} A filtered list of file objects.
 */
function filterFiles(files, excludes) {
    var globOpts = {
        matchBase: true,
        dot: true
    };
    excludes = excludes.map(function(val) {
        return _minimatch.makeRe(val, globOpts);
    });
    files = files.map(function(filePath) {
        return _path.normalize(filePath).replace(/\\/g, '/');
    });
    return files.filter(function(filePath) {
        return !excludes.some(function(glob) {
            return glob.test(filePath);
        });
    });
}

/**
 * Normalize name.
 *
 * @param {String} input
 * @return {String}
 */
function normalizeName(input) {
    return input.split('_').join('-');
}

/**
 * Read file.
 *
 * @param {String} filePathName
 * @return {String}
 */
function readFile(filePathName) {
    var FILE_ENCODING = 'utf8';
    filePathName = _path.normalize(filePathName);
    var source = '';
    try {
        source = _fs.readFileSync(filePathName, FILE_ENCODING);
    } catch (er) {}
    return source;
}

/**
 * Run.
 * @param options
 */
function run(options) {
    var then = 0;
    SCAN_PATH = options.scanPath;
    console.log('Starting Ractive template check: ' + SCAN_PATH);
    var files = _wrench.readdirSyncRecursive(SCAN_PATH);
    files = filterFiles(files, ['.*', '.DS_Store', '{**/,}.git{/**,}',
        'node_modules/**', 'bower_components/**', 'build/**', 'css/**',
        'img/tmp/**', 'build.js', 'gui.html', 'package.json', 'README.md',
        'update.sh', 'yui_sdk/**', 'infrastructure/**', '{**/,}.html'
    ]);
    var good = 0;
    var bad = 0;
    var total = 0;
    files.forEach(function(path) {
        path = _path.normalize(SCAN_PATH + '/' + path);
        stat = _fs.statSync(path);
        if (stat.isFile() && path.indexOf('.html') !== -1) {
            if (_path.extname(path) === '.html') {
                total++;
                try {
                    var source = readFile(path);
                    var parseResult = ractive.parse(source);
                    good++;
                } catch (parseError) {
                    parseError.fileName = path;
                    bad++;
                    console.warn(parseError);
                }
            }
        }
    });
    console.log('Ractive template check of ' + total + ' template files is complete. Found ' + bad + ' templates with errors.');
    then = new Date().getTime();
}

run({
    // Supply the path to scan here.
    scanPath: 'src/dashboard/template'
});