/* template-verify.js */

var ractive;
var handlebars;
var less;
var _wrench;
var _minimatch;
var jsonlint;
var _esprima;

var sys = require('sys');
var _fs = require('fs');
var _path = require('path');
var FILE_ENCODING = 'utf8';
var SCAN_PATH = '';
var stat;

var Logger =  {
        log : function(msg) {
            //   console.log(msg);
        },
        warn : function(msg) {
            //   console.warn(msg);
        },
        error : function(msg) {
            //   console.error(msg);
        }
};


try {
    ractive = require('ractive');
    handlebars = require('handlebars');
    less = require('less');
    _wrench = require('wrench');
    _minimatch = require('minimatch');
    jsonlint = require("jsonlint");
    _esprima = require('esprima');
    main();
} catch (npmErr) {
    Logger.error(npmErr);
    var npmMod = require('npm');
    npmMod.load(null, function(er, npm) {
        // wait a sec...
        npm.install("ractive", "handlebars", "less", "wrench", "minimatch",
                "jsonlint", "esprima", function(er) {
            main();
        });

    });

}



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

    function formatError(err){
        var output = {};
        for (var e in err){
            output[e] = err[e];
        }
        output.message = err.message;
        if (err.lineNumber){
            output.lineNumber = err.lineNumber;
        }
        if (err.name){
            output.name = err.name;
        }
        if (err.columnNumber){
            output.columnNumber = err.columnNumber;
        }
//      if (err.stack){
//      output.stack = err.stack;
//      }
        return output;
    }
    
    
    /**
     * Safe create dir.
     * 
     * @name safeCreateDir
     * @method safeCreateDir
     * @param dir
     */
    function safeCreateDir(dir) {
        if (!_fs.existsSync(dir)) {
            // // // logger.log("does not exist");
            _wrench.mkdirSyncRecursive(dir);
        }
    }
    /**
     * Write file.
     * 
     * @name writeFile
     * @method writeFile
     * @param filePathName
     * @param source
     */
    function writeFile(filePathName, source) {
        filePathName = _path.normalize(filePathName);
        safeCreateFileDir(filePathName);
        _fs.writeFileSync(filePathName, source);
    }


    var errors = [];
    
    var whenDone = function(err) {
        if (err){
            var printErr = formatError(err);
            //console.error(JSON.stringify(printErr, null, 2));
            errors.push(err);
        }
        //Logger.log(total + ',' + good + ',' + bad + ',' + fileCount + '/' + fileLength);
        if (fileLength === fileCount) {
            //Logger.log(total + ',' + good + ',' + bad);
            if (total === (good + bad)) {
                Logger.log(templateType + ' source check of ' + total
                        + ' files is complete. Found ' + bad
                        + ' files with errors.');
                then = new Date().getTime();
                
                //console.error(JSON.stringify(errors, null, 2));
                
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
    } else if (templateType.toUpperCase() === 'JSON') {
        templateType = "JSON";
    } else if (templateType.toUpperCase() === 'JAVASCRIPT'
        || templateType.toUpperCase() === 'JS'
            || templateType.toUpperCase() === 'ECMASCRIPT') {
        templateType = "JavaScript";
    }
    Logger.log('Starting ' + templateType + ' template check: ' + SCAN_PATH);
    if (!_fs.existsSync(SCAN_PATH)) {
        Logger.warn('No such directory "' + SCAN_PATH + '". Oh well.');
        return;
    }
    var files = _wrench.readdirSyncRecursive(SCAN_PATH);
    files = filterFiles(files, [
                                '.*',
                                '.DS_Store',
                                '{**/,}.git{/**,}',
                                'node_modules/**',
                                'bower_components/**',
                                'build/**',
                                'css/**',
                                'img/tmp/**',
                                'build.js',
                                'gui.html',
                                'package.json',
                                'README.md',
                                'update.sh',
                                'yui_sdk/**',
                                'infrastructure/**',
                                '{**/,}.html' ]);
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
                        || path.indexOf('.less') !== -1
                        || path.indexOf('.json') !== -1
                        || path.indexOf('.js') !== -1) {
            if (_path.extname(path) === '.html'
                || _path.extname(path) === '.hbs'
                    || _path.extname(path) === '.oft'
                        || _path.extname(path) === '.less'
                            || _path.extname(path) === '.json'
                                || _path.extname(path) === '.js') {
                total++;
                var fileName = _path.basename(path);
                var pathName = _path.dirname(path);
                var source = readFile(path);
                var parseResult = null;
                if (templateType.toUpperCase() === 'RACTIVE') {
                    try {
                        parseResult = ractive.parse(source);
                        good++;
                        whenDone();
                    } catch (parseError) {
                        parseError.fileName = path;
                        parseError.fileType = templateType.toUpperCase();
                        bad++;
                        Logger.warn(parseError);
                        whenDone(parseError);
                    }
                } else if (templateType.toUpperCase() === 'HANDLEBARS') {
                    // FIXME: use HBS compiler
                    try {
                        parseResult = handlebars.compile(source);
                        good++;
                        whenDone();
                    } catch (parseError) {
                        parseError.fileName = path;
                        parseError.fileType = templateType.toUpperCase();
                        bad++;
                        Logger.warn(parseError);
                        whenDone(parseError);
                    }

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
                                parseError.fileType = templateType.toUpperCase();
                                bad++;
                                Logger.warn(parseError);
                                whenDone(parseError);
                            } else {
                                // audit output here:
                                // Logger.log(css);
                                good++;
                                whenDone();
                            }

                        });
                    } catch (parseError) {
                        parseError.fileName = path;
                        parseError.fileType = templateType.toUpperCase();
                        bad++;
                        Logger.warn(parseError);
                        whenDone(parseError);
                    }
                } else if (templateType.toUpperCase() === 'JSON') {
                    if (_path.extname(path) === '.js') {
                        good++;
                        whenDone();
                        return;
                    }
                    // Does this provide useful information?
                    // Logger.log(path);
                    try {
                        var temp = jsonlint.parse(source);
                        good++;
                        whenDone();
                    } catch (parseError) {
                        parseError.fileName = path;
                        parseError.fileType = templateType.toUpperCase();
                        bad++;
                        Logger.warn(parseError);
                        whenDone(parseError);
                    }
                } else if (templateType.toUpperCase() === 'JAVASCRIPT') {
                    if (_path.extname(path) === '.json') {
                        good++;
                        whenDone();
                        return;
                    }
                    // Does this provide useful information?
                    // Logger.log(path);

                    var ast = {};
                    try {

                        ast = _esprima.parse(source, {
                            comment : true,
                            tolerant : true,
                            range : true,
                            raw : true,
                            tokens : true
                        });

                        good++;
                        whenDone();

                    } catch (esError) {

                        esError.fileName = path;
                        esError.fileType = templateType.toUpperCase();
                        bad++;
                        Logger.warn(esError);
                        whenDone(esError);

                    }

                }
                else{
                    whenDone();
                }

            }
        }
        else{
            whenDone();
        }

    });

}

function main() {

//  // auth
//  run({
//  templateType : 'Ractive',
//  // Supply app name:
//  app : 'logon',
//  // Supply the path to scan here.
//  scanPath : 'template'
//  });

//  run({
//  templateType : 'Handlebars',
//  // Supply app name:
//  app : 'logon',
//  // Supply the path to scan here.
//  scanPath : 'hbs'
//  });

//  run({
//  templateType : 'LESS',
//  // Supply app name:
//  app : 'logon',
//  // Supply the path to scan here.
//  scanPath : 'less'
//  });

//  accounts
    run({
        templateType : 'Ractive',
        // Supply app name:
        app : 'dashboard',
        // Supply the path to scan here.
        scanPath : 'template'
    });

//  run({
//  templateType : 'Handlebars',
//  // Supply app name:
//  app : 'dashboard',
//  // Supply the path to scan here.
//  scanPath : 'hbs'
//  });

    run({
        templateType : 'LESS',
        // Supply app name:
        app : 'dashboard',
        // Supply the path to scan here.
        scanPath : 'less'
    });

    run({
        templateType : 'JSON',
        // Supply app name:
        app : 'dashboard',
        // Supply the path to scan here.
        scanPath : 'json'
    });

    run({
        templateType : 'JavaScript',
        // Supply app name:
        app : 'dashboard',
        // Supply the path to scan here.
        scanPath : 'js'
    });
}
