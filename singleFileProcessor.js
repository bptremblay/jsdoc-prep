/**
 * singleFileProcessor.js Single File Processor
 * 
 * @author btremblay
 * @copyright 2013 Ben Tremblay
 * @module singleFileProcessor
 */

/**
 * @class SingleFileProcessor
 * @constructor
 * @return {SingleFileProcessor}
 */
function SingleFileProcessor() { }

var ERROR_THRESHOLD = 50;
var WRITE_ENABLED = false;
var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');
var FILE_ENCODING = 'utf8';
var finishedProcessingChain = null;
var _uglifyjs = require('uglify-js');

var jsd = require('./jsDocProc');
var docletEngine = require('./parseDoclet');

var parseDoclet = docletEngine.parseDoclet;
var printDoclet = docletEngine.printDoclet;

var headerProc = {
		id: 'headerProc',
		type: 'processor',
		description: 'SAMPLE: Adds a bogus header to the file.',
		/**
		 * Single File Processor
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			input.source = '// Copyright 1987 Robot Donkey, Inc.' + '\n\n'
			+ input.source;
			doneCallback(input);
		}
};

var uglifyProc = {
		id: 'uglifyProc',
		type: 'processor',
		description: 'Calls uglify2 on the content.',
		/**
		 * Single File Processor
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			// // // console.log(input.source);
			var uglyResult = uglyDucklify(this.id, input.source);

			if (uglyResult.code !== '<ERROR>') {
				input.source = uglyResult.code;
			}
			doneCallback(input);
		}
};

var fixJSDocFormattingProc = {
		id: 'fixJSDocFormattingProc',
		type: 'processor',
		description: 'Uses esprima to fix stuff.',
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			// console.log('fixJSDocFormattingProc ' + input.name);
			var fixJSDocFormattingResult = input.source;
			// writeFile(input.processedFilePath + ".test.js", input.source);
			try{
				fixJSDocFormattingResult = docletEngine.fixDoclets(input);
			}
			catch(exxxx){
				console.error('fixJSDocFormattingProc ' + input.name + ' ' + exxxx.message + "\r\n" + exxxx.stack);
			}

			// console.warn(fixJSDocFormattingResult === input.source);
			// console.log(fixJSDocFormattingResult);
			input.source = fixJSDocFormattingResult;
			writeFile(input.processedFilePath, input.source);
			doneCallback(input);
		}
};

function createJavaClass(input, amdProcData) {
	var exportPath = 'statebaster\\src\\storefront\\modules\\';
	var classFileName = input.camelName + '.java';

	var packageSubpath = amdProcData.webPath;
	var subPackage = packageSubpath.split('/').join('.');

	var buffer = [];
	buffer.push('package storefront.modules' + subPackage + ';');
	buffer.push('import storefront.Module;');

	buffer.push('public class ' + input.camelName + ' extends Module {');

	for (var index = 0; index < amdProcData.requires.length; index++) {
		var moduleName = amdProcData.requires[index];

		if (typeof moduleName !== 'string') {
			continue;
		}

		if (moduleName.length === 0) {
			continue;
		}
		var camelName = camelize(moduleName);
		var memberName = camelName;
		memberName = memberName.split('');
		memberName[0] = memberName[0].toLowerCase();
		memberName = memberName.join('');
		buffer.push('  public ' + camelName + ' ' + memberName + ' = null;');
	}

	buffer.push('  public ' + input.camelName + '() {');
	buffer.push('  super("' + input.name + '");');
	buffer.push('  }');
	buffer.push('}');

	var src = buffer.join('\n');

	writeFile(exportPath + '/' + packageSubpath + '/' + classFileName, src);

// // // console.log(amdProcData);
// "results": {
// "amdProc": {
// "requires": [
// "url_utils",
// "wf_storage"
// ],
// "moduleName": "browser_utils",
// "AMD": true,
// "webPath": "/common/core"
// }
// },

}

var generateJavaProc = {
		id: 'generateJavaProc',
		type: 'processor',
		description: 'Writes a fake Java class for each module.',
		/**
		 * Single File Processor
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			// this is a read-only proc

			// var jsDoccerProcData = input.jsDoccerProcData;

			// "results": {
			// "amdProc": {
			// "requires": [
			// "url_utils",
			// "wf_storage"
			// ],
			// "moduleName": "browser_utils",
			// "AMD": true,
			// "webPath": "/common/core"
			// }
			// },

			var amdProcData = input.results.amdProc;

			if (amdProcData.AMD) {
				createJavaClass(input, amdProcData);
			}

			doneCallback(input);
		}
};

var AMD_DATA = {
		paths: {},
		shim: {}
};

var amdProc = {
		id: 'amdProc',
		type: 'processor',
		description: 'Gets the module name and requires[] array for the module, or nulls if not found.',
		/**
		 * Single File Processor
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			console.warn("process...");
			// {
			// "results": {},
			// "errors": {},
			// "outputDirectory":
			// "js-health-check\\processed",
			// "path":
			// "js-health-check\\js_test_resources\\v2\\common\\core\\browser_utils_spec.js",
			// "folderPath":
			// "js-health-check\\js_test_resources\\v2\\common\\core",
			// "fileName": "browser_utils_spec.js",
			// "packagePath": "\\v2\\common\\core",
			// "libFile": false,
			// "min": false,
			// "realName": "browser_utils_spec",
			// "name": "browser_utils_spec",
			// "camelName": "BrowserUtilsSpec",
			// "processedFilePath":
			// "js-health-check\\processed\\v2\\common\\core\\browser_utils_spec.js",
			// "couldParseOriginalSource": true,
			// "couldParseProcessedSource": true,
			// "corrupted": false,
			// "numberOfLines": 9
			// }

			if (input.results[this.id] == null) {
				input.results[this.id] = {};
			}
			var result = input.results[this.id];
			result.requires = [];
			result.moduleName = input.name;
			result.AMD = false;
			result.webPath = input.webPath;

			AMD_DATA.paths[result.moduleName] = 'v2' + result.webPath + '/' + result.moduleName;
			console.warn("convert...");
			var converted = convert(input.source, input.path);
			console.warn("convert DONE");
			// // // console.log(JSON.stringify(converted));

			// {
			// "callsYuiApi": false,
			// "rawSource":
			// "define( ['browser_utils'], function(browser_utils) {\r\n
			// describe('browser_utils_spec', function(){\r\n
			// describe('OpenPopup',
			// function() {\r\n });\r\n\r\n describe('CreateBookmarkLink',
			// function()
			// {\r\n
			// });\r\n });\r\n});",
			// "name": "browser_utils_spec",
			// "isShim": false,
			// "min": false,
			// "path":
			// "C:/Users/btremblay/workspace/js-health-check/js_test_resources/v2/common/core/browser_utils_spec.js",
			// "isModule": true,
			// "isMain": false,
			// "requires": ["'browser_utils'"],
			// "source":
			// "define(\"browser_utils_spec\", ['browser_utils'],
			// function(browser_utils)
			// {\r\n describe('browser_utils_spec', function(){\r\n
			// describe('OpenPopup',
			// function() {\r\n });\r\n\r\n describe('CreateBookmarkLink',
			// function()
			// {\r\n
			// });\r\n });\r\n});",
			// "libFile": false,
			// "realName": "browser_utils_spec"
			// }

			function fixRequires(inputArray) {
				var result = [];

				for (var index = 0; index < inputArray.length; index++) {
					var temp = inputArray[index];

					if (temp == null) {
						continue;
					}

					if (temp.length === 0) {
						continue;
					}
					temp = temp.split("'").join('');
					result.push(trim(temp));
				}

				return result;
			}
			console.warn("fixRequires...");
			result.requires = fixRequires(converted.requires);
			console.warn("fixRequires DONE");
			result.moduleName = converted.name;
			result.AMD = converted.isModule;

			doneCallback(input);
		}
};

function genDoc(fileName, callBackDone) {
	var jsdog = require('jsdog');

	var util = require('util');
	var fs = require('fs');
	var jade = require('jade');
	var jsdog = require('jsdog');
	var nopt = require('nopt');
	var Stream = require('stream').Stream;
	var path = require('path');
	var knownOpts = {
			'source': path,
			'tests': path,
			'template': path,
			'title': String,
			'dump': Boolean,
			'loglevel': Number,
			'help': Boolean,
			'wrap': String,
			'ignore': Boolean
	}, shortOpts = {
			's': '--source',
			't': '--tests',
			'm': '--template',
			'n': '--title',
			'v': [
			      '--loglevel',
			      '2'
			      ],
			      'h': '--help',
			      'w': '--wrap',
			      'i': '--ignore'
	};

	var parsed = {
			'source': fileName
	};

	var jadeOpts = {}, filename = parsed.source, qunitTestFile = parsed.tests ? fs.readFileSync(parsed.tests) + '' : '',
			templateFile = parsed.template ? parsed.template : path.dirname(require.resolve('jsdog')) + '/default.jade', pageTitle = parsed.title ? parsed.title : path.basename(filename),
					dumpAfterParse = parsed.dump ? parsed.dump : false, ll = parsed.loglevel ? parsed.loglevel : 0, wrapper = parsed.wrap ? parsed.wrap : false;

	if (!pageTitle) {
		pageTitle = filename;
	}

	// main //
	jsdog.parseSourceFile(filename, parsed, function(data) {

		jadeOpts.locals = {
				pageTitle: pageTitle,
				docs: data.docs,
				genTime: data.genTime,
				src: data.src
		};

		jade.renderFile(templateFile, jadeOpts, function(err, html) {
			if (err) {
				throw err;
			}

			callBackDone(html);
		});
	});
}

var jsDogProc = {
		id: 'jsDogProc',
		type: 'processor',
		description: 'Generates jsDog markdown. TODO: template',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var jsdog = require('jsdog');

			// var testFile =
			// "jsdoc-preptoolkit\\processed\\js\\toolkit\\logger.js";
			var path = '';

			if (WRITE_ENABLED) {
				path = input.processedFilePath;
			} else {
				path = input.path;
			}

			try {
				genDoc(path, function done(html) {
					input.documentation = html;
					writeFile(input.processedFilePath + '.html', html);
					doneCallback(input);
				});
				// jsdog.parseSourceFile(path, {}, function done(x) {
				// // // // console.log(JSON.stringify(x, null, 2));
				// input.documentation = x;
				// doneCallback(input);
				// });
				input.errors[this.id] = ex.message;
				doneCallback(input);
			} catch (e) {
				// console.error(e);
			}

			// // // console.log( JSON.stringify(y, null, 2));

		}
};

var yuiDocProc = {
		id: 'yuiDocProc',
		type: 'processor',
		description: 'Generates yuidoc JSON. TODO: template',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			/**
			 * @param fileNameIn
			 * @param sourceIn
			 */
			function runYuiDocOnFile(fileNameIn, sourceIn) {

				var yuidoc = require('yuidocjs');
				var _fs = require('fs');
				var _path = require('path');

				var jsonResult = {};
				var fileName = _path.normalize(fileNameIn);
				var fileParentDirectory = _path.dirname(fileName);
				var fileSource = '';
				var fileOutputDirectory = './out';

				if (sourceIn != null) {
					fileSource = sourceIn;
				} else {
					fileSource = readFile(fileName);
				}

				/**
				 * Read file.
				 * 
				 * @name readFile
				 * @method readFile
				 * @param filePathName
				 */
				function readFile(filePathName) {
					var FILE_ENCODING = 'utf8';
					filePathName = _path.normalize(filePathName);
					var source = '';

					try {
						source = _fs.readFileSync(filePathName, FILE_ENCODING);
					} catch (er) {
						// console.error(er.message);
					}

					return source;
				}

				var options = {
						quiet: true,
						writeJSON: false,
						outdir: fileOutputDirectory,
						extension: '.js',
						// exclude:
						// '.DS_Store,.svn,CVS,.git,build_rollup_tmp,build_tmp,node_modules',
						norecurse: true,
						// version : '0.1.0',
						paths: [fileParentDirectory],
						// themedir : path.join(__dirname, 'themes', 'default'),
						syntaxtype: 'js',
						parseOnly: true
						// lint: true
				};

				var docParserConfig = {
						syntaxtype: 'js',
						filemap: {
							fileName: fileSource
						},
						dirmap: {
							fileName: fileParentDirectory
						}
				};

				try {
					var yd = new yuidoc.YUIDoc(options);
					var parser = new yuidoc.DocParser(docParserConfig);
					var parsed = parser.parse();
					json = yd.writeJSON(parsed);
					// // console.error(jd);
					jsonResult.result = json;
				} catch (e) {
					// // console.error(e);
					jsonResult.error = e;
				}
				return jsonResult;
			}
			var path = '';

			if (WRITE_ENABLED) {
				path = input.processedFilePath;
			} else {
				path = input.path;
			}

			var docData = runYuiDocOnFile(path, input.source);
			// input.yuidoc = docData;

			if (docData.error != null) {
				input.errors[this.id] = [docData.error];
			} else {
				input.results[this.id] = docData.result;
			}

			doneCallback(input);
		}
};

var jsDocGenProc = {
		id: 'jsDocGenProc',
		type: 'processor',
		description: 'Generates jsDoc annotation using home-made script.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			input.source = jsd.generateJsDoc(input.source, input.path);
			doneCallback(input);
		}
};

var fixClassDeclarationsProc = {
		id: 'fixClassDeclarationsProc',
		type: 'processor',
		description: 'Annotates class declarations that may not have a constructor.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var lines = input.source.split('\n');

			for (var index = 0; index < lines.length; index++) {
				lines[index] = addExtendsAnnotation(input, lines, index);
			}
			input.source = lines.join('\n');

			writeFile(input.processedFilePath, input.source);
			doneCallback(input);
		}
};

// SelectAddressView = BaseView.extend({
// BaseView = Backbone.View.extend({
// Y.extend(LookBook, Y.Modal, {
// var metricsToRemove = $.extend([],container_graph._addedMetricIds);
// container_graph.options.chart = new Highcharts.StockChart($.extend(true,
// container_graph._chartOptions, {

/**
 * Add extends annotation.
 * 
 * @name addExtendsAnnotation
 * @method addExtendsAnnotation
 * @param {Object}
 *            inputObject
 * @param linesArray
 * @param whereInlines
 */
function addExtendsAnnotation(inputObject, linesArray, whereInlines) {
	var instance = linesArray[whereInlines];

	if (instance.indexOf('.extend(') !== -1 || instance.indexOf('.extend (') !== -1) {
		var source = '<?source?>';
		var dest = '<?destination?>';
		var extender = '?';
		var usingBackBone = false;
		var notAClass = false;

		var splitter = instance.split('\.extend');
		var leftOfExtend = trim(splitter[0]);

		if (leftOfExtend.indexOf('=') !== -1) {
			var extenderSplit = leftOfExtend.split('=');
			dest = trim(extenderSplit[0]);

			if (dest.indexOf('var ') !== -1) {
				dest = trim(dest.substring(4));
			}

			extender = trim(extenderSplit[1]);

			if (extenderSplit.indexOf(' new ') !== -1) {
				notAClass = true;
			}
		}

		if ((extender == '$') || (extender == '_') || (extender == 'YUI()') || (extender == 'Y')) {
			// the source is an argument
			if (extender == 'Y') {
				var expression = splitter[1];
				var afterLeftParenthesis = expression.split('(')[1];
				var firstItem = afterLeftParenthesis.split(',')[0];
				source = firstItem;
			} else if (extender == '$') {
				var expression = splitter[1];
				var afterLeftParenthesis = expression.split('(')[1];

				if (afterLeftParenthesis.indexOf(')') !== -1) {
					afterLeftParenthesis = afterLeftParenthesis.split(')')[0];
				}
				var splitArgs = afterLeftParenthesis.split(',');
				var firstItem = splitArgs[0];
				source = firstItem;
				// could be more than 2 items, but I don't care now...

				if (splitArgs.length > 1) {
					var secondItem = '';
					secondItem = afterLeftParenthesis.split(',')[1];
					source = secondItem;
				}
			}
		} else {
			usingBackBone = true;
			// the source is the extender, like Backbone.Model....
			source = extender;
		}

		if (dest.indexOf('.') !== -1) {
			notAClass = true;
		}

		if (!isUpperCase(dest.charAt(0))) {
			notAClass = true;
		}

		if (usingBackBone && !notAClass) {
			console.log("Backbone: " + inputObject.name);
			// FIXME: must work with existing jsDoc annotations
			var previousComment = getLastJsDocComment(inputObject, linesArray, whereInlines);

			if (previousComment.description != null) {
				// console.warn(inputObject.processedFilePath + ' @@ '
				// + JSON.stringify(previousComment));
			}

			instance = '/**\n * @constructor ' + dest + '\n * @augments ' + source + '\n */\n' + instance;
		}

		if (!notAClass) {

			// // console.warn(trim(instance));
			// // console.warn(inputObject.fileName + ": found EXTEND using ("
			// + extender + ") " + dest + " EXTENDS >>> " + source);
		}
	}
	return instance;
}

/**
 * Get last js doc comment.
 * 
 * @name getLastJsDocComment
 * @method getLastJsDocComment
 * @param {Object}
 *            inputObject
 * @param linesIn
 * @param topOfBlock
 * @return {Object}
 */
function getLastJsDocComment(inputObject, linesIn, topOfBlock) {
	var inComment = false;
	var buffer = [];
	var comments = {};
	var indx = 0;

	for (indx = topOfBlock; indx > -1; indx--) {
		var line = trim(linesIn[indx]);

		// // console.warn(indx + " : " + line);

		// stop if not a comment
		// stop if comment begins
		if (line.length > 0) {
			if (line.indexOf('*/') !== -1) {
				if (line.indexOf('/**') !== -1) {
					// single-line jsDoc comment
					buffer.push(line);
				} else if (line.indexOf('/*') !== -1) {
					// single-line comment
					buffer.push(line);
				} else {
					inComment = true;
					continue;
				}
			} else if (line.indexOf('/*') !== -1) {
				if (inComment) {
					if (line.indexOf('/**') !== -1) {
						// jsDoc comment begins
					}
				}
				inComment = false;

				// // console.warn(buffer.join("\n"));
				var inDescription = true;
				var desc = '';

				for (var x = 0; x < buffer.length; x++) {
					// // console.warn(x + "," + inDescription);
					var chunk = trim(buffer[x]);
					chunk = chunk.split('*');
					chunk.shift();
					chunk = trim(chunk.join('*'));

					if (chunk.indexOf('@') === 0) {
						chunk = chunk.substring(1);
						var tagName = chunk.split(' ').shift();
						// it's an annotation

						comments[tagName] = chunk;

						if (inDescription) {
							inDescription = false;
						}
					} else {
						if (inDescription) {
							if (desc.length > 0) {
								desc += '\n';
							}
							desc += chunk;
						}
					}
				}

				comments.description = desc;
				// // console.warn(inputObject.fileName + " : " +
				// JSON.stringify(comments));
				return comments;
			}

			if (inComment) {
				buffer.push(line);
			}
		}
	}
	return comments;
}

var badCharactersProc = {
		id: 'badCharactersProc',
		type: 'processor',
		description: 'Substitutes some bad characters.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			/**
			 * Check expression.
			 * 
			 * @name checkExpression
			 * @method checkExpression
			 * @param {Object}
			 *            inputObject
			 * @param {string}
			 *            id
			 * @param {string}
			 *            src
			 * @param {string}
			 *            wrong
			 * @param {string}
			 *            right
			 * @return {string}
			 */
			function checkExpression(inputObject, id, src, wrong, right) {
				if (src.indexOf(wrong) !== -1) {
					var wrongName = wrong;

					if (wrongName == '\t') {
						wrongName = "'\\t'";
					} else if (wrongName == '\r\n') {
						wrongName = "'\\r\\n'";
					} else if (wrongName == '\r') {
						wrongName = "'\\r'";
					}

					if (inputObject.errors[id] == null) {
						inputObject.errors[id] = [];
					}
					// // // console.log(inputObject.fileName + ": found " +
					// wrongName);
					var error = {
							'id': '(error)',
							'raw': 'Bad character(s) found.',
							'code': 'wfBC',
							'evidence': '',
							'line': -1,
							'character': -1,
							'scope': '(main)',
							'a': '',
							'reason': "Bad character(s) found: '" + wrongName + "'."
					};

					inputObject.errors[id].push(error);
					src = src.split(wrong).join(right);
				}
				return src;
			}

			input.source = checkExpression(input, this.id, input.source, '\r\n', '\n');
			input.source = checkExpression(input, this.id, input.source, '\r', '\n');
			input.source = checkExpression(input, this.id, input.source, '\t', '  ');

			writeFile(input.processedFilePath, input.source);
			doneCallback(input);
		}
};

var jsDocNameFixerProc = {
		id: 'jsDocNameFixerProc',
		type: 'processor',
		description: 'Substitutes some jsDoc tokens.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			/**
			 * Check expression.
			 * 
			 * @name checkExpression
			 * @method checkExpression
			 * @param {Object}
			 *            inputObject
			 * @param id
			 * @param src
			 * @param wrong
			 * @param right
			 */
			function checkExpression(inputObject, id, src, wrong, right) {
				if (src.indexOf(wrong) !== -1) {
					var wrongName = wrong;

					if (wrongName == '\t') {
						wrongName = "'\\t'";
					} else if (wrongName == '\r\n') {
						wrongName = "'\\r\\n'";
					} else if (wrongName == '\r') {
						wrongName = "'\\r'";
					}

					// // // console.log(inputObject.fileName + ": found " +
					// wrongName);
					var error = {
							'id': '(error)',
							'raw': 'jsDoc tag error.',
							'code': 'wfJD',
							'evidence': '',
							'line': -1,
							'character': -1,
							'scope': '(main)',
							'a': '',
							'reason': "jsDoc tag error: found '" + wrongName + "'."
					};

					inputObject.errors[id].push(error);
					src = src.split(wrong).join(right);
				}
				return src;
			}

			// FIXME: only do this IF the comment has @
			// input.source = checkExpression(input, this.id, input.source,
			// "/*\n",
			// "/**\n");

			var src = trim(input.source);
			var lineOne = src.split('\n')[0];

			if ((lineOne.indexOf('/*') !== -1) && (lineOne.indexOf('/**') === -1)) {
				var error = {
						'id': '(error)',
						'raw': 'jsDoc tag error.',
						'code': 'wfJD',
						'evidence': lineOne,
						'line': 0,
						'character': 0,
						'scope': '(main)',
						'a': '',
						'reason': 'jsDoc tag error: Comment at top of file begins with /*, not /**.'
				};

				// // console.warn(error);
				input.errors[this.id].push(error);
			}

			input.source = checkExpression(input, this.id, input.source, '@return nothing', '');
			input.source = checkExpression(input, this.id, input.source, '@return void', '');
			input.source = checkExpression(input, this.id, input.source, '@return nada', '');
			input.source = checkExpression(input, this.id, input.source, '@param Object', '@param {Object}');
			input.source = checkExpression(input, this.id, input.source, '@returns ', '@return ');
			input.source = checkExpression(input, this.id, input.source, '@param object', '@param {Object}');
			input.source = checkExpression(input, this.id, input.source, '@param Array', '@param {Array}');
			input.source = checkExpression(input, this.id, input.source, '@param String', '@param {String}');
			input.source = checkExpression(input, this.id, input.source, '@param bool', '@param {Boolean}');
			input.source = checkExpression(input, this.id, input.source, '@param boolean', '@param {Boolean}');
			input.source = checkExpression(input, this.id, input.source, '@param {bool}', '@param {Boolean}');
			input.source = checkExpression(input, this.id, input.source, '@param int', '@param {Number}');
			input.source = checkExpression(input, this.id, input.source, '@param float', '@param {Number}');

			writeFile(input.processedFilePath, input.source);
			doneCallback(input);
		}
};

// 'parseFilter' : parseFilter,
// 'yuiFilter' : yuiFilter,
// 'amdFilter' : amdFilter,

var parseFilter = {
		id: 'parseFilter',
		type: 'filter',
		description: 'Filters out js files that cannot be parsed.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var _esprima = require('esprima');

			try {
				var ast = _esprima.parse(input.source);
				doneCallback(input);
			} catch (ex) {
				// // console.error("ERROR: in '" + moduleName + "', " +
				// ex.message);
				input.errors[this.id] = ex.message;
				finishedProcessingChain();
			}
		}
};

/**
 * @param {String}
 *            input
 * @return {Boolean}
 */
function scanForMinifiedLines(input) {
	var lines = input.split('\n');
	var linesLength = lines.length;
	var strikes = 0;

	for (var index = 0; index < linesLength; index++) {
		var line = lines[index].trim();

		if (line.length > 200) {
			strikes++;

			if (strikes > 2) {
				// console.warn('scanForMinifiedLines: ' + line.length + ' ' +
				// line);
				return true;
			}
		} else {
			strikes = 0;
		}
	}
	return false;
}

var minFilter = {
		id: 'minFilter',
		type: 'filter',
		description: 'Filters out js files that are minified.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			if (input.fileName.indexOf('.min.js') !== -1 || input.fileName.indexOf('-min.js') !== -1) {
				// input.errors[this.id] = "Filtered minified file.";
				// console.warn('ignore minified file: ' + input.path);
				finishedProcessingChain();
			}
			// or if code contains a minified block?
			else if (scanForMinifiedLines(input.source)) {
				// input.errors[this.id] = "Filtered minified file.";
				// console.warn('ignore file with minified code: ' +
				// input.path);
				finishedProcessingChain();
			} else {
				doneCallback(input);
			}
		}
};

var yuiFilter = {
		id: 'yuiFilter',
		type: 'filter',
		description: 'Filters out js files that are not YUI modules.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var temp = input.source;
			var stripped = stripOneLineComments(stripCComments(temp));
			var yuiAdd_A = (stripped.indexOf('YUI().add(') !== -1);
			var yuiAdd_B = (stripped.indexOf('YUI.add(') !== -1);

			if (yuiAdd_A || yuiAdd_B) {
				doneCallback(input);
			} else {
				// input.errors[this.id] = "Not a YUI Module.";
				finishedProcessingChain();
			}
		}
};

var amdFilter = {
		id: 'amdFilter',
		type: 'filter',
		description: 'Filters out js files that are not AfMD modules.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			temp = input.source;
			var stripped = stripOneLineComments(stripCComments(temp));
			var isModule = stripped.indexOf('define(') !== -1;
			var isMain = stripped.indexOf('require(') !== -1;

			if (isModule || isMain) {
				doneCallback(input);
			} else {
				// input.errors[this.id] = "Not an AMD Module.";
				finishedProcessingChain();
			}
		}
};

var thirdPartyFilter = {
		id: 'thirdPartyFilter',
		type: 'filter',
		description: 'Filters out js files in defined 3rd party directories.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var temp = input.path;
			var pathDelim = temp.indexOf('/') == -1 ? '\\' : '/';

			// && (input.fileName.indexOf('wf_anim') === -1)
			if ((input.fileName.indexOf('afc') === -1) && (input.fileName.indexOf('corsframe') === -1) && (input.fileName.indexOf('foresee') === -1)) {
				if (temp.indexOf(pathDelim + 'lib') === -1
						&& temp.indexOf(pathDelim + 'yui_sdk') === -1 && temp.indexOf(pathDelim + 'infrastructure') === -1 && input.source.indexOf('ShockwaveFlash') === -1) {
					doneCallback(input);
				} else {
					input.errors[this.id] = 'In a designated 3rd party folder.';
					finishedProcessingChain();
					// console.warn('3rdparty FAIL ' + temp);
				}
			} else {
				input.errors[this.id] = 'In a designated 3rd party folder.';
				finishedProcessingChain();
				// console.warn('3rdparty FAIL ' + input.name);
			}
		}
};

var amdOrYuiFilter = {
		id: 'amdOrYuiFilter',
		type: 'filter',
		description: 'Filters out js files that are not valid modules.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			temp = input.source;
			var stripped = stripOneLineComments(stripCComments(temp));
			var yuiAdd_A = (stripped.indexOf('YUI().add(') !== -1);
			var yuiAdd_B = (stripped.indexOf('YUI.add(') !== -1);
			var isModule = stripped.indexOf('define(') !== -1;
			var isMain = stripped.indexOf('require(') !== -1;

			if ((yuiAdd_A || yuiAdd_B || isModule || isMain) && (temp.indexOf('@license') == -1) && (temp.indexOf('define.amd') == -1) && (temp.indexOf('Yahoo! Inc') == -1)) {
				input.moduleFile = true;
				doneCallback(input);
			} else {
				input.moduleFile = false;
				// input.errors[this.id] = "Not an AMD Module.";
				// console.warn('ignore non-module file: ' + input.path);
				finishedProcessingChain();
			}
		}
};

var jsBeautifyProc = {
		id: 'jsBeautifyProc',
		type: 'processor',
		description: 'node-js-beautify module. TODO: add options support.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			// input.source = "// Copyright 1987 Robot Donkey, Inc." + "\n\n"
			// + input.source;

			/**
			 * Unpacker_filter.
			 * 
			 * @name unpacker_filter
			 * @method unpacker_filter
			 * @param source
			 */
			function unpacker_filter(source) {
				var trailing_comments = '', comment = '', unpacked = '', found = false;

				// cut trailing comments
				do {
					found = false;

					if (/^\s*\/\*/.test(source)) {
						found = true;
						comment = source.substr(0, source.indexOf('*/') + 2);
						source = source.substr(comment.length).replace(/^\s+/, '');
						trailing_comments += comment + '\n';
					} else if (/^\s*\/\//.test(source)) {
						found = true;
						comment = source.match(/^\s*\/\/.*/)[0];
						source = source.substr(comment.length).replace(/^\s+/, '');
						trailing_comments += comment + '\n';
					}
				} while (found);

				var unpackers = [P_A_C_K_E_R, Urlencoded, JavascriptObfuscator, MyObfuscate];

				for (var i = 0; i < unpackers.length; i++) {
					if (unpackers[i].detect(source)) {
						unpacked = unpackers[i].unpack(source);

						if (unpacked != source) {
							source = unpacker_filter(unpacked);
						}
					}
				}

				return trailing_comments + source;
			}

			var beautify = require('js-beautify');

			input.source = beautify(input.source, {
				'indent_size': 2,
				'indent_char': ' ',
				'indent_level': 0,
				'indent_with_tabs': false,
				'preserve_newlines': true,
				'max_preserve_newlines': 10,
				'jslint_happy': false,
				'brace_style': 'collapse',
				'keep_array_indentation': false,
				'keep_function_indentation': false,
				'space_before_conditional': true,
				'break_chained_methods': false,
				'eval_code': false,
				'unescape_strings': false,
				'wrap_line_length': 200
			});

			writeFile(input.processedFilePath, input.source);

			/*
			 * { "indent_size": 2, "indent_char": " ", "indent_level": 0,
			 * "indent_with_tabs": false, "preserve_newlines": true,
			 * "max_preserve_newlines": 1, "jslint_happy": false, "brace_style":
			 * "collapse", "keep_array_indentation": false,
			 * "keep_function_indentation": false, "space_before_conditional":
			 * true, "break_chained_methods": false, "eval_code": false,
			 * "unescape_strings": false, "wrap_line_length": 80,
			 * "space_after_anon_function": true, "indent_scripts": true }
			 */

			/*
			 * opts.indent_size = $('#tabsize').val(); opts.indent_char =
			 * opts.indent_size == 1 ? '\t' : ' '; opts.max_preserve_newlines =
			 * $('#max-preserve-newlines').val(); opts.preserve_newlines =
			 * opts.max_preserve_newlines !== -1; opts.keep_array_indentation =
			 * $('#keep-array-indentation').prop('checked');
			 * opts.break_chained_methods =
			 * $('#break-chained-methods').prop('checked'); opts.indent_scripts =
			 * $('#indent-scripts').val(); opts.brace_style =
			 * $('#brace-style').val(); opts.space_before_conditional =
			 * $('#space-before-conditional').prop('checked');
			 * opts.unescape_strings = $('#unescape-strings').prop('checked');
			 * opts.wrap_line_length = $('#wrap-line-length').val();
			 * opts.space_after_anon_function = true;
			 */
			doneCallback(input);
		}
};
var jsHintProc = {
		id: 'jsHintProc',
		type: 'processor',
		description: 'node jsHint module. TODO: add options support.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			// writeFile(input.processedFilePath, input.source);

			// if (!canParse(input.processedFilePath, input.source)) {
			// doneCallback(input);
			// return;
			// }
			var JSHINT = require('jshint').JSHINT;

			var options = {
					browser: true,
					curly: true,
					eqnull: true,
					camelcase: true,
					yui: true,
					jquery: true,
					undef: true,
					shadow: false,
					validthis: false,
					newcap: true
			};

			var globals = {
					'YUI_config': false,
					'define': false,
					'require': false,
					'FB': false,
					'OA_output': false
			};

			JSHINT.errors = null;
			var success = JSHINT(input.source, options, globals);
			// // // console.log("jshint errors: " + JSHINT.errors.length);
			input.errors[this.id] = JSHINT.errors;
			JSHINT.errors = null;

			doneCallback(input);
		}
};

var trimProc = {
		id: 'trimProc',
		type: 'processor',
		description: 'Trim each line of the file.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var source = input.source;
			var lines = source.split('\n');

			for (var index = 0; index < lines.length; index++) {
				var line = lines[index];
				line = trim(line);

				// if (line.indexOf('//') === 0) {
				// line = line + '\n';
				// }
				lines[index] = line;
			}
			input.source = lines.join('\n');
			doneCallback(input);
		}
};

var esFormatterProc = {
		id: 'esFormatterProc',
		type: 'processor',
		description: 'esprima beautify',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var source = input.source;

			var esformatter = require('esformatter');

			// for a list of available options check "lib/preset/default.json"
			var options = {
					// inherit from the default preset
					preset: 'default',
					indent: {
						value: '  '
					},
					lineBreak: {
						before: {
							BlockStatement: 1,
							DoWhileStatementOpeningBrace: 1
							// ...
						}
					},
					whiteSpace: {
						// ...
					}
			};

			// return a string with the formatted code
			input.source = esformatter.format(source, options);

			doneCallback(input);
		}
};

var gsLintProc = {
		id: 'gsLintProc',
		type: 'processor',
		description: 'Runs Closure gjslint tool. TODO: add logging.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}
			var self = this;

			/**
			 * Run gjs lint.
			 * 
			 * @name runGjsLint
			 * @method runGjsLint
			 * @param fileName
			 */
			function runGjsLint(fileName) {
				fileName = _path.normalize(fileName);
				var exePath = _path.normalize('"C:\\Program Files (x86)\\Python\\Scripts\\gjslint.exe"');
				// // console.warn('runGjsLint: ' + exePath + ' <> ' +
				// fileName);
				var exec = require('child_process').exec;
				var cmdLine = exePath + ' --nojsdoc ' + fileName;
				// // // console.log(cmdLine);

				var child = exec(cmdLine, function(error, stdout, stderr) {

					// normal
					// // // console.log(stdout);
					var report = [];
					var results = stdout.split('\r\n');

					for (var line = 0; line < results.length; line++) {
						var resultLine = results[line];

						if (resultLine.indexOf('Line ') === 0) {
							// report.push(resultLine);
							// "Line 127, E:0110: Line too long (97
							// characters).",
							var lineNumber = resultLine.split(',')[0];
							lineNumber = trim(lineNumber.split(' ')[1]);
							var errorCode = trim(resultLine.split(',')[1].split(': ')[0]);
							var reason = trim(resultLine.split(': ')[1]);
							var error = {
									'id': '(error)',
									'raw': reason,
									'code': errorCode,
									'evidence': '',
									'line': parseInt(lineNumber),
									'character': -1,
									'scope': '(main)',
									'a': '',
									'reason': reason
							};

							report.push(error);
						}
					}
					// // // console.log("gjslint errors: " + report.length);
					input.errors[self.id] = report;
				});
				/**
				 * Handler for close event.
				 * 
				 * @name close
				 * @method close
				 * @param code
				 */
				child.on('close', function(code) {
					// // // console.log('child process exited with code ' +
					// code);
					var source = readFile(fileName);
					input.source = source;
					doneCallback(input);
				});
			}

			var path = '';

			if (WRITE_ENABLED) {
				path = input.processedFilePath;
			} else {
				path = input.path;
			}
			runGjsLint(path);
		}
};

var jsDoccerProc = {
		id: 'jsDoccerProc',
		type: 'processor',
		description: 'Runs jsDoccer java tool.',
		/**
		 * Process.
		 * 
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			/**
			 * Run js doccer.
			 * 
			 * @name runJsDoccer
			 * @method runJsDoccer
			 * @param fileName
			 */
			function runJsDoccer(fileName, id) {
				// // // console.log(input);
				// fileName = _path.normalize(fileName);

				// folderPath: 'D:\\code\\resources\\st4\\includes\\js\\admin',
				// fileName: 'admin_tracking.js',
				// packagePath: '\\admin',

				var exePath = 'java -jar jsdoccer.jar';
				var exec = require('child_process').exec;
				var basePath = _path.normalize(input.outputDirectory + '/'
						+ input.packagePath);
				var name = input.fileName;

				// var basePath =
				// 'D:\\code\\resources\\st4\\includes\\js\\push';
				// var name = 'servergroups.js';
				// var content = escape(input.source);

				// var outputPath = input.processedFilePath;

				var child = exec(exePath + ' ' + basePath + ' ' + name, function(error, stdout, stderr) {
					if (error) {
						// console.error(stderr);
					}

					// // // console.log(stdout);
					var splitter = stdout.split('/*wf_parser_data*/');

					try {
						input.jsDoccerProcData = JSON.parse(unescape(splitter[0]));
						// // //
						// console.log(JSON.stringify(input.jsDoccerProcData));

						var classes = input.jsDoccerProcData.classes;

						if (classes[input.camelName] == null) {

							var classArray = [];

							for (var c in classes) {
								classArray.push(classes[c]);
							}

							if (classArray.length > 0) {
								// console.warn('Inferenced class name is wrong:
								// ' +
										// input.camelName + ' is not found.');
								// // console.warn(JSON.stringify(classArray));
								input.possibleClassname = classArray[0].name;
							}
						}

						// "classes": {
						// "Clipboard": {
						// "name": "Clipboard",
						// "visibility": "public",
						// "constructor": true,
						// "static": false,
						// "lineNumber": 48,
						// "memberOf": "",
						// "args": [
						// "boardData"
						// ],
						// "return": "void",
						// "classDeclarationFlag": true,
						// "line": "function Clipboard(boardData) {"
						// }
						// },

						var methods = input.jsDoccerProcData.methods;

						for (var m = 0; m < methods.length; m++) {
							var method = methods[m];

							if (method.visibility == 'public') {
								if (method.originalJsDocDescription == null) {
									method.originalJsDocDescription = {};
								}
								var keys = [];

								for (var k in method.originalJsDocDescription) {
									if (method.originalJsDocDescription.hasOwnProperty(k)) {
										keys.push(method.originalJsDocDescription[k]);
									}
								}

								if (keys.length === 0) {
									var lineNumber = method.lineNumber;
									var reason = "No jsDoc Comments for method '" + method.name + "'.";
									var error = {
											'id': '(error)',
											'raw': reason,
											'code': 'wfJD',
											'evidence': method.line,
											'line': lineNumber,
											'character': -1,
											'scope': '(main)',
											'a': '',
											'reason': reason
									};

									input.errors[id].push(error);
									// // console.warn(error);
								}
							}
						}
					} catch (ex) {
						// console.error(ex);
						input.jsDoccerProcData = null;
					}

					// writeFile(input.processedFilePath + ".json",
					// JSON.stringify(input.jsDoccerProcData, null, 2));

					// BPT NO NO NO
					input.source = unescape(splitter[1]);

					input.testStubs = unescape(splitter[2]);
					writeFile(input.processedFilePath, input.source);
				});

				/**
				 * Handler for close event.
				 * 
				 * @name close
				 * @method close
				 * @param code
				 */
				child.on('close', function(code) {
					// // // console.log('child process exited with code ' +
					// code);

					doneCallback(input);
				});
			}
			var path = '';

			if (WRITE_ENABLED) {
				path = input.processedFilePath;
			} else {
				path = input.path;
			}
			runJsDoccer(path, this.id);
		}
};



// read the file
// process the file
// write the file

/**
 * Test.
 * 
 * @name test
 * @method test
 */
function test() {

	var basePath = 'jsdoc-preptoolkit';
	var inPath = 'jsdoc-preptoolkit\\includes\\js\\toolkit\\toolkit.js';
	var outPath = 'jsdoc-preptoolkit\\processed';
	var testPath = 'jsdoc-preptoolkit\\jstests';
	var docPath = 'jsdoc-preptoolkit\\jsdocs';
	processFile(basePath, inPath, outPath, testPath, docPath, [
	                                                           // trimProc,
	                                                           // headerProc,
	                                                           // jsBeautifyProc,
	                                                           // jsHintProc

	                                                           gsLintProc], function(result) {
		// // console.log(JSON.stringify(result, null, 2));
	});
}

// test();

/**
 * Read file.
 * 
 * @name readFile
 * @method readFile
 * @param filePathName
 */
function readFile(filePathName) {
	filePathName = _path.normalize(filePathName);
	var source = '';

	try {
		source = _fs.readFileSync(filePathName, FILE_ENCODING);
	} catch (er) {
		// console.error(er.message);
	}

	return source;
}

/**
 * Write file.
 * 
 * @name writeFile
 * @memberOf SingleFileProcessor
 * @method writeFile
 * @param filePathName
 * @param source
 */
function writeFile(filePathName, source) {
	if (WRITE_ENABLED) {
		filePathName = _path.normalize(filePathName);
		safeCreateFileDir(filePathName);
		_fs.writeFileSync(filePathName, source);
	}
}

/**
 * Sets write-enable propery for writeFile method.
 * 
 * @name setWriteEnable
 * @memberOf SingleFileProcessor
 * @method setWriteEnable
 * @param {boolean}
 *            val
 */
function setWriteEnable(val) {
	WRITE_ENABLED = val;
}

/**
 * Process file.
 * 
 * @name processFile
 * @method processFile
 * @memberOf SingleFileProcessor
 * @param baseDirectory
 * @param filePathName
 * @param outputDirectory
 * @param testDirectory
 * @param docDirectory
 * @param processorChain
 * @param completionCallback
 * @param writeEnable
 */

function processFile(baseDirectory, filePathName, outputDirectory,testDirectory, docDirectory, processorChain, completionCallback,writeEnable) {
	WRITE_ENABLED = writeEnable = writeEnable != null ? writeEnable : false;
	finishedProcessingChain = _finishedProcessingChain;
	// // // console.log(filePathName);
	var output = {};
	output.results = {};
	output.errors = {};
	output.outputDirectory = outputDirectory;
	var outputfilePathName = '';

	baseDirectory = _path.normalize(baseDirectory);
	filePathName = _path.normalize(filePathName);
	outputDirectory = _path.normalize(outputDirectory);
	output.path = filePathName;

	if (filePathName.indexOf(baseDirectory) == -1) {
		output.error = 'filePathName does not contain base directory';
		return output;
	}

	safeCreateDir(testDirectory);
	safeCreateDir(docDirectory);
	safeCreateDir(outputDirectory);
	var wholePath = filePathName.split('\\');
	var fileName = wholePath.pop();
	wholePath = wholePath.join('\\');
	output.folderPath = wholePath;
	output.fileName = fileName;
	output.packagePath = wholePath.substring(baseDirectory.length);
	output.webPath = output.packagePath.split('\\').join('/');
	var outputSourceDir = _path.normalize(outputDirectory + '/'
			+ output.packagePath);
	safeCreateDir(outputSourceDir);
	outputfilePathName = outputSourceDir + '/' + output.fileName;
	outputfilePathName = _path.normalize(outputfilePathName);
	var libFile = false;
	var min = (filePathName.indexOf('.min.') !== -1) || (filePathName.indexOf('-min.') !== -1);

	libFile = (filePathName.indexOf('infrastructure') !== -1) || (filePathName.indexOf('yui_sdk') !== -1) || min;

	output.libFile = libFile;

	output.min = min;

	var moduleName = getModuleName(filePathName);

	if ((moduleName.indexOf('/') !== -1)) {
		// // // console.log("BAD MODULE NAME: " + moduleName + ", " +
		// filePathName);
		moduleName = moduleName.split('/').pop();
	}

	output.realName = moduleName;
	output.name = normalizeName(moduleName);
	output.camelName = camelize(output.name);

	var source = readFile(filePathName);
	output.rawSource = source;
	output.source = source;
	output.processedFilePath = outputfilePathName;

	var currentChainIndex = 0;

	/**
	 * Run next processor.
	 * 
	 * @name runNextProcessor
	 * @method runNextProcessor
	 */
	function runNextProcessor() {
		output.undoBuffer = output.source;

		if (!WRITE_ENABLED) {
			output.source = output.rawSource;
		}
		var processor = processorChain[currentChainIndex];
		// // // console.log("runNextProcessor('" + processor.id + "') //"
		// + processor.description);

		processor.process(output, function(result) {

			currentChainIndex++;

			if (currentChainIndex < processorChain.length) {
				runNextProcessor();
			} else {
				_finishedProcessingChain();
			}
		});
	}

	var processor = processorChain[currentChainIndex];
	output.couldParseOriginalSource = canParse(filePathName, output.rawSource, processor.id);
	runNextProcessor();

	/**
	 * Finished processing chain.
	 * 
	 * @name _finishedProcessingChain
	 * @method _finishedProcessingChain
	 * @private
	 */
	function _finishedProcessingChain() {
		var VERIFY_PARSE = true;
		// // // console.log('done');
		writeFile(outputfilePathName, output.source);

		output.couldParseProcessedSource = canParse(outputfilePathName, output.source, processor.id);
		output.corrupted = false;
		output.numberOfLines = output.source.split('\n').length;
		// // // console.log("jshint errors: " + JSHINT.errors.length);
		// // // console.log("gjslint errors: " + report.length);

		for (var e in output.errors) {
			var error = output.errors[e];
			var numberOfErrors = error.length;

			if (typeof error === 'string') {
				numberOfErrors = 1;
			}
			var percent = Math.floor((numberOfErrors / output.numberOfLines) * 100);

			if (percent > ERROR_THRESHOLD) {
				// console.warn(e + ': ' + percent + '%');
			}
		}

		if (VERIFY_PARSE) {
			if (output.couldParseOriginalSource != output.couldParseProcessedSource) {
				// console.warn('Esprima parse status changed during process:
				// BEFORE='
				// + output.couldParseOriginalSource + ', AFTER='
				// + output.couldParseProcessedSource + '.');

				if (!output.couldParseProcessedSource) {
					output.source = output.undoBuffer;
					output.corrupted = false;
					writeFile(outputfilePathName, output.source);
				}
			}
		}

		// delete output.source;
		delete output.rawSource;
		// output.source = escape(output.source);
		completionCallback(output);
	}
}

// ////// utilities ///////

/**
 * Decamelize.
 * 
 * @name decamelize
 * @method decamelize
 * @param {Object}
 *            input
 */
function decamelize(input) {
	// BEGIN_LOADING_FOO
	var test = input.split('_');

	if ((test.length > 1) && (input.indexOf('_') > 0)) {
		// do a different kind of split here
		var output = trim(input.toLowerCase());
		// // console.log('decamelize >>> ' + output);
		return output;
	}

	test = input.split('-');

	if ((test.length > 1) && (input.indexOf('-') > 0)) {
		// do a different kind of split here
		var output = trim(input.toLowerCase());
		// // console.log('decamelize >>> ' + output);
		return output;
	}

	var words = [];
	var word = '';

	for (var c = 0; c < input.length; c++) {
		var chararcter = input.charAt(c);

		if (chararcter == '_') {
			chararcter = ' ';
		}

		if (isUpperCase(chararcter)) {
			// break it
			chararcter = chararcter.toLowerCase();

			words.push(trim(word));
			word = '';
			word += chararcter;
		} else {
			word += chararcter;
		}
	}

	if (trim(word).length > 0) {
		words.push(trim(word));
	}

	var name = trim(words.join(' '));

	name = name.split(' ').join('_');
	return name.split('-').join('_');
}

/**
 * Get module name.
 * 
 * @name getModuleName
 * @method getModuleName
 * @param filePathName
 * @return {Object}
 */
function getModuleName(filePathName) {
	var moduleName = filePathName.split('.');
	moduleName.pop();
	moduleName = moduleName.join('.');

	if (filePathName.indexOf('/') !== -1) {
		moduleName = moduleName.split('/');
	} else {
		moduleName = moduleName.split('\\');
	}
	var modName = moduleName.pop();
	return decamelize(modName);
}

/**
 * Capitalize.
 * 
 * @name capitalize
 * @method capitalize
 * @param {Object}
 *            input
 */
function capitalize(input) {
	if (input == null) {
		return '';
	}
	input = input.split('');

	if (input.length === 0) {
		return '';
	}
	input[0] = input[0].toUpperCase();
	return input.join('');
}

/**
 * Trim.
 * 
 * @name trim
 * @method trim
 * @param {Object}
 *            input
 */
function trim(input) {
	// return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
	return input.trim();
}

/**
 * Trim right.
 * 
 * @name trimRight
 * @method trimRight
 * @param s
 */
function trimRight(s) {
	return s.replace(new RegExp('/\s+$/'), '');
}

/**
 * Camelize.
 * 
 * @name camelize
 * @method camelize
 * @param {Object}
 *            input
 */
function camelize(input) {
	var test = input.split('_');

	if ((test.length > 1) && (input.indexOf('_') > 0)) {
		for (var index = 0; index < test.length; index++) {
			test[index] = capitalize(test[index]);
		}
		return test.join('');
	}

	test = input.split('-');

	if ((test.length > 1) && (input.indexOf('-') > 0)) {
		for (var index = 0; index < test.length; index++) {
			test[index] = capitalize(test[index]);
		}
		return test.join('');
	}
	return capitalize(input);
}

/**
 * Camelize variable.
 * 
 * @name camelizeVariable
 * @method camelizeVariable
 * @param {Object}
 *            input
 */
function camelizeVariable(input) {
	var test = input.split('_');

	if ((test.length > 1) && (input.indexOf('_') > 0)) {
		for (var index = 0; index < test.length; index++) {
			test[index] = capitalize(test[index]);
		}
		test[0] = test[0].toLowerCase();
		return test.join('');
	}

	test = input.split('-');

	if ((test.length > 1) && (input.indexOf('-') > 0)) {
		for (var index = 0; index < test.length; index++) {
			test[index] = capitalize(test[index]);
		}
		test[0] = test[0].toLowerCase();
		return test.join('');
	}
	input = input.split('');
	input[0] = input[0].toLowerCase();
	input = input.join('');
	return (input);
}

/**
 * Is upper case.
 * 
 * @name isUpperCase
 * @method isUpperCase
 * @param aCharacter
 * @return {Object}
 */
function isUpperCase(aCharacter) {
	return (aCharacter >= 'A') && (aCharacter <= 'Z');
}

/**
 * Normalize name.
 * 
 * @name normalizeName
 * @method normalizeName
 * @param {Object}
 *            input
 */
function normalizeName(input) {
	return input.split('-').join('_');
}

/**
 * Safe create file dir.
 * 
 * @name safeCreateFileDir
 * @method safeCreateFileDir
 * @param path
 */
function safeCreateFileDir(path) {
	if (!WRITE_ENABLED) {
		return;
	}
	var dir = _path.dirname(path);

	if (!_fs.existsSync(dir)) {
		// // // console.log("does not exist");
		_wrench.mkdirSyncRecursive(dir);
	}
}

/**
 * Safe create dir.
 * 
 * @name safeCreateDir
 * @method safeCreateDir
 * @param dir
 */
function safeCreateDir(dir) {
	if (!WRITE_ENABLED) {
		return;
	}

	if (!_fs.existsSync(dir)) {
		// // // console.log("does not exist");
		_wrench.mkdirSyncRecursive(dir);
	}
}

/**
 * Strip 'C'-style comments.
 * 
 * @name stripCComments
 * @method stripCComments
 * @param {Object}
 *            input
 */
function stripCComments(input) {
	if (input.indexOf('/*') !== -1) {
		while (true) {
			var splitter = input.split('/*');

			if (splitter.length == 1) {
				return input;
			}

			var beforeComment = splitter[0];
			splitter.shift();
			var afterCommentBody = splitter.join('/*');
			var afterComment = afterCommentBody.split('*/');
			afterComment.shift();
			input = beforeComment + afterComment.join('*/');
		}
	} else {
		return input;
	}
}

/**
 * Strip one line comments.
 * 
 * @name stripOneLineComments
 * @method stripOneLineComments
 * @param {Object}
 *            input
 */
function stripOneLineComments(input) {
	var lines = input.split('\n');
	var L = 0;

	for (L = 0; L < lines.length; L++) {
		var commentCheck = lines[L].split('//');
		lines[L] = commentCheck[0];
	}

	return lines.join('\n');
}

/**
 * Can parse.
 * 
 * @name canParse
 * @method canParse
 * @param moduleName
 * @param {Object}
 *            input
 * @param procId
 */
function canParse(moduleName, input, procId) {
	return true;
// var _esprima = require('esprima');

// try {
// var ast = _esprima.parse(input);

// return true;
// } catch (ex) {
// console.error("ERROR: in '" + moduleName + "', proc #" + procId + ', '
// + ex.message);
// }
// return false;
}

/**
 * Esprimafy.
 * 
 * @name esprimafy
 * @method esprimafy
 * @param moduleName
 * @param {Object}
 *            input
 */
function esprimafy(moduleName, input) {
	var _esprima = require('esprima');
	var then = new Date().getTime();

	try {
		var response = {};

		var ast = _esprima.parse(input);

		// // // console.log(ast);
		// Get optimized AST
		var optimized = _esmangle.optimize(ast, null);
		// // // console.log(optimized);
		// gets mangled AST
		var result = _esmangle.mangle(optimized);

		// // // console.log(result);
		var output = _escodegen.generate(result, {
			format: {
				renumber: true,
				hexadecimal: true,
				escapeless: true,
				compact: true,
				semicolons: false,
				parentheses: false
			}
		});

		// // // console.log(output);
		// dump AST
		response.moduleName = moduleName;
		response.code = output;
		response.timeTaken = new Date().getTime() - then;
		response.ratio = response.code.length / input.length;
		return response;
	} catch (ex) {
		// console.error("ERROR: in '" + moduleName + "', " + ex.message);
	}
	return null;
}

/**
 * Ugly ducklify.
 * 
 * @name uglyDucklify
 * @method uglyDucklify
 * @param moduleName
 * @param {string}
 *            input
 */
function uglyDucklify(moduleName, input) {
	// // // console.log(input);
	var then = new Date().getTime();

	// if you need to pass code instead of file name
	try {
		var result = _uglifyjs.minify(input, {
			fromString: true
			// outSourceMap: 'out.js.map'
		});

		result.timeTaken = new Date().getTime() - then;
		result.moduleName = moduleName;
		result.ratio = result.code.length / input.length;
		return result;
	} catch (ex) {
		// console.error(ex);
	}

	// var duckMap =
	// _path.normalize("jsdoc-preptoolkit\\multipage-shim\\www\\js\\jsdoc-prep\\map.json");

	// _fs.writeFileSync(duckMap, JSON.stringify(JSON.parse(result.map),
	// null, 2));
	// // // console.log(result.map);
	// // // console.log("esprima time: " + ((new Date().getTime() - then) /
	// 1000)
	// + " ms.");
	return {
		code: '<ERROR>'
	};
}

var modules = {};

function convert(input, filePathname) {
	var wholePath = filePathname.split('\\');
	wholePath.pop();
	wholePath = wholePath.join('\\');
	var temp = trim(input);

	var moduleName = '?';
	var requires = [];
	var output = {};
	output.callsYuiApi = false;
	output.rawSource = input;

	var libFile = false;
	var min = (filePathname.indexOf('.min.') !== -1) || (filePathname.indexOf('-min.') !== -1);

	libFile = (filePathname.indexOf('infrastructure') !== -1) || (filePathname.indexOf('yui_sdk') !== -1) || min;

	output.name = moduleName;
	output.isShim = false;
	output.min = min;
	// // // console.log(filePathname);
	// filePathname = filePathname.split("newcore\\")[1];
	// // // console.log(filePathname);
	filePathname = filePathname.split('\\').join('/');
	// // // console.log(filePathname);
	output.path = filePathname;

	// YUI().add('address', function(Y) {

	// {requires: ['jquery']});

	// var stripped = stripCComments(stripOneLineComments(temp));
	var stripped = stripOneLineComments(stripCComments(temp));
	// YUI.add('
	// stripped = temp;

	var yuiAdd_A = (stripped.indexOf('YUI().add(') !== -1);
	var yuiAdd_B = (stripped.indexOf('YUI.add(') !== -1);

	if (yuiAdd_A || yuiAdd_B) {
		console.warn("convert() thinks YUI");
		var yuiAdd = 'YUI().add(';

		if (yuiAdd_B) {
			yuiAdd = 'YUI.add(';
		}
		var yuiChunk = temp.split(yuiAdd);
		// it's a YUI module
		moduleName = (yuiChunk[1].split(',')[0]);
		moduleName = trim(moduleName.split("'").join('').split('\"').join(''));

		if (modules[moduleName] != null) {
			moduleName = getModuleName(filePathname);
		}

		if ((moduleName.indexOf('/') !== -1)) {
			// // // console.log("BAD MODULE NAME: " + moduleName + ", " +
			// filePathname);
			moduleName = moduleName.split('/').pop();
		}
		// // // console.log(moduleName + " it's a YUI module");
		output.isModule = true;

		var requiresString = yuiChunk[1].split(',')[1].split('(')[1].split(')')[0];

		if (requiresString.length > 1) {
			// console.warn('YUI().add: ' + requiresString);
		}

		if (stripped.indexOf('Y.') !== -1) {
			if (JSON.stringify(requires).indexOf('\"yui\"') == -1) {
				requires.push('yui');
			}
			output.callsYuiApi = true;
		}

		if (stripped.indexOf('$(') !== -1) {
			if (JSON.stringify(requires).indexOf('\"jquery\"') == -1) {
				requires.push('jquery');
			}
		}

		yuiChunk = temp.split('requires: [');
		var hasRequiresBlock = false;

		if (yuiChunk.length > 1) {
			hasRequiresBlock = true;
			// the requires array is declared
			requiresString = trim(yuiChunk[1].split(']')[0]);
			var requiredModules = [];

			if (requiresString.indexOf(',') !== -1) {
				requiredModules = requiresString.split(',');

				if (requiresString.indexOf('*') !== -1) {
					// // console.warn("yui requires block >>>>>>>>>> " +
					// requiredModules);
					requiredModules = eval('[' + requiredModules + ']');
					// requiredModules = requiredModules.join(",");
					// // // console.log("yui requires block >>>>>>>>>> " +
					// (typeof
					// requiredModules));
				}
			} else {
				requiredModules.push(requiresString);
			}

			for (var index = 0; index < requiredModules.length; index++) {
				var mod = trim(requiredModules[index].split("'").join('').split('\"').join(''));

				if (mod.length == 0) {
					continue;
				}

				if (mod == 'jQuery') {
					mod = 'jquery';
				}

				// // // console.log("Adding " + mod + " to '" + moduleName +
				// "'.");
				if (JSON.stringify(requires).indexOf('\"' + mod + '\"') == -1) {
					// // // console.log(JSON.stringify(requires));
					// // // console.log("Adding " + mod + " to '" +
					// moduleName +
					// "' at "
					// + filePathname + ".");
					requires.push(mod);
					// // // console.log(JSON.stringify(requires));
				}
			}
		}

		yuiChunk = temp.split(yuiAdd);
		var afterAdd = yuiChunk[1];
		// YUI().add('address', function(Y) {

		afterAdd = afterAdd.split('{');
		afterAdd.shift();
		afterAdd = afterAdd.join('{');

		yuiChunk[1] = afterAdd;

		// define(["logger", "./inheritance"], function(Logger){

		var requireSkeleton = 'define("' + moduleName + '", [';

		// requires []
		for (var r = 0; r < requires.length; r++) {
			if (r > 0) {
				requireSkeleton += ', ';
			}
			requireSkeleton += '\"' + requires[r] + '\"';
		}
		requireSkeleton += '], function(';

		// module instance names
		for (var r = 0; r < requires.length; r++) {
			if (r > 0) {
				requireSkeleton += ', ';
			}

			if (requires[r].toLowerCase().indexOf('jquery.') !== -1) {
				requires[r] = 'jquery';
				requireSkeleton += '$';
			} else if (requires[r].toLowerCase() == 'jquery') {
				requires[r] = 'jquery';
				requireSkeleton += '$';
			} else if (requires[r].toLowerCase() == 'yui') {
				requires[r] = 'yui';
				requireSkeleton += 'Y';
			} else if (requires[r].toLowerCase() == 'underscore') {
				requires[r] = 'underscore';
				requireSkeleton += '_';
			} else {
				requireSkeleton += camelize(requires[r]);
			}
		}
		requireSkeleton += '){';

		// var newBody = yuiChunk.join('define(["logger",
		// "./inheritance"],
		// function(Logger){');
		var newBody = yuiChunk.join(requireSkeleton);

		// strip off the tail

		// end of function, version, options, close

		// {requires: ['jquery']});
		// }, '0.1', { requires: [] });

		yuiChunk = newBody.split('}');

		// requires:
		if (hasRequiresBlock) {
			// pop the last block
			// // // console.log("POPPING LAST }");
			yuiChunk.pop();
		}
		// else{
		// // // console.log("DON'T POP LAST }");
		// }
		yuiChunk.pop();
		newBody = yuiChunk.join('}');
		newBody += '\n});';
		temp = newBody;

		// // // console.log(newBody);
	} else {
		console.warn("convert() thinks AMD");
		moduleName = getModuleName(filePathname);
		console.warn("Module name: " + moduleName);
		// // // console.log("NOT A YUI FILE: " + moduleName);
		temp = input;
		output.isModule = stripped.indexOf('define(') !== -1;
		output.isMain = stripped.indexOf('require(') !== -1;
		console.warn('look for requirejs.config');
		if (output.isMain && stripped.indexOf('requirejs.config(') !== -1 && (!libFile)) {
			 console.log(moduleName + " it's an AMD MAIN file");
			var config = stripped.split('requirejs.config(')[1];
			config = config.split(');')[0];
			// EVIL
			// console.log(config);
			globalConfig = eval("[" + config + "]")[0];
			// console.log(JSON.stringify(globalConfig));
			globalConfig.basePath = wholePath;
		}

		// get requires
		console.warn('get requires');
		var defineBlock = (stripped.indexOf('define(') !== -1 && (!libFile));

		if (defineBlock) {
			console.log(moduleName + " it's an AMD MODULE file");
			console.warn('requirejs: using define() ' + moduleName);
			var afterDefine = stripped.split('define(')[1];
			
			afterDefine = afterDefine.split(')')[0].trim();
			// console.log(afterDefine);

			
// FIXME: this next test will fail in blue
			if (afterDefine.charAt(0) !== '{' && afterDefine.indexOf('[') !== -1) {
				// has dependencies

				afterDefine = afterDefine.split('[')[1];
				var depsRaw = trim(afterDefine.split(']')[0]);

				if (depsRaw.indexOf(',') !== -1) {
					depsRaw = depsRaw.split(',');
					depsRaw = eval('[' + depsRaw + ']');
				} else {
					var tempDeps = depsRaw;
					depsRaw = [];
					depsRaw.push(tempDeps);
				}

				// // // console.log(depsRaw);
				requires = depsRaw;
				var depVarnames = afterDefine.split('(')[1];
				depVarnames = depVarnames.split(')')[0];
				depVarnames = depVarnames.split(',');

				for (var index = 0; index < depVarnames.length; index++) {
					var item = depVarnames[index];
					// item = item.split("\"").join("");
					item = trim(item);

					if (item.indexOf('*' !== -1)) {
						// console.warn(moduleName + " >>>>>> require function
						// params contain '"
						// + depVarnames + "'");
					}
					depVarnames[index] = item;
				}
				output.depVarnames = depVarnames;

				// // // console.log(depVarnames);
			}

			afterDefine = stripped.split('define(')[1];
			afterDefine = afterDefine.split(')')[0];

			// // // console.log(afterDefine);
			if (afterDefine.indexOf(moduleName) == -1) {
				// WARNING: THIS ONLY AFFECTS THE ORIGINAL SOURCE, NOT
				// THE
				// STRIPPED SOURCE....

				// console.warn("Rewrite the define method to include '"
				// + moduleName + ".'");

				var all = temp.split('define(');

				// if(requires.length > 0){
				// all[1] = ("\"" + moduleName + "\",") + all[1];
				// }else{
				// all[1] = ("\"" + moduleName + "\"") + all[1];
				// }

				all[1] = ('\"' + moduleName + '\",') + all[1];

				temp = all.join('define(');
			}

			// // // console.log(afterDefine);
		} else {
			var requireBlock = (stripped.indexOf('require(') !== -1 && (!libFile));

			if (requireBlock) {
				// console.warn("requirejs: using require() in module '"
				// + moduleName + "'");
				var afterDefine = stripped.split('require(')[1];
				afterDefine = afterDefine.split(')')[0];
				// // // console.log(afterDefine);

				if (afterDefine.indexOf('[') !== -1) {
					// has dependencies

					afterDefine = afterDefine.split('[')[1];
					var depsRaw = afterDefine.split(']')[0];
					depsRaw = depsRaw.split(',');

					for (var index = 0; index < depsRaw.length; index++) {
						var item = depsRaw[index];
						item = item.split('\"').join('');
						item = trim(item);
						depsRaw[index] = item;
					}
					// // // console.log(depsRaw);
					requires = depsRaw;
					var depVarnames = afterDefine.split('(')[1];
					depVarnames = depVarnames.split(')')[0];
					depVarnames = depVarnames.split(',');

					for (var index = 0; index < depVarnames.length; index++) {
						var item = depVarnames[index];
						// item = item.split("\"").join("");
						item = trim(item);
						depVarnames[index] = item;
					}
					output.depVarnames = depVarnames;
					// // // console.log(depVarnames);
				}

				// // // console.log(afterDefine);
			}
		}
	}
	output.name = moduleName;
	output.requires = requires;

	if (libFile) {
		output.source = input;
	} else {
		output.source = temp;
	}

	if ((output.name.indexOf('*') !== -1) || (output.name.indexOf('/') !== -1)) {
		console.warn('BAD MODULE NAME: ' + output.name + ', '
		 + filePathname);
	}

	if (output.name === 'backbone') {
		output.requires = ['underscore', 'jquery'];

		// console.warn(output.name + ' ... requires = [_, $]');
	} else if (output.name === 'jquery') {
		output.requires = [];
		// console.warn(output.name + ' ... requires = []');
	} else if (output.requires.length === 0) {
		if (temp.indexOf(' $.') !== -1 || temp.indexOf(' $(') !== -1) {
			output.requires = ['jquery'];
			// console.warn(output.name + ' ... adding $');
		}
	}

	if (output.name !== 'backbone') {
		if (input.indexOf('Backbone.') !== -1) {
			if (JSON.stringify(output.requires).indexOf('\"backbone\"') == -1) {
				output.requires.push('backbone');
				// console.warn(output.name + ' ... adding backbone, it was used
				// but
				// not required');
			}

			if (JSON.stringify(output.requires).indexOf('\"underscore\"') == -1) {
				output.requires.push('underscore');
				// console.warn(output.name + ' ... adding underscore, it was
				// used
				// but not required');
			}
		}
	}

	output.libFile = libFile;
	output.realName = output.name;
	output.name = normalizeName(output.name);

	// for (var i = 0; i<output.requires.length; i++){
	// output.requires[i] = normalizeName(output.requires[i]);
	// }

	// if (moduleName.indexOf("masonry") !== -1){
	// // // console.log(JSON.stringify(output));
	// }

	// if (output.isModule && requires.length == 0) {
	// // console.warn(output);
	// }
	// // // console.log(output);

	// TODO: merge dependencies here
	// var yuiCustomMod = yui_custom_modules[output.realName];

	return output;
}

function getRequiresTags(input) {
	var output = '';
	var amdProcData = input.results.amdProc;

	for (var index = 0; index < amdProcData.requires.length; index++) {
		var moduleName = amdProcData.requires[index];

		if (typeof moduleName !== 'string') {
			continue;
		}

		if (moduleName.length === 0) {
			continue;
		}

		output += ' * @requires ' + moduleName + '\n';
	}
	// console.warn(output);
	return output;
}



function getLines(lines, x, y) {
	var buffer = [];

	for (var index = x; index < (y + 1); index++) {
		buffer.push(lines[index]);
	}
	return buffer.join('\n');
}

function getNextLineOfCode(lines, x) {
	for (var index = x + 1; index < lines.length; index++) {
		var line = lines[index].trim();

		if (line.length > 0) {
			if (line.indexOf('//') !== 0 && line.indexOf('/*') !== 0) {
				return line;
			}
		}
	}
	return "";
}

/**
 * concatLines
 */
function concatLines(lines, codeBlock) {
	var blockLines = codeBlock.split('\n');

	for (var index = 0; index < blockLines.length; index++) {
		lines.push(blockLines[index]);
	}
	return lines;
}

/**
 * duh
 */
function replace(source, original, token) {
	var array = source.split(original);
	return array.join(token);
}

/**
 * jsDoc3PrepProc
 */
var jsDoc3PrepProc = {
		id: 'jsDoc3PrepProc',
		type: 'processor',
		description: 'Fixes annotations. Less is more.',
		/**
		 * @name process
		 * @method process
		 * @param {Object}
		 *            input
		 * @param {Function}
		 *            doneCallback
		 */
		process: function(input, doneCallback) {
			var PROC_DOCLETS = true;

			if (input.errors[this.id] == null) {
				input.errors[this.id] = [];
			}

			var source = input.source;

			source = replace(source, '{string}', '{String}');
			source = replace(source, '{object}', '{Object}');
			source = replace(source, '{number}', '{Number}');
			source = replace(source, '{int}', '{Number}');
			source = replace(source, '{long}', '{Number}');
			source = replace(source, '{double}', '{Number}');
			source = replace(source, '{boolean}', '{Boolean}');
			source = replace(source, '{bool}', '{Boolean}');
			source = replace(source, '{function}', '{Function}');

			// console.log(source);

			input.source = source;

			firstDoclet = null;
			// remove @method, @function @module

			var lines = input.source.split('\n');
			var index = 0;
			var linesLength = lines.length;
			var lastLine = '';

			for (index = 0; index < linesLength; index++) {
				var line = lines[index];

				if (line.trim().indexOf('//') === 0) {
					continue;
				}

				// /**@lends ZingChartsController.prototype*/
				// || line.indexOf('* @module') !== -1
				if (line.indexOf('* @method') !== -1 || line.indexOf('* @function') !== -1 || line.indexOf('* @memberOf') !== -1) {
					lines[index] = '';
					// console.warn("Removed line '" + line + "'.");
				}

				if (line.indexOf('* @requires') !== -1) {
					lines[index] = '';
					// console.warn("Removed line '" + line + "'.");
				}

				if (line.indexOf('* @lends') !== -1 || line.indexOf('*@lends') !== -1) {
					// if it's not extend inheritance, don't say it lends
					if (lastLine.indexOf('.extend') === -1) {
						lines[index] = '';
						// console.warn("Removed line '" + line + "'. lastLine
						// =" +
						// lastLine);
					} else {
						// full jsDoc pathname
						// /** @lends module:product_view~ProductView.prototype
						// */
						if (line.indexOf('~') === -1) {
							var lendSplit = line.split('@lends ');
							lendSplit[1] = 'module:' + input.name + '~' + lendSplit[1];
							line = lendSplit.join('@lends ');
							lines[index] = line;
						}
					}
				}
				lastLine = line;
			}
			input.source = lines.join('\n');

			// get arg 3 of a define
			var whereDefine = input.source.indexOf('define(\'');

			if (whereDefine === -1) {
				whereDefine = input.source.indexOf('define("');
			}

			if (whereDefine === -1) {
				// it's AMD but no module name
				whereDefine = input.source.indexOf('define(');
			}

			// add @exports, @name, @namepsace
			if (input.source.indexOf('define = function') !== -1) {
				whereDefine = -1;
			}

			if (whereDefine !== -1) {
				// console.warn('we think this is AMD? ' + input.name);
				var source = input.source.substring(whereDefine);

				var whereVar = source.indexOf('var ');

				var whereFunctionNoSpace = source.indexOf('function(');
				var whereFunction = source.indexOf('function ');

				if (source.indexOf('@exports ' + input.name) === -1) {
					if ((whereVar > 0) && ((whereFunction > 0) || (whereFunctionNoSpace > 0))) {
						// console.warn('trying to add exports to ' +
						// input.name);

						if (whereFunctionNoSpace === -1 && whereFunction === -1) {
							// console.warn('could not find a function() def in
							// ' +
							// input.name);
						}
						else {
							// could also be function (
							var splitter = [];

							if (whereFunctionNoSpace === -1) {
								// could not find 'function(' but found
								// 'function ('
								splitter = source.split('function (');
								// console.warn('testing for function ( ' +
								// whereFunctionNoSpace + ',' + whereFunction);
							} else if (whereFunction === -1) {
								// could not find 'function (' but found
								// 'function('
								splitter = source.split('function(');
								// console.warn('testing for function( ' +
								// whereFunctionNoSpace + ',' + whereFunction);
							} else if (whereFunctionNoSpace < whereFunction) {
								// 'function(' happens before 'function ('
								splitter = source.split('function(');
								// console.warn('testing for function( ' +
								// whereFunctionNoSpace + ',' + whereFunction);
							} else {
								// 'function (' happens before 'function('
								splitter = source.split('function (');
								// console.warn('testing for function ( ' +
								// whereFunctionNoSpace + ',' + whereFunction);
							}

							var combiner = [];
							var packagePath = (input.path.split('/'));
							packagePath.shift();
							packagePath = packagePath.join('/');
							packagePath  = packagePath.split('.js')[0];
							console.log('>>>>>>>>>>>>>> Generating module exports. ' + packagePath);
							combiner.push(splitter[0] + '\n' + '/**\n * @exports ' + packagePath + '\n' + getRequiresTags(input) + ' */\n');
							var splitterLength = splitter.length;

							for (index = 1; index < splitterLength; index++) {
								combiner.push(splitter[index]);
							}
							source = combiner.join('function(');
						}
					} else {
						// console.warn('could not add exports to ' + input.name
						// +
						// '-->' + whereDefine + ',' + whereFunction + ',' +
						// whereVar);
					}
				}

				var originalHeader = input.source.substring(0, whereDefine);
				input.source = originalHeader + '' + source;
			}

			var prototypal = false;

			if (input.source.indexOf(input.camelName + '.prototype.') !== -1) {
				prototypal = true;
			}

			if (input.possibleName != null) {
				if (input.source.indexOf(input.possibleName + '.prototype.') !== -1) {
					prototypal = true;
				}
			}

			if ((!prototypal) && input.source.indexOf('@exports ' + input.name) !== -1) {
				// /**
				// * This is a class.
				// *
				// *@class exports
				// */

				// add @alias

				// /**
				// * @class ZingChartsController
				// * @extends ChartsController
				// */
				if (input.source.indexOf('@constructor') !== -1) {
					var splitter = input.source.split('@constructor');
					// splitter[1] = '\n * @alias module:' + input.name + '\n *
					// @name ' + input.camelName + '\n' + splitter[1];
					// splitter[1] = '\n * @alias module:' + input.name + '\n' +
					// splitter[1];
					input.source = splitter.join('@constructor');
				} else if (input.source.indexOf('var exports') !== -1) {

					var splitter = input.source.split('@module');
					input.source = splitter.join('<br />Module');

					splitter = input.source.split('var exports');
					var newDoc = "\n /**\n * @alias module:" + input.name + "\n */";
					input.source = splitter.join('/** @alias module: ' + input.name + ' */\n var exports');
					splitter = input.source.split('@class exports');
					input.source = splitter.join('');
				} else if (input.source.indexOf('var utils ') !== -1) {
					var splitter = input.source.split('@module');
					input.source = splitter.join('<br />Module');
					splitter = input.source.split('var utils ');
					var newDoc = "\n /**\n * @alias module:" + input.name + "\n */";
					input.source = splitter.join('/** @alias module: ' + input.name + ' */\n var utils ');
					splitter = input.source.split('@class utils');
					input.source = splitter.join('');
				} else if (input.source.indexOf('@class') !== -1) {
					var splitter = input.source.split('@class');
					// splitter[1] = '\n * @constructor\n * @alias module:' +
					// input.name + '\n * @name ' + splitter[1];
					input.source = splitter.join('@class');
				}
			}

			var splitter = input.source.split('@class');
			input.source = splitter.join('@constructor');

			splitter = input.source.split('@extends');
			input.source = splitter.join('@augments');

			// final pass... remove duplicate @constructor tags

			// // // console.log(printDoclet(parseDoclet(testDoclet)));
			PROC_DOCLETS = true;

			if (PROC_DOCLETS) {
				lines = input.source.split('\n');
				var newLines = [];
				index = 0;
				linesLength = lines.length;
				var startOfDoclet = -1;
				var endOfDoclet = -1;
				// add the @module tag ONLY if @xports is not found
				var moduleAtTop = input.source.indexOf("@exports") === -1;
				var defineModuleInTopOfFile = moduleAtTop;
				var lastLine = '';

				for (index = 0; index < linesLength; index++) {
					var line = lines[index].trim();

					// Scan for jsDoc tags!!!
					if (line.indexOf('//') === 0) {
						newLines.push(line);
						continue;
					}

					if (line.indexOf('/**') !== -1 && line.indexOf('*/') !== -1) {
						// it's a one-liner
						var nextLineOfCode = getNextLineOfCode(lines, index);
						var docletText = printDoclet(parseDoclet(input, line, defineModuleInTopOfFile, nextLineOfCode), defineModuleInTopOfFile);

						if (lastLine.indexOf(docletText) === -1) {
							line = docletText;
						} else {
							// console.log("found duplicate doclet: " +
							// docletText);
						}
						defineModuleInTopOfFile = false;
						newLines.push(line);
					} else if (line.indexOf('/**') !== -1) {
						// it's the beginning of a doclet
						startOfDoclet = index;
					} else if (line.indexOf('*/') !== -1) {
						if (startOfDoclet !== -1) {
							// it's the beginning of a doclet
							endOfDoclet = index;

							// munge

							var block = getLines(lines, startOfDoclet, endOfDoclet);
							var newBlock = block;
							var parsed = {};

							// // console.warn(block);
							try {
								var nextLineOfCode = getNextLineOfCode(lines, index);
								parsed = parseDoclet(input, block, defineModuleInTopOfFile, nextLineOfCode);
							} catch (e) {
								// console.error('parseDoclet: ' + e);
							}

							try {
								newBlock = printDoclet(parsed, defineModuleInTopOfFile);
								defineModuleInTopOfFile = false;
								// // console.warn(newBlock);
							} catch (e) {
								console.error('printDoclet: ' + e);
							}

							// munge NOW

							if (lastLine.indexOf(newBlock) === -1) {
								concatLines(newLines, newBlock);
							} else {
								// console.log("found duplicate doclet: " +
								// newBlock);
							}

							startOfDoclet = -1;
							endOfDoclet = -1;
						} else {
							newLines.push(line);
						}
					} else if (startOfDoclet === -1 && endOfDoclet === -1) {
						newLines.push(line);
					}
					lastLine = line;
				}

				input.source = newLines.join('\n');
			}

			doneCallback(input);
		}
};

/**
 * @name plugins
 * @memberOf SingleFileProcessor
 * @type {Array}
 */
var plugins = {
		'trimProc': trimProc,
		'headerProc': headerProc,
		'jsBeautifyProc': jsBeautifyProc,
		'gsLintProc': gsLintProc,
		'jsHintProc': jsHintProc,
		'esFormatterProc': esFormatterProc,
		'parseFilter': parseFilter,
		'yuiFilter': yuiFilter,
		'amdFilter': amdFilter,
		'minFilter': minFilter,
		'amdOrYuiFilter': amdOrYuiFilter,
		'jsDocGenProc': jsDocGenProc,
		'jsDoccerProc': jsDoccerProc,
		'jsDocNameFixerProc': jsDocNameFixerProc,
		'badCharactersProc': badCharactersProc,
		'jsDogProc': jsDogProc,
		'fixClassDeclarationsProc': fixClassDeclarationsProc,
		'thirdPartyFilter': thirdPartyFilter,
		'yuiDocProc': yuiDocProc,
		'amdProc': amdProc,
		'uglifyProc': uglifyProc,
		'jsDoc3PrepProc': jsDoc3PrepProc,
		'generateJavaProc': generateJavaProc,
		'fixJSDocFormattingProc': fixJSDocFormattingProc
};

function getAmdConfig() {
	return AMD_DATA;
}

/**
 * memberOf SingleFileProcessor
 */
module.exports = {
		'plugins': plugins,
		'processFile': processFile,
		'writeFile': writeFile,
		'setWriteEnable': setWriteEnable,
		'getAmdConfig': getAmdConfig
};
