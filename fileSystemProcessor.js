/**
 * fileSystemProcessor.js
 * 
 * @author btremblay
 * @copyright 2013 Ben Tremblay
 * @module fileSystemProcessor
 */


var _fs = require('fs');
var _path = require('path');
// var _requirejs = require('requirejs');
var _wrench = require('wrench');
var _minimatch = require('minimatch');

/** @type {SingleFileProcessor} sfp */
var sfp = require('./singleFileProcessor');

var sys = require('sys');

var FILE_ENCODING = 'utf8';

var cb = function(resultz) {
	console.log('ALL DONE');
};
var SCAN_PATH = ''; // /admin/accounting
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

/**
 * Filter files.
 * 
 * @function
 * @name filterFiles
 * @method filterFiles
 * @param files
 * @param excludes
 */
function filterFiles(files, excludes) {
	var globOpts = {
		matchBase : true,
		dot : true
	};

	excludes = excludes.map(function(val) {
		// minimatch currently have a bug with star globs
		// (https://github.com/isaacs/minimatch/issues/5)
		return _minimatch.makeRe(val, globOpts);
	});

	files = files.map(function(filePath) {
		// need to normalize and convert slashes to unix standard
		// otherwise the RegExp test will fail on windows
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
 * @function
 * @name normalizeName
 * @method normalizeName
 * @param input
 */
function normalizeName(input) {
	return input.split('_').join('-');
}

/**
 * Next file.
 * 
 * @function
 * @name nextFile
 * @method nextFile
 */
function nextFile() {
	var nextPath = queue.shift();
	var basePath = SCAN_PATH;
	var inPath = nextPath;

	sfp.processFile(basePath, inPath, outPath, testPath, docPath,
			processingChain, function(result) {
				if (result.corrupted) {
					console.error('HALTED');
					return;
				}
				results.push(result);
				delete result.undoBuffer;
				result.source = result.rawSource;
				delete result.rawSource;
				var resultsPathFile = ''; 
				if (result.packagePath.length === 0){
					resultsPathFile = resultsPath + '/' + result.fileName + '.json';
				}
				else{
					resultsPathFile = resultsPath + '/' + result.packagePath + '/' + result.fileName + '.json';
				}
				//console.warn(result);
				//console.warn(result.fileName);
				sfp.writeFile(resultsPathFile, JSON.stringify(result,
						null, 2));

				// queue = [];
				if (queue.length > 0) {
					nextFile();
				} else {
					// console.log("REALLY DONE");
					// console.log(JSON.stringify(results, null, 2));

					var now = new Date().getTime() - then;

					console.log('Processed ' + results.length + ' files. Took '
							+ (now / 1000) + ' seconds.');

					var resultsBlock = {};
					resultsBlock.results = results;
					resultsBlock.path = SCAN_PATH;
					resultsBlock.timeInSeconds = (now / 1000);

					resultsBlock.outPath = outPath;
					resultsBlock.testPath = testPath;
					resultsBlock.docPath = docPath;
					resultsBlock.resultsPath = resultsPath;

					sfp.setWriteEnable(true);
					sfp.writeFile(resultsPath + '/jsdoc-prep.json', JSON
							.stringify(resultsBlock, null, 2));

					if (cb != null) {
						cb(resultsBlock);
					}

					// console.log(JSON.stringify(sfp.getAmdConfig(), null, 2));

					
				}
			}, WRITE_NEW_FILES);
}

var queue = [];
var results = [];
var then = 0;

/**
 * Run. Invokes the file processing procedure.
 * 
 * @function
 * @name run
 * @method run
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

	function getProcs(procList) {
		var output = [];

		for (var index = 0; index < procList.length; index++) {
			var procId = procList[index];
			output.push(sfp.plugins[procId]);
		}
		return output;
	}
	//console.warn(options);
	cb = options.callBack;
	SCAN_PATH = options.scanPath;
	outPath = options.writePath;
	testPath = options.writeTestPath;
	docPath = options.writeDocPath;
	resultsPath = options.writeResultsPath;
	WRITE_NEW_FILES = options.writeEnable;
	processingChain = getProcs(options.processingChain);
	console.log('scanning source directory: ' + SCAN_PATH);

	var files = _wrench.readdirSyncRecursive(SCAN_PATH);

	// filter files that shouldn't be deleted
	// '_*',
	files = filterFiles(files, [  '.*', '.DS_Store', '{**/,}.svn{/**,}',
			'node_modules/**', 'tests/**',
			// 'js/**',
			'css/**', 'img/tmp/**', 'build.js', 'gui.html', 'package.json',
			'README.md', 'update.sh', 'yui_sdk/**', 'infrastructure/**',
			'{**/,}.html' ]);

	files.forEach(function(path) {
		path = _path.normalize(SCAN_PATH + '/' + path);
		stat = _fs.statSync(path);

		if (stat.isFile() && (path.indexOf('.js') != -1)) {
			if (_path.extname(path) === ".js") {
					//console.log(path);
				queue.push(path);
			}
		}
	});
	console.log('walking source directory...');
	then = new Date().getTime();
	nextFile();
}

/**
 * Gets the plugins exposed via singleFileProcessor. NOTE: There's no reason why
 * we can't expose plugins that are imported from other files, too.
 * 
 * @function
 * @name getPlugins
 * @method getPlugins
 * @return {Object} Dictionary of Plugin info. Methods are stripped, only fields
 *         are included.
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
	'rimraf': require('rimraf')
};