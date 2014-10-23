var ractive = require('ractive');
var handlebars = require('handlebars');
var less = require('less');
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
        matchBase : true,
        dot : true
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
 * @param {String}
 *            input
 * @return {String}
 */
function normalizeName(input) {
    return input.split('_').join('-');
}

/**
 * Read file.
 * 
 * @param {String}
 *            filePathName
 * @return {String}
 */
function readFile(filePathName) {
    var FILE_ENCODING = 'utf8';
    filePathName = _path.normalize(filePathName);
    var source = '';
    try {
        source = _fs.readFileSync(filePathName, FILE_ENCODING);
    } catch (er) {
    }
    return source;
}

/**
 * Run.
 * 
 * @param options
 */
function run(options) {
    var then = 0;
    SCAN_PATH = 'src/' + options.app + '/' + options.scanPath;
    var templateType = options.templateType;
    var fileTypes = [];
    var good = 0;
    var bad = 0;
    var total = 0;
    var fileLength = 0;
    var fileCount = 0;

    var whenDone = function() {
        if (fileLength === fileCount) {
            // console.log(total + ',' + good + ',' + bad);
            if (total === (good + bad)) {
                console.log(templateType + ' source check of ' + total
                        + ' files is complete. Found ' + bad
                        + ' files with errors.');
                then = new Date().getTime();
            }
        }

    };

    if (templateType == null) {
        templateType = 'RACTIVE';
    }
    if (templateType.toUpperCase() === 'HANDLEBARS'
            || templateType.toUpperCase() === 'HBS') {
        templateType = "Handlebars";
    } else if (templateType.toUpperCase() === 'RACTIVE') {
        templateType = "Ractive";
    } else if (templateType.toUpperCase() === 'LESS') {
        templateType = "Less";
    }
    console.log('Starting ' + templateType + ' template check: ' + SCAN_PATH);
    if (!_fs.existsSync(SCAN_PATH)){
        console.warn('No such directory "' + SCAN_PATH + '". Oh well.');
        return;
    }
    var files = _wrench.readdirSyncRecursive(SCAN_PATH);
    files = filterFiles(files, [ '.*', '.DS_Store', '{**/,}.git{/**,}',
            'node_modules/**', 'bower_components/**', 'build/**', 'css/**',
            'img/tmp/**', 'build.js', 'gui.html', 'package.json', 'README.md',
            'update.sh', 'yui_sdk/**', 'infrastructure/**', '{**/,}.html' ]);
    fileLength = files.length;
    files
            .forEach(function(path) {
                path = _path.normalize(SCAN_PATH + '/' + path);
                stat = _fs.statSync(path);
                fileCount++;
                if (stat.isFile()
                        && (path.indexOf('.html') !== -1 || path
                                .indexOf('.hbs') !== -1)
                        || path.indexOf('.oft') !== -1
                        || path.indexOf('.less') !== -1) {
                    if (_path.extname(path) === '.html'
                            || _path.extname(path) === '.hbs'
                            || _path.extname(path) === '.oft'
                            || _path.extname(path) === '.less') {
                        total++;
                        var fileName = _path.basename(path);
                        var pathName = _path.dirname(path);
                        var source = readFile(path);
                        var parseResult = null;
                        if (templateType.toUpperCase() === 'RACTIVE') {
                            try {
                                parseResult = ractive.parse(source);
                                good++;
                            } catch (parseError) {
                                parseError.fileName = path;
                                bad++;
                                console.warn(parseError);
                            }
                            whenDone();
                        } else if (templateType.toUpperCase() === 'HANDLEBARS') {
                            // FIXME: use HBS compiler
                            try {
                                parseResult = handlebars.compile(source);
                                good++;
                            } catch (parseError) {
                                parseError.fileName = path;
                                bad++;
                                console.warn(parseError);
                            }
                            whenDone();
                        } else if (templateType.toUpperCase() === 'LESS') {
                            // FIXME: use LESS compiler
                            var opts = {
                                filename : fileName,
                                paths : [ pathName ]
                            };
                            try {
                                less.render(source, opts, function(parseError,
                                        css) {
                                    if (parseError != null) {
                                        parseError.fileName = path;
                                        bad++;
                                        console.warn(parseError);
                                    } else {
                                        // audit output here:
                                        // console.log(css);
                                        good++;
                                    }
                                    whenDone();
                                });
                            } catch (parseError) {
                                parseError.fileName = path;
                                bad++;
                                console.warn(parseError);
                                whenDone();
                            }
                        }
                    }

                }

            });

}

// auth
run({
    templateType : 'Ractive',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'template'
});

run({
    templateType : 'Handlebars',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'hbs'
});

run({
    templateType : 'LESS',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'less'
});

// accounts
run({
    templateType : 'Ractive',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'template'
});

run({
    templateType : 'Handlebars',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'hbs'
});

run({
    templateType : 'LESS',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'less'
});