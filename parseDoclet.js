var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');

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

function printDoclet(docletData, defineModuleInTopOfFile) {
	var has_description = false;
	console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>> printDoclet');
	var printableTags = {
		'abstract' : 1,
		// This member must be implemented (or overridden) by the inheritor.
		'access' : 1,
		// Specify the access level of this member - private, public, or
		// protected.
		'alias' : 1,
		// Treat a member as if it had a different name.
		'augments' : 1,
		// This object adds onto a parent object.
		'extends' : 1,
		// This object adds onto a parent object.
		'author' : 1,
		// Identify the author of an item.
		'borrows' : 1,
		// This object uses something from another object.
		'callback' : 1,
		// Document a callback function.
		'classdesc' : 1,
		// Use the following text to describe the entire class.
		'constant' : 1,
		// Document an object as a constant.
		// 'constructor': 1,
		// This function is intended to be called with the "new" keyword.
		'constructs' : 1,
		// This function member will be the constructor for the previous class.
		'copyright' : 1,
		// Document some copyright information.
		'default' : 1,
		// Document the default value.
		'deprecated' : 1,
		// Document that this is no longer the preferred way.
		'desc' : 1,
		// Describe a symbol.
		'enum' : 1,
		// Document a collection of related properties.
		'event' : 1,
		// Document an event.
		'example' : 1,
		// Provide an example of how to use a documented item.
		'exports' : 1,
		// Identify the member that is exported by a JavaScript module.
		'external' : 1,
		// Document an external class/namespace/module.
		'file' : 1,
		// Describe a file.
		'fires' : 1,
		// Describe the events this method may fire.
		'global' : 1,
		// Document a global object.
		'ignore' : 1,
		// [todo] Remove this from the final output.
		'inner' : 1,
		// Document an inner object.
		'instance' : 1,
		// Document an instance member.
		'kind' : 1,
		// What kind of symbol is this?
		'lends' : 1,
		// Document properties on an object literal as if they belonged to a
		// symbol
		// with a given name.
		'license' : 1,
		// [todo] Document the software license that applies to this code.
		'link' : 1,
		// Inline tag - create a link.
		'member' : 1,
		// Document a member.
		// 'memberof': 1,
		// 'memberOf': 1,
		// This symbol belongs to a parent symbol.
		// 'method': 1,
		// Describe a method or function.
		'mixes' : 1,
		// This object mixes in all the members from another object.
		'mixin' : 1,
		// Document a mixin object.
		'module' : 1,
		// Document a JavaScript module.
		'name' : 1,
		// Document the name of an object.
		'namespace' : 1,
		// Document a namespace object.
		// 'param': 1,
		// Document the parameter to a function.
		'private' : 1,
		// This symbol is meant to be private.
		'property' : 1,
		// Document a property of an object.
		'protected' : 1,
		// This member is meant to be protected.
		'public' : 1,
		// This symbol is meant to be public.
		'readonly' : 1,
		// This symbol is meant to be read-only.
		// 'requires': 1,
		// This file requires a JavaScript module.
		'returns' : 1,
		'return' : 1,
		// Document the return value of a function.
		'see' : 1,
		// Refer to some other documentation for more information.
		'since' : 1,
		// When was this feature added?
		'static' : 1,
		// Document a static member.
		'summary' : 1,
		// A shorter version of the full description.
		'this' : 1,
		// What does the 'this' keyword refer to here?
		'throws' : 1,
		// Describe what errors could be thrown.
		'todo' : 1,
		// Document tasks to be completed.
		'tutorial' : 1,
		// Insert a link to an included tutorial file.
		'type' : 1,
		// Document the type of an object.
		'typedef' : 1,
		// Document a custom type.
		'variation' : 1,
		// Distinguish different objects with the same name.
		'version' : 1
	// Documents the version number of an item.
	};

	var buffer = [];
	var hasAttributes = false;
	for ( var a in docletData) {
		if (a.charAt(0) === '@') {
			hasAttributes = true;
		}
	}

	if (!defineModuleInTopOfFile && docletData['@exports'] != null) {
		// get description
		if (firstDoclet.description != null
				&& firstDoclet.description.length > 0) {
			buffer.push(' * ' + firstDoclet.description);
			has_description = true;
		}

		// get freeText
		if (firstDoclet.freeText != null && firstDoclet.freeText.length > 0) {
			buffer.push(' * ' + firstDoclet.freeText);
			// only add extra line if @attributes are present
			if (hasAttributes) {
				buffer.push(' * ');
			}

			has_description = true;
		}
	}

	// get description
	if (docletData.description != null && docletData.description.length > 0) {
		buffer.push(' * ' + docletData.description);
		has_description = true;
	}

	// get freeText
	if (docletData.freeText != null && docletData.freeText.length > 0) {
		buffer.push(' * ' + docletData.freeText);
		// only add extra line if @attributes are present
		if (hasAttributes) {
			buffer.push(' * ');
		}
		has_description = true;
	}
	var atCount = 0;

	// get entity type
	if (docletData.nodeType != null) {
		var nodeType = docletData.nodeType;
		var correctNodeName = '';

		if (nodeType === 'CLASS') {
			correctNodeName = 'constructor';
			buffer.push(' * @' + correctNodeName);
			atCount++;
		}

		if (docletData["@module"] != null) {
			docletData.moduleName = docletData["@module"];
			delete docletData["@module"];
		}

		if (defineModuleInTopOfFile) {
			correctNodeName = 'module';
			buffer.push(' * @' + correctNodeName + ' ' + docletData.moduleName);
			atCount++;
			// console.log("REQUIRES??? " + docletData.requiresList);
			try {
				for (var r = 0; r < docletData.requiresList.length; r++) {
					var include = docletData.requiresList[r];
					if (typeof include === 'string') {
						buffer.push(' * @requires ' + include);
					} else {
						buffer.push(' * @requires ' + include.name);
					}

					atCount++;
				}
			} catch (reqEr) {
				console.error("ERROR BUILDING REQUIRES: " + reqEr);
			}
		} else if (docletData['@exports'] != null) {
			// merge firstDoclet
			for ( var f in firstDoclet) {
				if (f.indexOf('@') === 0) {
					docletData[f] = firstDoclet[f];
				}
			}
		}
	}

	// console.log(docletData.tagName);

	var returnTag = '';

	// get secondary details
	for ( var e in docletData) {

		var rawName = e;

		if (e.indexOf('@') === 0) {
			rawName = e.substring(1);
		}

		if (docletData.hasOwnProperty(e) && printableTags[rawName] === 1
				&& typeof docletData[e] === 'string') {
			if (rawName === 'type') {
				var typeText = docletData[e];
				typeText = fixReturnText(typeText, docletData);

				buffer.push(' * ' + e + ' ' + typeText);
			} else {
				buffer.push(' * ' + e + ' ' + docletData[e]);
			}

			atCount++;
		}
	}

	if (docletData['@return'] != null) {
		// var returnText = docletData[e];
		// returnText = fixReturnText(returnText, docletData);
		// returnTag = ' * ' + e + ' ' + returnText;

		var returnBlock = docletData['@return'];

		returnTag = ' * ' + '@return' + ' ' + returnBlock.type + ' '
				+ returnBlock.description;
		// console.log(returnTag);
	}

	if (docletData['@exports'] != null) {
		try {
			for (var r = 0; r < docletData.requiresList.length; r++) {
				var include = docletData.requiresList[r];
				if (typeof include === 'string') {
					buffer.push(' * @requires ' + include);
				} else {
					buffer.push(' * @requires ' + include.name);
				}
				atCount++;
			}
		} catch (reqEr) {
			console.error("ERROR BUILDING REQUIRES for @exports: " + reqEr);
		}
	}

	// get params
	var docletParams = docletData['params'];

	if (docletParams == null) {
		console.error(typeof docletData);
		console.error('docletData["params"] is NULL NULL NULL!!!!');
	}

	if (docletParams.length > 0) {

		// buffer.push(' * @' + e + " " + docletData[e]);
		for (var p = 0; p < docletParams.length; p++) {
			var param = docletParams[p];

			if (param.type != null) {
				if (param.type === '{string}') {
					param.type = '{String}';
				} else if (param.type === '{object}') {
					param.type = '{Object}';
				} else if (param.type === '{number}') {
					param.type = '{Number}';
				} else if (param.type === '{int}') {
					param.type = '{Number}';
				} else if (param.type === '{long}') {
					param.type = '{Number}';
				} else if (param.type === '{double}') {
					param.type = '{Number}';
				} else if (param.type === '{boolean}') {
					param.type = '{Boolean}';
				} else if (param.type === '{bool}') {
					param.type = '{Boolean}';
				}
			}

			if (param.name == null) {
				console.warn('printDoclet: param name is NULL');
			} else {
				if (param.type.length > 0 && param.description.length > 0) {
					buffer.push(' * @param ' + param.type + ' ' + param.name
							+ ' ' + param.description);
				} else if (param.type.length > 0) {
					buffer.push(' * @param ' + param.type + ' ' + param.name);
				} else if (param.description.length > 0) {
					buffer.push(' * @param ' + param.name + ' '
							+ param.description);
				} else {
					buffer.push(' * @param ' + param.name);
				}
			}
		}
	}

	if (returnTag.length > 0) {
		buffer.push(returnTag);
	}

	// + JSON.stringify(docletData)
	var docletMarkup = '';
	if (buffer.length === 1) {
		docletMarkup = '/** ' + buffer[0].split('* ')[1] + ' */' + '';
	} else {
		docletMarkup = '/**\n' + buffer.join('\n') + '\n */' + '';
	}
	if (docletMarkup.indexOf('@') === -1 && !has_description) {
		console.error("!!!!!!!!!!!!!!!!!!!!!!!!! empty doclet");
		console.warn(JSON.stringify(docletData));
		return '/** ' + '@todo Please add a description.' + ' */' + '';
	}
	// console.warn(docletMarkup);
	return docletMarkup;
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
	return '';
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
	return output;
}

var firstDoclet = null;

var typesMap = {
	'function' : 'Function',
	'number' : 'Number',
	'int' : 'Number',
	'float' : 'Number',
	'long' : 'Number',
	'bool' : 'Boolean',
	'boolean' : 'Boolean',
	'string' : 'String',
	'array' : 'Array',
	'object' : 'Object'
};

function getType(input) {
	console.log(input);
	var lowerInput = input.toLowerCase();
	var theType = typesMap[lowerInput];
	if (theType != null) {
		return theType;
	}
	if (lowerInput === 'null' || lowerInput === 'void'
			|| lowerInput === 'nothing') {
		return 'null';
	}
	if (input.indexOf('$') === 0) {
		return input;
	}
	return null;
}

function fixWords(input) {
	var splitter = input.split(' ');
	var output = [];

	for (var index = 0; index < splitter.length; index++) {
		var word = splitter[index].trim();

		if (word.length > 0) {
			output.push(word);
		}
	}
	return output.join(' ');
}

function replaceWord(text, whichWord, withWhat) {
	text = text.trim();
	var buffer = text.split(' ');
	buffer[whichWord] = withWhat;
	return buffer.join(' ');
}

function fixReturnText(input, docletData) {
	input = input.trim();
	var saveInput = input;
	input = fixWords(input);
	var firstWord = input.split(' ')[0];
	var theType = getType(firstWord);

	if (input.indexOf('{') === 0) {
		// it's a well-formed jsDoclet
		var splitter = input.split('}');
		var type = splitter[0];
		splitter[0] = '{' + fixTypes(type, true);
		input = splitter.join('}');
	} else if (input.indexOf('{') !== -1) {
		// is ia a YUI-style jsDoc?
		console.warn('YUI??? >>> ' + saveInput);
	} else {
		// have to guess what it is
		// ??
		if (input.indexOf(' ') === -1) {
			input = fixTypes(input);
		} else {
			console.warn('Nonstandard comment (' + docletData.moduleName
					+ '): ' + saveInput);
			if (theType != null && theType != 'null') {
				console.warn("IS THIS THE TYPE??? {" + theType + "}");
				input = replaceWord(saveInput, 0, '{' + theType + '}');
				// input = saveInput;
			} else {
				return '{Object} FIXME: Nonstandard comment in line: "'
						+ saveInput + '"';
			}
		}
	}
	// {string} name name of severity level
	// {string} stack trace
	// // console.log(input);
	return input;
}

function fixTypes(input, dontCuddle) {
	input = input.trim();

	if (input.length === 0) {
		return input;
	}

	if (input.indexOf('<') !== -1 && input.indexOf('>') !== -1) {
		return input;
	}
	input = input.split('<').join('');
	input = input.split('>').join('');
	input = input.split('{').join('');
	input = input.split('}').join('');
	input = input.split('[').join('');
	input = input.split(']').join('');
	var swap = typesMap[input.toLowerCase()];

	if (swap != null) {
		input = swap;
	} else {
		input = capitalize(input);
	}
	// // console.log(input);

	if (dontCuddle) {
		return input;
	}
	return '{' + input + '}';
}

function parseDoclet(input, doclet, defineModuleInTopOfFile, nextLineOfCode,
		chunkIndex) {
	doclet = doclet.split('@returns').join('@return');
	var commentBuffer = '';
	var docletData = {};
	docletData.params = [];

	// docletData.requiresList = []; // input.results.amdProc.requires;
	docletData.requiresList = input.results.amdProc.requires;
	// }
	docletData.moduleName = input.name;
	docletData.camelName = input.camelName;

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
	// do it now

	if (doclet.indexOf('/**') === -1 || doclet.indexOf('*/') === -1) {
		console.error('parseDoclet FORMAT ERROR: ' + doclet);
		return docletData;
	}

	// strip comment tags
	var chunker = doclet.split('/**')[1];
	chunker = chunker.split('*/')[0];
	// // // console.log(chunker);
	var lines = chunker.split('\n');
	var index = 0;
	var linesLength = lines.length;
	var currentTag = '';
	var firstTag = false;
	var currentTagObject = null;
	var quotedHTML = false;
	for (index = 0; index < linesLength; index++) {
		var line = lines[index].trim();

		if (line.length === 0) {
			continue;
		}

		if (line.indexOf('*') === 0) {
			// strip the comment star
			line = line.substring(1).trim();
		} else {
			// console.warn('parseDoclet(' + input.name + '): a line did not
			// begin with * ' + line);
			line = line.trim();
		}

		if (line.indexOf('@') === 0) {
			if (!firstTag) {
				docletData['freeText'] = commentBuffer.trim();
				commentBuffer = '';
			} else if (currentTagObject != null) {
				if (currentTagObject.description != null) {
					currentTagObject.description += (' ' + commentBuffer.trim());
					commentBuffer = '';
				}
			}
			firstTag = true;
			// it's a jsDoc comment
			line = fixWords(line);
			var tag = line.split(' ')[0];
			tag = tag.split('@')[1];
			var tagData = line.split(' ');
			tagData.shift();

			if (tag === 'param') {
				if (tagData.length === 0) {
					// console.error('(' + input.name + ')' + " Can't parse data
					// for this param tag: " + line);
					continue;
				}
				var paramDescription = '';
				var paramChunk = tagData[0].trim();
				var paramName = '';
				var paramType = '';

				if (paramChunk.indexOf('{') === 0 && tagData.length > 1) {
					paramType = paramChunk;
					paramName = tagData[1].trim();
					tagData.shift();
					tagData.shift();
				} else {
					paramName = paramChunk;
					tagData.shift();
				}
				paramDescription = tagData.join(' ').trim();

				paramType = fixTypes(paramType);

				if (paramType.length === 0) {
					// // console.log(line);
					// console.warn(paramObject);
					if (paramDescription.indexOf('}') !== -1) {
						var paramParser = paramDescription.split('}');
						paramType = fixTypes(paramParser[0]);
						paramDescription = paramParser[1];
						paramDescription = paramDescription.trim();

						if (paramDescription.indexOf('{') !== -1) {
							paramDescription += '}';
						}
						console.warn(paramType + " " + paramDescription);
					}
				}

				var paramObject = {
					tagName : tag,
					name : paramName,
					type : paramType,
					description : paramDescription
				};
				currentTagObject = paramObject;
				docletData.params.push(paramObject);
			} else if (tag === 'return') {
				if (tagData.length === 0) {
					// console.error('(' + input.name + ')' + " Can't parse data
					// for this return tag: " + line);
					continue;
				}
				var returnDescription = '';
				var returnChunk = tagData[0].trim();
				// var returnName = '';
				var returnType = '';

				if (returnChunk.indexOf('{') === 0 && tagData.length > 1) {
					// returnType = returnChunk;
					returnType = tagData[0].trim();
					tagData.shift();
					tagData.shift();
				} else {
					returnType = returnChunk;
					tagData.shift();
				}
				returnDescription = tagData.join(' ').trim();

				returnType = fixTypes(returnType);

				if (returnType.length === 0) {
					// // console.log(line);
					// console.warn(returnObject);
					if (returnDescription.indexOf('}') !== -1) {
						var returnParser = returnDescription.split('}');
						returnType = fixTypes(returnParser[0]);
						returnDescription = returnParser[1];
						returnDescription = returnDescription.trim();

						if (returnDescription.indexOf('{') !== -1) {
							returnDescription += '}';
						}
						console.warn(returnType + " " + returnDescription);
					}
				}

				var returnObject = {
					// name : returnName,
					tagName : tag,
					type : returnType,
					description : returnDescription,
					line : line
				};
				currentTagObject = returnObject;
				docletData['@return'] = currentTagObject;
				console.log(currentTagObject);

			} else if (tag === 'requires') {
				var paramDescription = '';
				var paramChunk = tagData[0].trim();
				var paramName = '';
				var paramType = ''; // '{Module}';

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

				if (paramDescription.indexOf('in {@link') != -1) {
					paramDescription = '';
				}
				// docletData.requiresList.push({
				// name: paramName,
				// type: paramType,
				// description: paramDescription
				// });
				currentTagObject = null;
			} else {
				// if (chunkIndex === 0) {
				// if (tag === 'author' || tag === 'version' || tag ===
				// 'copyright') {
				// continue;
				// }
				// }
				docletData['@' + tag] = tagData.join(' ').trim();
				currentTagObject = docletData['@' + tag];
				currentTagObject.tagName = tag;
			}
			currentTag = tag;
		} else {
			// console.warn("it's a freeform description comment... who owns
			// it?");
			// it's a freeform description comment... who owns it?
			var commentChunk = line.trim();
			// console.log(JSON.stringify(currentTagObject));
			// console.log(commentChunk);
			if (commentChunk.indexOf('<pre>') !== -1
					|| commentChunk.indexOf('<code>') !== -1
					|| commentChunk.indexOf('<xmp>') !== -1) {
				quotedHTML = true;
			} else if (commentChunk.indexOf('</pre>') !== -1
					|| commentChunk.indexOf('</code>') !== -1
					|| commentChunk.indexOf('</xmp>') !== -1) {
				quotedHTML = false;
			}
			if (commentChunk.length > 0) {
				if (commentBuffer.length > 0) {
					if (quotedHTML) {
						commentBuffer += ' \r\n * ' + commentChunk;
					} else {
						commentBuffer += ' <br />' + commentChunk;
					}

				} else {
					commentBuffer += commentChunk;
				}
			}

			commentBuffer = commentBuffer.trim();
		}
	}

	if (currentTagObject != null) {

		if (currentTagObject.description != null) {
			currentTagObject.description = currentTagObject.description.trim();
			currentTagObject.description += (' ' + commentBuffer.trim());
			commentBuffer = '';
		} else {
			// console.warn("COMMENTS: " + commentBuffer.trim());
		}
		// console.log(JSON.stringify(currentTagObject));
	} else {
		console.warn("COMMENTS: " + commentBuffer.trim());
		docletData['freeText'] = commentBuffer.trim();
	}

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
	} else if (docletData['@class'] != null && docletData['@class'].length > 0) {
		docletData['constructor'] = docletData['@class'];
		docletData['className'] = docletData['@class'];
		delete docletData['@class'];
	}

	if (docletData['className'] != null && docletData['className'].length > 0) {
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

	if ((docletData['freeText'] != null) && docletData['freeText'].length > 0) {
		if (docletData['freeText'].charAt(docletData['freeText'].length - 1) !== '.') {
			if (docletData['freeText'].indexOf('</pre>') === -1) {
				docletData['freeText'] += '.';
			}

			// console.log("freeText>>> " + docletData['freeText']);
		}
		docletData['freeText'] = docletData['freeText'].split('<br />').join(
				'<br />\r\n * ');
	}
	// console.log(JSON.stringify(docletData));
	return docletData;
}

function walk(node, attr, val, results) {
	if (results == null) {
		results = [];
	}

	if (node.hasOwnProperty(attr)) {
		if (node[attr] === val) {
			// // console.log(attr + '=' + node[attr]);
			// if (node.id != null){
			// // console.log(val + ":" + node.id.name);
			//
			// }
			// else{
			// // console.log(val + ":" + '_ANONYMOUS_');
			// }
			// // console.log(node.body); ReturnStatement

			results.push(node);
		}
	}

	// type: Program
	// body: []
	// range: []
	// comments: []
	// tokens: []
	// errors: []

	for ( var e in node) {
		if (attr === e) {
			continue;
		}

		if (e === 'comments') {
			continue;
		}

		if (node.hasOwnProperty(e)) {
			var child = node[e];

			if (child == null) {
				continue;
			}

			// // console.log(child);
			if (typeof child === 'object' && child.length != null) {
				// array?
				// // console.log(e + ': ' + '[]');
				for (var index = 0; index < child.length; index++) {
					var elem = child[index];
					walk(elem, attr, val, results);
				}
			} else if (typeof child === 'object') {
				// obj?
				// // console.log(e + ': ' + '{}'); //JSON.stringify(child));
				walk(child, attr, val, results);
			} else if (typeof child === 'string') {
				// string?
				// // console.log(e + ': ' + child);
			} else {
				// string?
				// // console.log(e + ': ' + typeof child);
			}
		}
	}
	return results;
}

function getNodesByType(ast, nodeType) {
	var results = walk(ast, 'type', nodeType);

	for (var index = 0; index < results.length; index++) {
		var node = results[index];
		var returnType = '?';

		if (node.body != null) {

			var returnStatements = getNodesByType(node.body, 'ReturnStatement');

			if (returnStatements.length > 0) {
				if (returnStatements[0].argument != null) {
					var statement = returnStatements[0].argument;

					if (statement.type === 'Literal') {
						returnType = (typeof statement.value);
					} else if (statement.type === 'Identifier') {
						returnType = '?';
					} else if (statement.type === 'CallExpression') {
						returnType = '?';
					} else if (statement.type === 'LogicalExpression') {
						returnType = 'boolean';
					} else {
						// // console.log(statement);
					}

					// if (statement.name != null) {
					// // console.log(statement.type + ':' + statement.name +
					// ':' + returnType);
					// } else {
					// // console.log(statement.type + ':' + returnType);
					// }
				} else {
					returnType = 'void';
				}
				// else it's just a bail, not a return type
				// else {
				// // console.log(returnStatements[0]);
				// }
			}
		}
		node.returnType = returnType;
	}
	return results;
}

function fixDoclets(walkerObj) {
	// // console.log('fixDoclets');
	var beautify = require('js-beautify');

	var input = walkerObj.source;

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

		var unpackers = [ P_A_C_K_E_R, Urlencoded, JavascriptObfuscator,
				MyObfuscate ];

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

	// input = beautify(input, {
	// 'indent_size': 2,
	// 'indent_char': ' ',
	// 'indent_level': 0,
	// 'indent_with_tabs': false,
	// 'preserve_newlines': true,
	// 'max_preserve_newlines': 1,
	// 'jslint_happy': true,
	// 'brace_style': 'collapse',
	// 'keep_array_indentation': false,
	// 'keep_function_indentation': false,
	// 'space_before_conditional': true,
	// 'break_chained_methods': false,
	// 'eval_code': false,
	// 'unescape_strings': false,
	// 'wrap_line_length': 200
	// });

	var _esprima = require('esprima');

	var ast = {};

	//try {
		ast = _esprima.parse(input, {
			comment : true,
			tolerant : true,
			range : true,
			raw : true,
			tokens : true
		});
	//} catch (ex) {
	//	console.error(ex.stack);
	//	return null;
	//}
	// writeFile("dump.json", JSON.stringify(ast));
	// parsed = parseDoclet(input, block, defineModuleInTopOfFile,
	// nextLineOfCode);

	var moduleAtTop = input.indexOf('@exports') === -1;
	var defineModuleInTopOfFile = moduleAtTop;

	var newFile = '';
	var cursor = 0;

	var functionExpressions = getNodesByType(ast, 'FunctionExpression');
	var functionDeclarations = getNodesByType(ast, 'FunctionDeclaration');

	// console.warn(functionExpressions);
	// console.warn(functionDeclarations);
	//
	var dCount = 0;
	if (ast.comments != null) {
		for (var index = 0; index < ast.comments.length; index++) {
			var comment = ast.comments[index];
			// console.log(comment);

			if (comment.type === 'Line') {
				continue;
			}
			var commentText = comment.value.trim();

			if (commentText.indexOf('*') === 0) {
				commentText = '/**\n' + commentText + '\n*/';
			}

			// This drops comments without attributes.
			// This is bad.
			if (commentText.indexOf('@') === -1) {
				// continue;
				console.log('Esprima found a comment without any @.');
				commentText = '@description ' + commentText;
			}

			var doclet = parseDoclet(walkerObj, commentText,
					defineModuleInTopOfFile, '', dCount);
			dCount++;
			// console.warn(doclet);
			// console.log(printDoclet(doclet) + '\n');
			var newDoclet = printDoclet(doclet, defineModuleInTopOfFile);
			comment.formatted = newDoclet;

			for ( var t in doclet) {
				if (t.indexOf('@') === 0) {
					comment[t] = doclet[t];
				}
			}

			if (doclet.params != null) {
				comment.params = doclet.params;
			}

			comment.doclet = doclet;

			ast.comments[index] = comment;
			defineModuleInTopOfFile = false;

			// TODO: merge the new comments back in

			// // console.log(comment);

			// get range
			var range = comment.range;
			// get text range from end of last comment to beginning of this
			// comment
			var beforeRange = range[0] - 1;

			if (beforeRange < 0) {
				beforeRange = 0;
			}
			var nextChunk = input.substring(cursor, beforeRange);

			// // console.log(cursor + ',' + beforeRange);

			newFile += nextChunk;
			cursor = range[1];

			newFile += comment.formatted;

			// offset range start
			// offset range end
			// insert
			// save total offset

		}
	} else {
		return input;
	}

	// ??? How do we know where the last bit of code begins?
	var nextChunk = input.substring(cursor);
	newFile += nextChunk;

	// // console.log(newFile);

//	newFile = beautify(newFile, {
//		'indent_size' : 2,
//		'indent_char' : ' ',
//		'indent_level' : 0,
//		'indent_with_tabs' : false,
//		'preserve_newlines' : true,
//		'max_preserve_newlines' : 1,
//		'jslint_happy' : true,
//		'brace_style' : 'collapse',
//		'keep_array_indentation' : false,
//		'keep_function_indentation' : false,
//		'space_before_conditional' : true,
//		'break_chained_methods' : false,
//		'eval_code' : false,
//		'unescape_strings' : false,
//		'wrap_line_length' : 200
//	});

	// writeFile('new_' + testFileName, newFile);

	// // console.log(JSON.stringify(ast.comments, null, 2));

	// // console.log(JSON.stringify(parseDoclet(testFile, testFile, false,
	// '')));
	// // console.log(printDoclet(parseDoclet(testFile, testFile, false, '')));
	// // console.log('done');
	return newFile;
}

module.exports = {
	'parseDoclet' : parseDoclet,
	'printDoclet' : printDoclet,
	'fixDoclets' : fixDoclets
};

if (false) {
	var testFileName = 'doclet.js';
	var testFile = readFile(testFileName);

	var input = {
		name : getModuleName(testFileName),
		source : testFile,
		fileName : testFileName,
		camelName : camelize(getModuleName(testFileName)),
		results : {
			"amdProc" : {
				"requires" : [],
				"moduleName" : testFileName,
				"AMD" : false,
				"webPath" : ""
			}
		}
	};

	var testResult = fixDoclets(input);
	writeFile("new_doclet.js", testResult);
}
