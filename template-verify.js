/* temlate-verify.js */

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
var queue = [];
var saveOptions = [];

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
        reportWarning(options, er);
    }
    return source;
}

/**
 * Appends the warning to the verifier scan options object.
 * @param options
 * @param warning
 */
function reportWarning(options, warning){
    if (options.warnings == null){
        options.warnings = [];
    }
    options.warnings.push(warning);
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
                        + ' files in /' + options.app + ' is complete. Found ' + bad
                        + ' files with errors.');
                then = new Date().getTime();
                nextInQueue();
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
    //console.log('Starting ' + templateType + ' template check: ' + SCAN_PATH);
    if (!_fs.existsSync(SCAN_PATH)) {
        reportWarning(options, 'No such directory "' + SCAN_PATH + '". Oh well.');
        whenDone();
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
                                reportWarning(options, parseError);
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
                                reportWarning(options, parseError);
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
                                        reportWarning(options, parseError);
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
                                reportWarning(options, parseError);
                                whenDone();
                            }
                        }
                    }

                }

            });

}

/**
 * Get the next scan target and run the verification.
 */
function nextInQueue(){
    if (queue.length === 0){
        console.log("ALL DONE");
        showWarnings();
    }
    else{
        var options = queue.shift();
        run(options); 
    }
}

/**
 * Report any warnings found in any of the targets verified.
 */
function showWarnings(){
    for (var index = 0; index<saveOptions.length; index++){
        var option = saveOptions[index];
        if (option.warnings && option.warnings.length > 0){
            console.warn('Warning: ' + JSON.stringify(option, null, 2));
        }
    }
}

/**
 * Verify a list of target paths.
 * @param {Array<Object>} optionsList 
 */
function verify(optionsList) {
    queue = []; 
    saveOptions = optionsList;
    for (var index = 0; index<optionsList.length; index++){
        var option = optionsList[index];
        queue.push(option);
    }
    setTimeout(function(){
        nextInQueue();
    }, 1);
}


verify([{
    templateType : 'Ractive',
    // Supply app name:
    app : 'common',
    // NOTE IRREGULARITY OF PATH NAME HERE:
    scanPath : 'templates'
},{
    templateType : 'Handlebars',
    // Supply app name:
    app : 'common',
    // Supply the path to scan here.
    scanPath : 'hbs'
},{
    templateType : 'LESS',
    // Supply app name:
    app : 'common',
    // Supply the path to scan here.
    scanPath : 'less'
},
// No such path exists at the time of this writing.
/*{
    templateType : 'Ractive',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'template'
},*/
{
    templateType : 'Handlebars',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'hbs'
},{
    templateType : 'LESS',
    // Supply app name:
    app : 'logon',
    // Supply the path to scan here.
    scanPath : 'less'
},{
    templateType : 'Ractive',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'template'
},{
    templateType : 'Handlebars',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'hbs'
},{
    templateType : 'LESS',
    // Supply app name:
    app : 'dashboard',
    // Supply the path to scan here.
    scanPath : 'less'
}]);

module.exports = {
    'verify' : verify
};