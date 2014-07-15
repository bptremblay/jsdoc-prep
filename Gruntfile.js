

/* global require, module */

var _ = require('underscore');

/**
 * Node function to enable Grunt
 * 
 * @param {object}
 *            grunt
 */
module.exports = function(grunt) {
	'use strict';

	var myPath = 'js_test_resources';
	var outputPath = 'processed';
	var reportPath = 'results';
	var docPath = reportPath + '/doc';
	var myFiles = [ myPath + '/**/*.js' ];
	var myProcessedFiles = [ outputPath + '/**/*.js' ];

	var _fs = require('fs');
	var _path = require('path');
	var _wrench = require('wrench');

	grunt.initConfig({
		fileList : myFiles,
		jsbeautifier : {
			files : myProcessedFiles,
			options : {
				indent_size : 2,
				wrap_line_length : 200
			}
		},
		beautify : {
			files : myProcessedFiles,
			options : {
				indent_size : 2,
				wrap_line_length : 200
			}
		},
		dependo : {
			targetPath : myPath,
			outputPath : './results/dependencies',
			format : 'amd'
		},
		fixmyjs : {
			options : {},
			my_stuff : {
				files : [ {
					expand : true,
					cwd : myPath,
					src : [ '**/*.js' ],
					dest : myPath,
					ext : '.js'
				} ]
			}
		},
		prepForJsDoc : {
			scanPath : myPath,
			outPath : outputPath,
			resultsPath : reportPath + '/metadata',
			testPath : reportPath + '/test',
			docPath : docPath
		},
		munge : {
			scanPath : myPath,
			outPath : reportPath + '/munge',
			resultsPath : reportPath + '/metadata',
			testPath : reportPath + '/test',
			docPath : docPath
		},
		doc : {
			scanPath : myPath,
			outPath : outputPath,
			resultsPath : reportPath,
			docPath : docPath
		},
		// plato provides static code analysis of our source code
		plato : {
			custom_complexity_v2 : {
				options : {
					jshint : grunt.file.readJSON('.jshintrc'),
					complexity : {
						logicalor : false,
						switchcase : false,
						forin : true,
						trycatch : true,
						newmi : true
					}
				},
				src : [ myProcessedFiles ],
				dest : reportPath + '/platonic'
			}
		}
	});

	grunt.registerTask('beautify', [ 'jsbeautifier' ]);
	grunt
			.registerTask(
					'doc',
					function() {
						var config = grunt.config('doc');
						var path = require('path');
						var fs = require('fs');
						var rimraf = require('rimraf');
						var outPath = config.outPath;
						var docPath = config.docPath;
						docPath = path.resolve(docPath);
						docPath = path.normalize(docPath);
						var USE_HARUKI = false;

						function runJsDoc(gruntInstance, sourceDirectory) {
							var done = gruntInstance.async();
							rimraf(
									docPath,
									function() {
										var exePath = path
												.normalize('node_modules/.bin/jsdoc');
										var exec = require('child_process').exec;
										// var cmdLine = exePath + ' -r -l -t
										// templates/default -d ' + docPath +
										// ' ' + sourceDirectory + '';
										// // console.log(cmdLine);
										var cmdLine = exePath;

										if (USE_HARUKI) {
											cmdLine += ' -r -l -t templates/haruki -d console -q format=json'
													+ ' '
													+ sourceDirectory
													+ '';
										} else {
											cmdLine += ' -r -l -d ' + docPath
													+ ' ' + sourceDirectory
													+ '';
										}

										console.log(cmdLine);
										var child = exec(cmdLine, function(
												error, stdout, stderr) {

											// normal
											// console.log(stdout);
											console.error(stderr);
										});
										child
												.on(
														'close',
														function(code) {
															console
																	.log('child process exited with code '
																			+ code);
															done();
														});
									});
						}

						runJsDoc(this, outPath);
					});

	grunt.registerTask('prepForJsDoc', function() {

		var config = grunt.config('prepForJsDoc');

		var path = require('path');
		var fs = require('fs');
		var healthCheck = require('./fileSystemProcessor');
		var rimraf = require('rimraf');
		//
		var outPath = config.outPath;
		var testPath = config.testPath;
		var docPath = config.docPath;
		var resultsPath = config.resultsPath;
		var scanPath = config.scanPath;
		// 'jsDoccerProc',
		var processingChain = [
		// 'thirdPartyFilter',
		// 'minFilter',
		'badCharactersProc',
		// //'amdFilter',
		// 'jsBeautifyProc',
		'amdProc', 
		'jsDoccerProc', 'jsBeautifyProc',
		// 'jsDocNameFixerProc',
		// BPT
		'jsDoc3PrepProc', 'jsBeautifyProc'
		// 'fixJSDocFormattingProc',
		// 'generateJavaProc',
		// 'jsBeautifyProc'
		];

		// var processingChain = ['amdProc'];

		var done = this.async();

		var opts = {
			callBack : done,
			scanPath : scanPath,
			writePath : outPath,
			writeTestPath : testPath,
			writeDocPath : docPath,
			writeResultsPath : resultsPath,
			writeEnable : true,
			processingChain : processingChain
		};

		rimraf(outPath, function() {
			healthCheck.run({
				callBack : opts.callBack,
				scanPath : opts.scanPath,
				writePath : outPath,
				writeTestPath : testPath,
				writeDocPath : docPath,
				writeResultsPath : resultsPath,
				writeEnable : opts.writeEnable,
				processingChain : opts.processingChain
			});
		});
	});

	/**
	 * Read file.
	 * 
	 * @name readFile
	 * @method readFile
	 * @param filePathName
	 */
	function readFile(filePathName) {
		var _fs = require('fs');
		var _path = require('path');
		var FILE_ENCODING = 'utf8';
		filePathName = _path.normalize(filePathName);
		var source = '';

		try {
			source = _fs.readFileSync(filePathName, FILE_ENCODING);
		} catch (er) {
			// console.error(er.message);
			source = '';
		}

		return source;
	}

	/**
	 * Safe create file dir.
	 * 
	 * @name safeCreateFileDir
	 * @method safeCreateFileDir
	 * @param path
	 */
	function safeCreateFileDir(path) {
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
		if (!_fs.existsSync(dir)) {
			// // // console.log("does not exist");
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

	var firstDoclet = null;

	function parseDoclet(input, doclet, defineModuleInTopOfFile, nextLineOfCode) {

		var commentBuffer = '';
		var docletData = {};
		docletData.params = [];

		if (nextLineOfCode.indexOf('.extend') !== -1) {
			var splitCode = nextLineOfCode.split('.extend');
			var leftOfExtend = splitCode[0].trim();
			var rightOfExtend = splitCode[1].trim();
			var leftOfEquals = '';
			var rightOfEquals = '';

			if (leftOfExtend.indexOf('=') != -1) {
				// var OptionImageCollection,Backbone.Collection,(
				// var OptionImageModel,Backbone.Model,(
				// $.wf.ProductModel,ProductChildModel,(
				leftOfEquals = leftOfExtend.split('=')[0].trim();
				rightOfEquals = leftOfExtend.split('=')[1].trim();

				if (leftOfEquals.indexOf('var ') !== -1) {
					leftOfEquals = leftOfEquals.split('var ')[1].trim();
				}
				// // console.warn("AUGMENTS >>>>>>>>" + leftOfEquals + "," +
				// rightOfEquals + "," + rightOfExtend);
				docletData['@augments'] = rightOfEquals;
			} else {
				// $,(ProductValidator.prototype,
				if (rightOfExtend.indexOf('(') !== -1) {
					rightOfExtend = rightOfExtend.substring(1);
				}

				if (rightOfExtend.indexOf(',') !== -1) {
					rightOfExtend = rightOfExtend.split(',')[0].trim();
				}
				docletData['@augments'] = rightOfExtend;
				// // console.warn("AUGMENTS >>>>>>>>" + leftOfExtend + "," +
				// rightOfExtend);
			}

			// $.wf.QuickShipOptions = Backbone.View.extend(
			// // console.warn(" AUGMENTS >>>>>>>>>>>>>>>>>" + nextLineOfCode);
		}

		if (firstDoclet == null) {
			firstDoclet = docletData;
		}

		// if (defineModuleInTopOfFile) {
		docletData.requiresList = []; // input.results.amdProc.requires;
		// }
		docletData.moduleName = input.name;
		docletData.camelName = camelize(input.name); // input.camelName;

		if (doclet.indexOf('/**') === -1 || doclet.indexOf('*/') === -1) {
			// console.error('parseDoclet FORMAT ERROR: ' + doclet);
			return doclet;
		}

		// strip comment tags
		var chunker = doclet.split('/**')[1];
		chunker = chunker.split('*/')[0];
		// // // console.log(chunker);
		var lines = chunker.split('\n');
		var index = 0;
		var linesLength = lines.length;
		var currentTag = '';

		for (index = 0; index < linesLength; index++) {
			var line = lines[index].trim();

			if (line.length === 0) {
				continue;
			}

			if (line.indexOf('*') === 0) {
				// strip the comment star
				line = line.substring(1).trim();
			} else {
				// // console.warn('parseDoclet: a line did not begin with * ' +
				// line);
			}

			// FIXME: concatenate text in multiple lines under a tag (don't
			// trucate
			// text to the line)
			if (line.indexOf('@') === 0) {
				// it's a jsDoc comment
				var tag = line.split(' ')[0];
				tag = tag.split('@')[1];
				var tagData = line.split(' ');
				tagData.shift();

				if (tag === 'param') {
					var paramDescription = '';
					var paramChunk = tagData[0].trim();
					var paramName = '';
					var paramType = '';

					if (paramChunk.indexOf('{') === 0) {
						paramType = paramChunk;
						paramName = tagData[1].trim();
						tagData.shift();
						tagData.shift();
					} else {
						paramName = paramChunk;
						tagData.shift();
					}
					paramDescription = tagData.join(' ').trim();

					docletData.params.push({
						name : paramName,
						type : paramType,
						description : paramDescription
					});
				}
				// else if (tag === 'requires') {
				// var paramDescription = '';
				// var paramChunk = tagData[0].trim();
				// var paramName = '';
				// var paramType = '';
				//
				// if (paramChunk.indexOf('{') === 0) {
				// paramType = paramChunk;
				// paramName = tagData[1].trim();
				// tagData.shift();
				// tagData.shift();
				// } else {
				// paramName = paramChunk;
				// tagData.shift();
				// }
				// paramDescription = tagData.join(' ').trim();
				//
				// docletData.requires.push({
				// name: paramName,
				// type: paramType,
				// description: paramDescription
				// });
				// }
				else {
					docletData['@' + tag] = tagData.join(' ').trim();
					currentTag = tag;
				}
			} else {
				// it's a freeform description comment... who owns it?
				commentBuffer += ' ' + line.trim();
				commentBuffer = commentBuffer.trim();
			}
		}
		docletData['freeText'] = commentBuffer.trim();

		var nodeType = 'NONFUNCTION';

		if (docletData['@constructor'] != null) {
			nodeType = 'CLASS';
		}

		if (docletData['@class'] != null) {
			nodeType = 'CLASS';
		}

		if (docletData['@constructor'] != null
				&& docletData['@constructor'].length > 0) {
			docletData['className'] = docletData['@constructor'];
		} else if (docletData['@class'] != null
				&& docletData['@class'].length > 0) {
			docletData['constructor'] = docletData['@class'];
			docletData['className'] = docletData['@class'];
			delete docletData['@class'];
		}

		if (docletData['className'] != null
				&& docletData['className'].length > 0) {
			if (docletData['@name'] != null && docletData['@name'].length > 0) {
				docletData['className'] = docletData['@class'];
			}
			nodeType = 'CLASS';
		}

		if (docletData['@exports'] != null || docletData['@module'] != null) {
			nodeType = 'MODULE';
		} else if (docletData['@lends'] != null) {
			nodeType = 'LENDS';
		} else if (docletData['@var'] != null) {
			nodeType = 'VAR';
		} else if (docletData['@type'] != null) {
			nodeType = 'VAR';
		}
		docletData.nodeType = nodeType;
		// // console.log(JSON.stringify(docletData));
		return docletData;
	}

	/**
	 * Get last js doc comment.
	 * 
	 * @name getLastJsDocComment
	 * @method getLastJsDocComment
	 * @param {Object}
	 *            inputObject
	 * @param linesIn
	 * @param lineNumber
	 * @return {Object}
	 */
	function getLastJsDocComment(inputObject, lines, lineNumber) {
		var comments = {};
		comments.code = '';
		// lineNumber is line of the function... so scan up!
		var jsDoc = false;
		var start = -1;
		var end = -1;
		var inside = false;

		// lineNumber is 1-based, so subtract 2
		for (var index = (lineNumber - 2); index > -1; index--) {
			var line = lines[index].trim();

			// whitespace, comment parts, or something esle
			if (line.length === 0) {
				// ignore
				continue;
			} else if (line.indexOf('/*') === 0 && line.indexOf('*/') !== -1) {
				// beginning
				start = index;
				end = index;
				jsDoc = line.indexOf('/**') !== -1;
				comments.start = start;
				comments.end = end;
				comments.jsDoc = jsDoc;
				break;
				// // console.log(comments);
				break;
			} else if (line.indexOf('*/') === 0) {
				// end
				end = index;
				inside = true;
			} else if (line.indexOf('/**') === 0) {
				// beginning
				start = index;
				jsDoc = true;
				comments.start = start;
				comments.end = end;
				comments.jsDoc = jsDoc;
				// // console.log(comments);
				break;
			} else if (line.indexOf('/*') === 0) {
				// beginning of a non-doc comment
				start = index;
				jsDoc = false;
				comments.start = start;
				comments.end = end;
				comments.jsDoc = jsDoc;
				// // console.log(comments);
				break;
			} else if (line.indexOf('*') === 0) {
				// inside a comment if already inside a comment
				if (inside) {
					continue;
				} else {
					// console.warn('getLastJsDocComment: ' + inputObject.module
					// + ',
					// (line.indexOf(' * ') === 0) ' + line + ', ' +
					// inputObject.namem +
					// ', ' + lineNumber);
					break;
				}
			} else if (line.indexOf('//') === 0) {
				// one line comment
				// TODO: capture this?
				continue;
			} else {
				// something else, like code... stop
				if (inside) {
					continue;
				} else {
					// console.warn('getLastJsDocComment: ' + inputObject.module
					// + ', line
					// is something else: ' + line + ', ' + inputObject.name +
					// ', ' +
					// lineNumber);
					break;
				}
			}
		}

		if (comments.start > -1 && comments.end > -1) {
			var temp = [];

			for (var x = start; x < end + 1; x++) {
				temp.push(lines[x].trim());
			}
			// // console.log(temp.join(''));
			comments.code = temp.join('\n').trim();
			// // console.log(comments.code);
		}
		return comments;
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

	grunt.registerTask('dependencies', [ 'dependo' ]);
	grunt.registerTask('hintfix', [ 'fixmyjs' ]);
	// 'prepForJsDoc',
	// grunt.registerTask('default', ['beautify', 'plato', 'doc', 'plato',
	// 'dependencies']);
	// 'beautify', 'hintfix',
	// grunt.registerTask('default', ['prepForJsDoc']);

	//grunt.registerTask('default', [ 'prepForJsDoc', 'beautify', 'doc' ]);
	grunt.registerTask('default', [  'prepForJsDoc', 'beautify', 'doc' ]);
	grunt.loadNpmTasks('grunt-node-inspector');
	grunt.loadNpmTasks('grunt-fixmyjs');
	grunt.loadNpmTasks('grunt-githooks');
	grunt.loadNpmTasks('grunt-dependo');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-plato');
};