/**
 * fileSystemProcessor.js.
 * 
 * @module file_system_processor
 */
var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');
var _minimatch = require('minimatch');
var sfp = require('./singleFileProcessor');
var sys = require('sys');
var FILE_ENCODING = 'utf8';
/**
 * Cb.
 * 
 * @param resultz
 */
var cb = function(resultz) {
    console.log('ALL DONE');
};
var SCAN_PATH = '';
var outPath = '';
var testPath = '';
var docPath = '';
var resultsPath = '';
var WRITE_NEW_FILES = false;
var processingChain = [];
var stat;
var outputPath = '';
var modules = {};
var allSource = '';
var totalFiles = [];
var modulePaths = {};
var emptyFiles = [];

/**
 * Filter files.
 * 
 * @param files
 * @param excludes
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
 * @param input
 */

function normalizeName(input) {
    return input.split('_').join('-');
}

/** Next file. */


function nextFile(){
    setTimeout(__nextFile, 50);
}

function __nextFile() {
    var nextPath = queue.shift();
    var basePath = SCAN_PATH;
    var inPath = nextPath;

    sfp.processFile(modulePaths, basePath, inPath, outPath, testPath, docPath,
            processingChain, function(result) {
                if (result.corrupted) {
                    console.error('HALTED');
                    return;
                }
                if (result.EMPTY){
                	emptyFiles.push(result.fileName);
                }
                results.push(result);
                delete result.undoBuffer;
                result.source = result.rawSource;
                delete result.rawSource;
                var resultsPathFile = '';
                if (result.packagePath.length === 0) {
                    resultsPathFile = resultsPath + '/' + result.fileName
                            + '.json';
                } else {
                    resultsPathFile = resultsPath + '/' + result.packagePath
                            + '/' + result.fileName + '.json';
                }
                var resultsJSON = "{}";
                try {
                    result.rewrittenReturnBody = null;
                    result.rewrittenReturnBodyNode = null;
                    delete result.rewrittenReturnBody;
                    delete result.rewrittenReturnBodyNode;
                    resultsJSON = JSON.stringify(result, null, 2);
                } catch (jsonError) {
                    console.warn(jsonError);
                }

                sfp.writeFile(resultsPathFile, resultsJSON);
                if (queue.length > 0) {
                    nextFile();
                } else {
                    var now = new Date().getTime() - then;
                    console.log('Processed ' + results.length + ' files. Took '
                            + now / 1000 + ' seconds.');
                    if (emptyFiles.length){
                    	console.warn('Some script files were EMPTY: \n' + emptyFiles.join('\n'));
                    }
                    var resultsBlock = {};
                    resultsBlock.results = results;
                    resultsBlock.path = SCAN_PATH;
                    resultsBlock.timeInSeconds = now / 1000;
                    resultsBlock.outPath = outPath;
                    resultsBlock.testPath = testPath;
                    resultsBlock.docPath = docPath;
                    resultsBlock.resultsPath = resultsPath;
                    sfp.setWriteEnable(true);
                    
                    var resultsJSON = '{}';
                    try{
                        resultsJSON = JSON.stringify(resultsBlock, null, 2);
                    }
                    catch(stringifyErr){
                        console.warn(stringifyErr);
                    }
                    
                    
                    sfp.writeFile(resultsPath + '/jsdoc-prep.json', resultsJSON);
                    if (cb != null) {
                        cb(resultsBlock);
                    }
                }
            }, WRITE_NEW_FILES);
}
var queue = [];
var results = [];
var then = 0;

/**
 * Run.
 * 
 * @param options
 */

function run(options) {
    processingChain = [];
    outputPath = '';
    modules = {};
    allSource = '';
    totalFiles = [];
    queue = [];
    results = [];
    then = 0;
    emptyFiles = [];

    /**
     * Get procs.
     * 
     * @param procList
     * @return {Object}
     */

    function getProcs(procList) {
        var output = [];
        for (var index = 0; index < procList.length; index++) {
            var procId = procList[index];
            output.push(sfp.plugins[procId]);
        }
        return output;
    }
    cb = options.callBack;
    modulePaths = options.modulePaths;
    SCAN_PATH = options.scanPath;
    outPath = options.writePath;
    testPath = options.writeTestPath;
    docPath = options.writeDocPath;
    resultsPath = options.writeResultsPath;
    WRITE_NEW_FILES = options.writeEnable;
    processingChain = getProcs(options.processingChain);
    console.log('scanning source directory: ' + SCAN_PATH);
    var files = _wrench.readdirSyncRecursive(SCAN_PATH);
    files = filterFiles(files, [ '.*', '.DS_Store',
    /** ,}',. */
    /**
     * ', <br />
     */
    ]);

    files.forEach(function(path) {
        path = _path.normalize(SCAN_PATH + '/' + path);
        stat = _fs.statSync(path);
        if (stat.isFile() && path.indexOf('.js') != -1) {
            if (_path.extname(path) === '.js') {
                queue.push(path);
            }
        }
    });
    console.log('walking source directory...');
    then = new Date().getTime();
    nextFile();
}

/**
 * Get plugins.
 * 
 * @return {Object}
 */

function getPlugins() {
    var output = {};
    for ( var pluginId in sfp.plugins) {
        if (!sfp.plugins.hasOwnProperty(pluginId)) {
            continue;
        }
        if (typeof sfp.plugins[pluginId] === 'function') {
            continue;
        }
        output[pluginId] = {
            id : pluginId,
            type : sfp.plugins[pluginId].type,
            description : sfp.plugins[pluginId].description
        };
    }
    return output;
}
module.exports = {
    'run' : run,
    'getPlugins' : getPlugins,
    'rimraf' : require('rimraf')
};
