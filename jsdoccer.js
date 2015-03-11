var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');
var uid = 0;
var nodes = [];
// Doctor the comment. Can cause problems.
var FIX_COMMENT_GRAMMAR = true;
// Try to normalize module names so hand-coded ones match. Can cause problems.
var FIX_MODULE_NAMES = true;

var Logger = function() {
    this.log = function(msg) {
        console.log(msg);
    };
    this.warn = function(msg) {
        console.warn(msg);
    };
    this.error = function(msg) {
        console.error(msg);
    };
};

var logger = new Logger();

function mapModuleName(mappedModuleName, walkerObj) {
    var modulePaths = walkerObj.modulePaths;
    for ( var p in modulePaths) {
        if (modulePaths.hasOwnProperty(p)) {
            var pattern = modulePaths[p];
            if (mappedModuleName.indexOf(pattern) !== -1) {
                mappedModuleName = mappedModuleName.split(pattern).join(p);
                // stop, don't apply every match
                break;
            }

        }
    }

    if (mappedModuleName.charAt(0) === '/') {
        mappedModuleName = mappedModuleName.substring(1);
    }

    return mappedModuleName;
}

function fixModuleNameInText(text, walkerObj) {

    //console.warn('Fix reference to module name "' + text + '".');
    var splitter = text.split('module:');
    splitter.shift();
    var moduleName = splitter.join('module:').trim();
    moduleName = moduleName.split(' ')[0];
    
    //var newModuleName = inferModuleName(moduleName, walkerObj);
    // logger.log('Fix moduleName: "' + moduleName + '" >>> "' + newModuleName +
    // '".');
    text = 'module:' + mapModuleName(moduleName, walkerObj);
    //console.warn('fixModuleNameInText Fixed text: "' + text + '".');

    return text;
}

function inferModuleName( walkerObj) {
    var usedModuleName = walkerObj.fileName.split('.js')[0];

    var packagePath = walkerObj.path.split('/');
    packagePath.shift();
    packagePath = packagePath.join('/');
    packagePath = packagePath.split('.js')[0];

    usedModuleName = packagePath;

    return usedModuleName;
}
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
        // logger.error(er.message);
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
        // // logger.log('decamelize >>> ' + output);
        return output;
    }
    test = input.split('-');
    if ((test.length > 1) && (input.indexOf('-') > 0)) {
        // do a different kind of split here
        var output = trim(input.toLowerCase());
        // // logger.log('decamelize >>> ' + output);
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
    return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
    // return input.trim();
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
        // // // logger.log("does not exist");
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
        // // // logger.log("does not exist");
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
        // // // logger.log("does not exist");
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

function printDoclet(docletData, defineModuleInTopOfFile) {
    var has_description = false;
    // // logger.log('>>>>>>>>>>>>>>>>>>>>>>>>>> printDoclet');
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
            // logger.log("REQUIRES??? " + docletData.requiresList);
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
                logger.error("ERROR BUILDING REQUIRES: " + reqEr);
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
    // logger.log(docletData.tagName);
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
        // logger.log(returnTag);
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
            logger.error("ERROR BUILDING REQUIRES for @exports: " + reqEr);
        }
    }
    // get params
    var docletParams = docletData['params'];
    if (docletParams == null) {
        logger.error(typeof docletData);
        logger.error('docletData["params"] is NULL NULL NULL!!!!');
    }
    if (docletParams.length > 0) {
        // buffer.push(' * @' + e + " " + docletData[e]);
        for (var p = 0; p < docletParams.length; p++) {
            var param = docletParams[p];
            if (param.type != null) {
                param.type = param.type.toLowerCase();
                if (param.type === '{string}') {
                    param.type = '{String}';
                } else if (param.type === '{object}') {
                    param.type = '{Object}';
                } else if (param.type === '{number}') {
                    param.type = '{Number}';
                } else if (param.type === '{int}') {
                    param.type = '{Number}';
                } else if (param.type === '{integer}') {
                    param.type = '{Number}';
                } else if (param.type === '{long}') {
                    param.type = '{Number}';
                } else if (param.type === '{double}') {
                    param.type = '{Number}';
                } else if (param.type === '{float}') {
                    param.type = '{Number}';
                } else if (param.type === '{boolean}') {
                    param.type = '{Boolean}';
                } else if (param.type === '{bool}') {
                    param.type = '{Boolean}';
                }
            }
            if (param.name == null) {
                // logger.log('printDoclet: param name is NULL');
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
        logger.error("!!!!!!!!!!!!!!!!!!!!!!!!! empty doclet");
        // logger.log(JSON.stringify(docletData));
        return '/** ' + '@todo Please add a description.' + ' */' + '';
    }
    // // logger.log(docletMarkup);
    return docletMarkup;
}

function getLines(lines, x, y, buffer) {
    if (buffer == null) {
        buffer = [];
    }
    for (var index = x; index < (y + 1); index++) {
        buffer.push(lines[index]);
    }
    return buffer.join('\n');
}
/**
 * Gets the non-tag lines _around_ a tag. Where tag = {tag : 'param',line :
 * 0,lastLine: -1 }.
 * 
 * @param {Array
 *            <String>} buffer
 * @param {Array
 *            <String>} lines
 * @param {Object}
 *            tag
 * @param {boolean}
 *            getPreamble
 */
function getTagLines(lines, tag, buffer, getPreamble) {
    // logger.log(lines);
    var start = tag.line;
    var end = tag.lastLine;
    if (getPreamble) {
        start = 0;
        end = tag.line - 1;
        // logger.log(lines);
        // logger.log(tag);
        // logger.log(start + ',' + end);
        if (start < 1 && end < 1) {
            return;
        }
    }
    if (end === -1) {
        end = lines.length - 1;
        // logger.log('Reading to the end of the doclet.');
    }
    tag.textStartsOnSameLine = false;
    getLines(lines, start, end, buffer);
    if ((!getPreamble) && (buffer.length > 0)) {
        var firstLine = buffer[0];
        var realTag = '@' + tag.tag;
        var where = firstLine.indexOf(realTag);
        firstLine = firstLine.substring(where + realTag.length);
        // logger.log(buffer[0] + '>>>>>' + firstLine);
        if (firstLine.length > 0) {
            // logger.log(buffer[0] + '>>>>>' + firstLine);
            tag.textStartsOnSameLine = true;
        }
        if (buffer.length > 0) {
            tag.textStartsOnSameLine = true;
        }
        // } else {
        // logger.log(buffer[0] + '>>>>>' + firstLine);
        // }
        buffer[0] = firstLine;
    }
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
        // logger.log(moduleName);
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
    // logger.log(input);
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
        // logger.warn('YUI??? >>> ' + saveInput);
    } else {
        // have to guess what it is
        // ??
        if (input.indexOf(' ') === -1) {
            input = fixTypes(input);
        } else {
            // logger.log('Nonstandard comment (' + docletData.moduleName +
            // '): ' + saveInput);
            if (theType != null && theType != 'null') {
                // logger.warn("IS THIS THE TYPE??? {" + theType + "}");
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
    // // logger.log(input);
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
    // // logger.log(input);
    if (dontCuddle) {
        return input;
    }
    return '{' + input + '}';
}
/**
 * 
 * @param {String}
 *            input
 * @return {String}
 */
function stripStars(input) {
    if (input.trim().indexOf('*') === 0) {
        input = input.split('');
        input.shift();
        input = input.join('');
    }
    return input;
}
/**
 * Add * to a line in a doclet.
 * 
 * @param input
 * @returns
 */
function addStars(input) {
    if (input.trim().indexOf('*') !== 0) {
        input = input.split('');
        input.unshift(' * ');
        input = input.join('');
    }
    return input;
}
/**
 * Add * to each line in a block of doclet text.
 * 
 * @param lines
 * @returns
 */
function addStarLines(lines, tag) {
    lines = lines.split('\n');
    var linesLength = lines.length;
    for (index = 0; index < linesLength; index++) {
        if (index === 0) {
            if (!tag.textStartsOnSameLine) {
                var line = lines[index];
                line = addStars(line);
                lines[index] = line;
            }
            // else don't do it
        } else {
            var line = lines[index];
            line = addStars(line);
            lines[index] = line;
        }
    }
    lines = lines.join('\n');
    return lines;
}
/**
 * 
 * @param {Array
 *            <String>} lines
 * @return {Array<String>}
 */
function stripStarLines(lines) {
    var linesLength = lines.length;
    for (index = 0; index < linesLength; index++) {
        var line = lines[index].trim();
        line = stripStars(line);
        lines[index] = line;
    }
    return lines;
}
/**
 * 
 * @param lines
 * @return {boolean}
 */
function linesAreEmpty(lines) {
    var linesLength = lines.length;
    for (index = 0; index < linesLength; index++) {
        var line = lines[index].trim();
        if (stripStars(line).length !== 0) {
            return false;
        }
    }
    return true;
}

function parseDoclet(input, doclet, defineModuleInTopOfFile, nextLineOfCode,
        chunkIndex) {
    doclet = doclet.split('@Returns').join('@return');
    doclet = doclet.split('@returns').join('@return');
    doclet = doclet.split('@Desc').join('@desc');
    doclet = doclet.split('@Param').join('@param');
    doclet = doclet.split('@desc ').join('@description ');
    var commentBuffer = '';
    var docletData = {};
    docletData.params = [];
    docletData.tags = [];
    docletData.requiresList = input.results.amdProc.requires;
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
            // // // logger.log("AUGMENTS >>>>>>>>" + leftOfEquals + "," +
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
            // // // logger.log("AUGMENTS >>>>>>>>" + leftOfExtend + "," +
            // rightOfExtend);
        }
        // $.wf.QuickShipOptions = Backbone.View.extend(
        // // // logger.log(" AUGMENTS >>>>>>>>>>>>>>>>>" + nextLineOfCode);
    }
    if (firstDoclet == null) {
        firstDoclet = docletData;
    }
    // if (defineModuleInTopOfFile) {
    // do it now
    if (doclet.indexOf('/**') === -1 || doclet.indexOf('*/') === -1) {
        logger.error('parseDoclet FORMAT ERROR: ' + doclet);
        return docletData;
    }
    // strip comment tags
    var chunker = doclet.split('/**')[1];
    chunker = chunker.split('*/')[0];
    // // // logger.log(chunker);
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
            // // logger.log('parseDoclet(' + input.name + '): a line did not
            // begin with * ' + line);
            line = line.trim();
        }
        if (line.indexOf('@') === 0) {
            if (!firstTag) {
                docletData['freeText'] = commentBuffer.trim();
                // logger.log('freeText: ' + docletData['freeText']);
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
            var lastTag = null;
            if (docletData.tags.length > 0) {
                lastTag = docletData.tags[docletData.tags.length - 1];
            }
            var newTag = {
                tag : tag,
                line : index,
                lastLine : -1
            };
            if (lastTag !== null) {
                lastTag.lastLine = index - 1;
            }
            // logger.log(newTag);
            docletData.tags.push(newTag);
            if (tag === 'param') {
                if (tagData.length === 0) {
                    logger.log('(' + input.name + ')'
                            + " Can't parse data for this param tag: " + line);
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
                    // // logger.log(line);
                    // // logger.log(paramObject);
                    if (paramDescription.indexOf('}') !== -1) {
                        var paramParser = paramDescription.split('}');
                        paramType = fixTypes(paramParser[0]);
                        paramDescription = paramParser[1];
                        paramDescription = paramDescription.trim();
                        if (paramDescription.indexOf('{') !== -1) {
                            paramDescription += '}';
                        }
                        // logger.log(paramType + " " + paramDescription);
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
                    logger.error('(' + input.name + ')'
                            + " Can't parse data for this return tag: " + line);
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
                // logger.log(returnChunk);
                returnType = fixTypes(returnType);
                if (returnType.length === 0) {
                    // // logger.log(line);
                    // // logger.log(returnObject);
                    if (returnDescription.indexOf('}') !== -1) {
                        var returnParser = returnDescription.split('}');
                        returnType = fixTypes(returnParser[0]);
                        returnDescription = returnParser[1];
                        returnDescription = returnDescription.trim();
                        if (returnDescription.indexOf('{') !== -1) {
                            returnDescription += '}';
                        }
                        // logger.log(returnType + " " + returnDescription);
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
                // logger.log(currentTagObject);
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
                if (tagData.length === 0) {
                    // docletData['@' + tag] = new String();
                    // docletData['@' + tag] = {};
                    docletData['@' + tag] = tagData.join(' ').trim();
                    currentTagObject = docletData['@' + tag];
                    currentTagObject.tagName = tag;
                    // logger.log("TAG DATA is EMPTY----->");
                    // // logger.log(currentTagObject);
                    currentTagObject.description = '';
                } else {
                    docletData['@' + tag] = tagData.join(' ').trim();
                    // docletData['@' + tag] = {};
                    currentTagObject = docletData['@' + tag];
                    currentTagObject.tagName = tag;
                    currentTagObject.description = tagData.join(' ').trim();
                    // logger.log("TAG DATA is _NOT_ EMPTY----->");
                    // logger.log(docletData['@' + tag]);
                    // // logger.log(currentTagObject);
                }
                // docletData['@' + tag] = tagData.join(' ').trim();
                // currentTagObject = docletData['@' + tag];
                // currentTagObject.tagName = tag;
            }
            currentTag = tag;
        } else {
            // // logger.log("it's a freeform description comment... who owns
            // it?");
            // it's a freeform description comment... who owns it?
            // logger.log(line);
        }
    }
    // Collate all the loose text fragments:
    // preamble is the text before any tags have been declared
    var preamble = [];

    // HOW DID THIS HAPPEN???

    if (docletData.tags.length > 0) {
        for (var index = 0; index < docletData.tags.length; index++) {
            var tag = docletData.tags[index];
            // textBuffer holds all contiguous lines of text between a tag and
            // the next tag
            // _or_
            // end of doclet
            // logger.log(tag);
            var textBuffer = [];
            if (index === 0) {
                getTagLines(lines, tag, preamble, true);
                // logger.log(preamble);
                preamble = stripStarLines(preamble);
                // logger.log('parseDoclet WTF');
                // logger.log(tag);
                // logger.log(preamble);
            }
            getTagLines(lines, tag, textBuffer, false);
            textBuffer = stripStarLines(textBuffer);
            // logger.log(textBuffer);
            tag.text = textBuffer.join('\n');
            // logger.log(tag);
            if (tag.text.trim().indexOf(':') === 0 && FIX_COMMENT_GRAMMAR
                    && tag.tag !== 'function' && tag.tag !== 'method') {
                // logger.log(tag.text);
                var stringBuffer = tag.text.trim().split('');
                stringBuffer.shift();
                tag.text = stringBuffer.join('');

                tag.text = capitalize(decamelize(tag.text).split('_').join(' '));
                var lastChar = tag.text.charAt(tag.text.length - 1);
                if (lastChar !== '.' && lastChar !== '?' && lastChar !== '!'
                        && lastChar !== ':') {
                    tag.text += '.';
                }
            }
            // logger.log(tag);
        }
    } else {
        // logger.log('doclet with no tags');
        if (!linesAreEmpty(lines)) {
            preamble = stripStarLines(lines);
            // logger.log('doclet with no tags HAS PREAMBLE:\n' + preamble);
        }
    }
    docletData.preamble = preamble.join('\n');
    if (linesAreEmpty(preamble)) {
        preamble = [];
        docletData.preamble = '';
    } else {
        docletData['freeText'] = docletData.preamble;
        // logger.log("parseDoclet: getting freeText from preamble");
        // logger.log(docletData.preamble);
    }

    // logger.log('freeText: ' + docletData['freeText']);
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
    } else if (docletData['@mixes'] != null) {
        //nodeType = 'MIXES';
       // console.warn(docletData);
    } else if (docletData['@var'] != null) {
        nodeType = 'VAR';
    } else if (docletData['@type'] != null) {
        nodeType = 'VAR';
    }
    docletData.nodeType = nodeType;
    if ((docletData['freeText'] != null) && docletData['freeText'].length > 0) {
        if (docletData['freeText'].trim().charAt(
                docletData['freeText'].trim().length - 1) !== '.') {
            if (docletData['freeText'].trim().indexOf('</pre>') === -1) {
                docletData['freeText'] += '.';
            }
            // logger.log("freeText>>> " + docletData['freeText']);
        }
        docletData['freeText'] = docletData['freeText'].split('<br />').join(
                '<br />\r\n * ');
    }
    // logger.log(doclet);
    // logger.log(JSON.stringify(docletData, null, 2));

    // logger.log(getRequiresTags(input));

    return docletData;
}

function walk(node, attr, val, results, parentNode) {
    if (parentNode == null) {
        parentNode = {
            type : 'ROOT'
        };
        parentNode.uid = -1;
    }
    if (node.type != null) {
        node.parentNode = parentNode.uid;
        node.uid = uid++;
    }
    if (node.length != null) {
        logger.error("Walking an Array!!!");
    }
    if (results == null) {
        results = [];
    }
    nodes.push(node);
    if (node.hasOwnProperty(attr)) {
        if (node[attr] === val) {
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
        if (e === 'uid') {
            continue;
        }
        if (e === 'parentNode') {
            continue;
        }
        if (node.hasOwnProperty(e)) {
            var child = node[e];
            if (child == null) {
                continue;
            }
            // // logger.log(child);
            if (typeof child === 'object' && child.length != null) {
                // array?
                // // logger.log(e + ': ' + '[]');
                for (var index = 0; index < child.length; index++) {
                    // logger.log(child);
                    var elem = child[index];
                    if (elem != null) {
                        walk(elem, attr, val, results, node);
                    }

                }
            } else if (typeof child === 'object') {
                child.parentNode = node;
                // obj?
                // // logger.log(e + ': ' + '{}'); //JSON.stringify(child));
                walk(child, attr, val, results, node);
            } else if (typeof child === 'string') {
                // string?
                // logger.log(e + ': ' + child);
            } else {
                // string?
                // logger.log(e + ': ' + typeof child);
            }
        }
    }
    return results;
}

function getNodeByUid(uid) {
    for (var index = 0; index < nodes.length; index++) {
        var node = nodes[index];
        if (node.uid === uid) {
            return node;
        }
    }
    // logger.log('getNodeByUid(' + uid + ') >>> null');
    return null;
}

function getNodesByType(ast, nodeType) {
    var results = walk(ast, 'type', nodeType);
    for (var index = 0; index < results.length; index++) {
        var node = results[index];
        var returnType = '';
        if (node.body != null) {
            var returnStatements = getNodesByType(node.body, 'ReturnStatement');
            if (returnStatements.length > 0) {
                if (returnStatements[0].argument != null) {
                    var statement = returnStatements[0].argument;
                    if (statement.type === 'Literal') {
                        if (statement.raw === 'null') {
                            returnType = '';
                        } else if (statement.raw === 'undefined') {
                            returnType = '';
                        } else {
                            returnType = '{' + (typeof statement.value) + '}';
                        }

                    } else if (statement.type === 'Identifier') {
                        returnType = '?';
                        if (statement.name != null) {

                            if (statement.name === 'null') {
                                returnType = '';
                            } else if (statement.name === 'undefined') {
                                returnType = '';
                            } else {
                                // returnType = statement.name;
                                // logger.warn('Cannot derive meaning from
                                // "return ' + statement.name + '".');
                                returnType = '?';
                            }

                        }
                    } else if (statement.type === 'CallExpression') {
                        returnType = '?';
                        if (statement.name != null) {
                            returnType = statement.name;
                        }
                    } else if (statement.type === 'LogicalExpression') {
                        returnType = '{boolean}';
                    } else if (statement.type === 'FunctionExpression') {
                        returnType = '{function}';
                    } else if (statement.type === 'BinaryExpression') {
                        returnType = '?';
                    } else if (statement.type === 'MemberExpression') {
                        returnType = '?';
                    } else if (statement.type === 'ObjectExpression') {
                        returnType = '?';
                    } else if (statement.type === 'ArrayExpression') {
                        returnType = '{array}';
                    } else {
                        // logger.warn(statement);
                        returnType = '';
                        if (statement.name != null) {
                            returnType = statement.name;
                        } else if (statement.type != null) {
                            returnType = statement.type;
                        } else {
                            logger.warn(statement);
                        }
                    }
                    // if (statement.name != null) {
                    // logger.warn(statement.type + ':' + statement.name + ':'
                    // + returnType);
                    // } else {
                    // logger.warn(statement.type + ':' + returnType);
                    // //logger.warn(statement);
                    // }
                } else {
                    returnType = '';
                }
            }
        }
        node.returnType = returnType;
        // if (returnType === 'undefined') {
        // logger.warn(statement);
        // }
        // logger.warn(returnType);
    }
    return results;
}

function getLineNumber(input, obj) {
    var range = obj.range;
    var corpus = input.substring(0, range[0]);
    // // logger.warn("XXX");
    // // logger.warn(corpus);
    // // logger.warn("YYY");
    var lineCount = corpus.split('\n').length;
    // var lines = input.split('\n');
    // // logger.warn(obj.type);
    // // logger.warn(lines[lineCount]);
    return lineCount;
}

function stripWhite(input) {
    input = input.replace(/^\s+|\s+$/g, '');
    return input.trim();
    // var output = [];
    // var index = 0;
    // for (index = 0; index<input.length; index++){
    //		
    // }
    // return output.join('');
}
/**
 * Return a single comment or null.
 * 
 * @param input
 * @param nodeStart
 * @param ast
 */
function getClosestComment(input, nodeStart, ast, wrapper) {
    // logger.log('getClosestComment');
    // logger.log(ast.comments);
    var endpoint = ast.comments.length - 1;
    // logger.log(endpoint);
    // todo: move to shared ref
    var lines = input.split('\n');
    for (var index = endpoint; index > -1; index--) {
        var comment = ast.comments[index];
        // logger.log(comment);
        if (comment.lineNumber != null) {
            // logger.log('getClosestComment found a comment already used!
            // skip and keep searching up...');
            continue;
        }
        var range = comment.range;
        var commentBody = input.substring(range[0], range[1]).trim();
        if (commentBody.indexOf('/**') === -1) {
            continue;
        }
        // var lineNumber = getLineNumber(input, comment);
        // comment.lineNumber = lineNumber;
        var commentEnd = range[1];
        if (nodeStart > commentEnd) {
            var corpus = (input.substring(commentEnd, nodeStart).trim());
            if (corpus.length === 0) {
                var lineNumber = getLineNumber(input, comment);

                // logger.log('getClosestComment() found ' + commentBody + '
                // for ' + wrapper.name);
                var block = getLines(lines, lineNumber - 1,
                        wrapper.lineNumber - 1);
                var funxChunx = block.split('function ');
                // logger.log(funxChunx.length);
                if (block.split('/**').length > 3 || funxChunx.length > 3) {
                    // logger.log('ALL THE TEXT FOR ' + wrapper.name + ':');
                    // logger.log(block);
                    return -1;
                }
                comment.lineNumber = lineNumber;
                return index;
            }
            // else{
            // logger.log('getClosestComment skipping over ' + corpus );
            // }
        }
    }
    // logger.log('>>>>> NO COMMENT for ' + wrapper.name);
    // // logger.log(nodeStart);
    return -1;
}
/**
 * getExistingComment must traverse from obj upwards through parent nodes
 * 
 * @param input
 * @param obj
 * @param ast
 * @param wrapper
 * @returns {Number}
 */
function getExistingComment(input, obj, ast, wrapper) {
    var astNodeType = obj.type;
    // logger.log('look for comment for ' + wrapper.name + ' in ' +
    // astNodeType);
    var range = obj.range;
    var rangeStart = range[0];
    // logger.log(obj);
    // logger.log('Calling getClosestComment() for ' + obj.name);
    // logger.log('Calling getClosestComment() for NODE ' + wrapper.name
    // + ' of type ' + astNodeType);
    var nearComment = getClosestComment(input, rangeStart, ast, wrapper);
    if (nearComment === -1 && obj.parentNode != -1) {
        var parentNode = getNodeByUid(obj.parentNode);
        astNodeType = parentNode.type;
        // logger.log('look for comment in ' + astNodeType);
        var range = parentNode.range;
        var rangeStart = range[0];
        // logger.log('Calling getClosestComment() for PARENT of '
        // + wrapper.name + ' of type ' + astNodeType);
        var nearComment = getClosestComment(input, rangeStart, ast, wrapper);
        if (nearComment === -1 && parentNode.parentNode != -1) {
            parentNode = getNodeByUid(parentNode.parentNode);
            if (parentNode == null) {
                logger.error("getExistingComment fatal error");
            }
            astNodeType = parentNode.type;
            // logger.log('look for comment in ' + astNodeType);
            if (astNodeType === 'FunctionExpression') {
                return -1;
            } else if (astNodeType === 'ObjectExpression') {
                return -1;
            }
            range = parentNode.range;
            rangeStart = range[0];
            // logger.log('Calling getClosestComment() for GRANDPARENT of '
            // + wrapper.name + ' of type ' + astNodeType);
            nearComment = getClosestComment(input, rangeStart, ast, wrapper);
        }
    }
    // if (nearComment !== -1) {
    // logger.log('getExistingComment() found... ' + nearComment);
    // }
    return nearComment;
}

function getFunctionFullName(input, obj) {
    // logger.log(obj.parentNode);
    var parentNode = getNodeByUid(obj.parentNode);
    // logger.log(parentNode);
    if (parentNode.type === 'Property') {
        // // logger.log('getFunctionFullName() working on a propery list of
        // functions, found "' + parentNode.key.name + '"');
        return parentNode.key.name;
    }
    if (parentNode.left) {
        var range = parentNode.left.range;
        return input.substring(range[0], range[1]);
    } else if (parentNode.id) {
        var range = parentNode.id.range;
        return input.substring(range[0], range[1]);
    }
    return "";
}

function dumpParams(params) {
    var output = [];
    for (var index = 0; index < params.length; index++) {
        output.push(params[index].name);
    }
    return output;
}

function unsquareName(input) {
    if (input.indexOf('[\'') !== -1) {
        input = input.split('[\'').join('.');
        input = input.split('\']').join('.');
    } else if (input.indexOf('["') !== -1) {
        input = input.split('["').join('.');
        input = input.split('"]').join('.');
    }
    if (input.charAt(input.length - 1) === '.') {
        input = input.split('');
        input.pop();
        input = input.join('');
    }
    return input;
}

function getParentClass(obj, classes) {
    // logger.log('getParentClass: ' + obj.range);
    for ( var e in classes) {
        if (classes.hasOwnProperty(e)) {
            var klass = classes[e];
            var classRange = klass.range;
            // logger.log('class range: ' + classRange);
            if (obj.range[0] >= classRange[0] && obj.range[1] <= classRange[1]) {
                // logger.log('found parent class');
                return klass;
            }
        }
    }
    return null;
}
/**
 * Need to include anonymous functions too?
 * 
 * @param input
 * @param map
 * @param ast
 * @param output
 * @returns {___anonymous45985_45990}
 */
function dumpNamedFunctions(walkerObj, map, ast, output) {
    var input = walkerObj.source;
    var lines = input.split('\n');
    var checkForReturnNode = true;
    if (output == null) {
        checkForReturnNode = true;
    }
    output = output != null ? output : {};
    output.classes = output.classes != null ? output.classes : {};
    output.methods = output.methods != null ? output.methods : {};
    // for ( var f in map) {
    for (var index = 0; index < map.length; index++) {
        // if (map.hasOwnProperty(f)) {
        if (true) {
            var obj = map[index];
            var functionWrapper = {
                name : '',
                todos : []
            };
            if (obj.id !== null) {
                // // logger.log("dumpNamedFunctions " + obj.id.name);
                functionWrapper.name = obj.id.name;
            } else {
                // logger.log(obj);
                // // logger.log(getFunctionFullName(input,obj));
                functionWrapper.name = getFunctionFullName(input, obj);
            }
            if (obj.params.length > 0) {
                // // logger.log(obj.params);
                functionWrapper.params = dumpParams(obj.params);
            }
            if (obj.returnType !== '') {
                // // logger.log(obj.returnType);
                functionWrapper.returnType = obj.returnType;
            }
            // if (index === 0 && walkerObj.preprocessed
            // && functionWrapper.name === '') {
            // logger.log(checkForReturnNode + ',' + walkerObj.preprocessed
            // + ',' + functionWrapper.name);
            // }
            if (index === 0 && checkForReturnNode && walkerObj.preprocessed
                    && functionWrapper.name === '') {
                // logger.log('is this the root AMD function?');
                var bodyNodes = obj.body.body;
                var returnNode = null;
                for (var n = 0; n < bodyNodes.length; n++) {
                    var node = bodyNodes[n];
                    if (node.type === 'ReturnStatement') {
                        // // logger.log(node);
                        if (node.argument
                                && node.argument.type === 'ObjectExpression') {
                            // it's returning a blob of crap instead of exports
                            returnNode = node;
                            break;
                        } else if (node.argument
                                && node.argument.type === 'FunctionExpression') {
                            // it's returning a blob of crap instead of exports
                            returnNode = node;
                            break;
                        }
                    }
                }
                if (returnNode) {
                    // logger.log(JSON.stringify(returnNode, null, 2));
                    // // logger.log(functionWrapper);
                    var rrange = returnNode.range;
                    var returnBody = input.substring(rrange[0], rrange[1])
                    // logger.log('returnNode = ' + returnBody);
                    // returnNode = return {
                    var textMinusReturn = returnBody.substring(6).trim();
                    var packagePath = walkerObj.path.split('/');
                    packagePath.shift();
                    packagePath = packagePath.join('/');
                    packagePath = packagePath.split('.js')[0];
                    var foundNode = false;
                    if (textMinusReturn.charAt(0) === '{') {
                        // logger.log('module "' + packagePath
                        // + '" has an object literal for its exports value');
                        // /**@alias
                        // module:js/component/myAccounts/depositAccounts*/
                        returnBody = 'return /**@alias module:' + packagePath
                                + ' */ ' + textMinusReturn;
                        // logger.log('returnBody = ' + returnBody);
                        foundNode = true;
                    } else if (returnNode.argument.id) {
                        var constructorName = returnNode.argument.id.name;
                        textMinusReturn = textMinusReturn
                                .split(constructorName).join(
                                        capitalize(constructorName));
                        logger.log('Renaming class to "'
                                + capitalize(constructorName) + '".');
                        returnBody = 'return /** @constructor */\n'
                                + textMinusReturn;
                        // logger.log('returnBody = ' + returnBody);
                        foundNode = true;
                    } else if (!returnNode.argument.id) {
                        console
                                .warn('Anonymous function is returned by module.');
                        // returnBody = 'return /** This module returns an
                        // anonymous function. */\n'
                        // + textMinusReturn;
                        //
                        // // logger.log('returnBody = ' + returnBody);
                        // foundNode = true;
                    }
                    if (foundNode) {
                        walkerObj.rewrittenReturnBody = returnBody;
                        walkerObj.rewrittenReturnBodyNode = returnNode;
                        var source = walkerObj.source;
                        var range = returnNode.range;
                        // var = input.substring(range[0], range[1]).trim();
                        var beginningOfFile = source.substring(0, range[0]);
                        // logger.log(beginningOfFile);
                        var endOfFile = source.substring(range[1]);
                        // logger.log(endOfFile);
                        // logger.log(returnBody);
                        walkerObj.source = beginningOfFile + returnBody
                                + endOfFile;
                        return "AMD_RETURN_BLOCK";
                    }
                }
            }
            // logger.log('Looking for comment for function "'
            // + functionWrapper.name + '"');
            // if (functionWrapper.comment != null){
            // logger.log('Found comment for function ' + functionWrapper.name
            // + ': ' + functionWrapper.comment);
            //
            // }
            // logger.log(functionWrapper);
            // if (functionWrapper.name === '') {
            // functionWrapper.name = '_' + obj.uid;
            // }
            var ctor = false;
            // "blue/reactive_view~this[ '_' + name ]": "@constructor",
            functionWrapper.memberOf = '';
            if (functionWrapper.name && functionWrapper.name !== '') {
                var firstChar = functionWrapper.name.charAt(0);
                if (!isAlpha(firstChar)) {
                    for (var ccc = 0; ccc < functionWrapper.name.length; ccc++) {
                        firstChar = functionWrapper.name.charAt(ccc);
                        if (isAlpha(firstChar)) {
                            break;
                        }
                    }
                }
                if (functionWrapper.name.indexOf('.') !== -1
                        || functionWrapper.name.indexOf(']') !== -1) {
                    functionWrapper.realName = functionWrapper.name;
                    functionWrapper.longName = unsquareName(functionWrapper.name);
                    var longSplit = functionWrapper.longName.split('.');
                    functionWrapper.name = longSplit.pop();
                    functionWrapper.memberOf = longSplit.join('.');
                    if (functionWrapper.memberOf !== 'this'
                            && (functionWrapper.memberOf.indexOf('.prototype') === -1)) {
                        // is it an inner?
                        functionWrapper.todos.push('MEMBEROF');
                    }
                    // console.warn('>>>>>>>> SQUARE >>>' +
                    // functionWrapper.name, functionWrapper);
                } else {

                    if (firstChar.toUpperCase() === firstChar) {
                        // Make it a constructor just 'cause it's uppacase?
                        // console.warn("Make it a constructor just 'cause it's
                        // uppacase? " + functionWrapper.name + '?');
                        if (functionWrapper.name === walkerObj.camelName) {
                            // Only if it's known to the real module name.
                            ctor = true;
                            // console.warn('Constructor for ' +
                            // walkerObj.camelName + '? ', functionWrapper);
                            functionWrapper.returnType = '';
                            output.classes[functionWrapper.name] = obj.uid;
                        }

                    }
                }

                functionWrapper.ctor = ctor;
                var lineNumber = getLineNumber(input, obj);
                functionWrapper.lineNumber = lineNumber;
                functionWrapper.line = trim(lines[lineNumber - 1]);
                functionWrapper.comment = -1;
                var comment = getExistingComment(input, obj, ast,
                        functionWrapper);
                if (comment != -1) {
                    functionWrapper.comment = comment;
                }
                if (functionWrapper.returnType === '?') {
                    functionWrapper.todos.push('RETURNWHAT');
                }
                functionWrapper.range = obj.range;
                output.methods[functionWrapper.name] = functionWrapper;

                // if (ctor){
                // console.warn('CONSTRUCTOR', functionWrapper);
                // }

                functionWrapper.name = null;
                delete functionWrapper.name;

            }
        }
    }
    return output;
}

/**
 * 
 * @param doclet
 * @param name
 * @return the tag
 */
function searchTags(doclet, name) {
    var tags = enumTags(doclet);
    // logger.log("searchTags");
    // logger.log(tags);
    if (tags == null) {
        // logger.log("searchTags found no tags");
        return null;
    }
    if (!tags.hasOwnProperty(name)) {
        return null;
    }
    var tagHash = tags[name];
    if (tagHash == null) {
        return null;
    }
    if (tagHash.join !== null) {
        // logger.log('found a collection of tags');
        return tagHash;
    } else {
        // logger.log('found a single tag');
        return tagHash;
    }
}

/**
 * 
 * @param doclet
 *            from parseDoclet()
 * @returns {Object} simple mapping of tags
 */
function enumTags(doclet) {
    var output = {};
    var tags = doclet.tags;
    // logger.log(tags);
    if (tags == null) {
        return output;
    }
    for (var i = 0; i < tags.length; i++) {
        var tag = tags[i];
        if (tag.tag === 'param') {
            var params = output.params;
            if (params == null) {
                params = [];
                output.params = params;
            }
            params.push(tag);
        } else if (tag.tag === 'requires') {
            var requires = output.requires;
            if (requires == null) {
                requires = [];
                output.requires = requires;
            }
            requires.push(tag);

        } else if (tag.tag === 'augments') {
            var augments = output.augments;
            if (augments == null) {
                augments = [];
                output.augments = augments;
            }
            augments.push(tag);
        } else if (tag.tag === 'lends') {
            var lends = output.lends;
            if (lends == null) {
                lends = [];
                output.lends = lends;
            }
            lends.push(tag);
        } else if (tag.tag === 'mixes') {
            var mixes = output.mixes;
            if (mixes == null) {
                mixes = [];
                output.mixes = mixes;
            }
            mixes.push(tag);
        } else if (tag.tag === 'borrows') {
            var borrows = output.borrows;
            if (borrows == null) {
                borrows = [];
                output.borrows = borrows;
            }
            borrows.push(tag);
        } else if (tag.tag === 'author') {
            var author = output.author;
            if (author == null) {
                author = [];
                output.author = author;
            }
            author.push(tag);
        } else {
            output[tag.tag] = tag;
        }

    }
    return output;
}

function getCommentWith(input, comments, whatTag) {
    // { type: 'Block',
    // value: '*\n * @module zero-test\n * @requires pruna\n ',
    // range: [ 2, 55 ] }

    for (var index = 0; index < comments.length; index++) {
        var comment = comments[index];

        var range = comment.range;
        // logger.log(comment);

        if (comment.type === 'Line') {
            continue;
        }

        var commentBody = input.substring(range[0], range[1]);

        if (commentBody.indexOf('/**') === -1) {
            continue;
        }

        comment.commentBody = commentBody;

        // logger.log(commentBody);

        if (commentBody.indexOf(whatTag) !== -1) {
            return comment;
        }
    }
    return null;
}

/**
 * 
 * @param message
 * @param error
 * @param errors
 * @returns {Array}
 */
function reportError(message, error, errors, walkerObj) {
    if (errors == null) {
        message = '';
    }
    if (errors == null) {
        errors = [];
    }
    if (error == null) {
        error = new Error();
        error.message = message;
    }
    if (walkerObj != null) {
        error.module = walkerObj;
    }
    error.description = message;
    errors.push(error);
    logger.warn(error);
    return errors;
}

var incompleteLends = null;
var spliceInlineConstructor = null;
/**
 * 
 * @param walkerObj
 * @param errors
 * @returns
 */
function addMissingComments(walkerObj, errors) {
    walkerObj.namedConstructors = {};
    if (errors == null) {
        errors = [];
    }
    if (walkerObj.checkForRequiresMismatch == null) {
        walkerObj.checkForRequiresMismatch = true;
    }
    walkerObj.preprocessed = false;
    logger.log('addMissingComments ' + walkerObj.path);
    // logger.log('addMissingComments ' + walkerObj.source);
    // logger.log(walkerObj.source);
    var beautify = require('js-beautify');
    var input = walkerObj.source;
    var _esprima = require('esprima');
    var ast = {};
    uid = 0;
    nodes = [];
    try {
        ast = _esprima.parse(input, {
            comment : true,
            tolerant : true,
            range : true,
            raw : true,
            tokens : true
        });
    } catch (esError) {
        reportError('ESPRIMA ERROR at top of addMissingComments', esError,
                errors, walkerObj);
        return 'ERROR';
    }

    var moduleName = 'module:' + walkerObj.results.amdProc.moduleName;
    // console.warn(moduleName);
    // exit;
    if (input.indexOf('@exports') !== -1) {
        // get the module name given there...
        var modChunk = input.split('@exports')[1];
        modChunk = modChunk.split('\n')[0].trim();

        moduleName = 'module:' + modChunk;
        console.warn('Infer module name from @exports definition.');
    } else if (input.indexOf('@module') !== -1) {
        // get the module name given there...
        var modChunk = input.split('@module')[1];
        modChunk = modChunk.split('\n')[0].trim();

        moduleName = 'module:' + modChunk;
        console.warn('Infer module name from @module definition.');
    } else {
        moduleName = 'module:' + walkerObj.results.amdProc.moduleName;
        console.warn('Infer module name from file or AMD definition.');
    }
    walkerObj.moduleName = moduleName;
    // console.warn('USE THIS AS THE MODULE NAME??? ' + moduleName);
    // console.warn('OR, USE THIS AS THE MODULE NAME??? module:' +
    // walkerObj.mappedModuleName);
    walkerObj.moduleName = walkerObj.mappedModuleName;
    // console.warn(walkerObj.moduleName);
    // exit
    var hasLends = getCommentWith(input, ast.comments, '@lends');
    if (hasLends != null && incompleteLends == null) {

        // { type: 'Block',
        // value: '* @lends module:mvc/mav ',
        // range: [ 426, 454 ],
        // commentBody: '/** @lends module:mvc/mav */' }

        if (hasLends.value.indexOf('module:') !== -1) {
            if (hasLends.value.indexOf('~') === -1) {
                logger.warn('@lends used with a Module but not with a Class.');
                logger.warn(hasLends);
                incompleteLends = hasLends;
            }
        }

    }

    // logger.log(ast.comments);

    // TODO: patch the @exports or @module @requires tags and re-parse the
    // source!!!
    var nodeWithRequiresBlock = null;
    if (walkerObj.checkForRequiresMismatch) {
        console
                .log('Scanning the @requires tag to see if it matches inline require() invocations.');
        var hasModule = getCommentWith(input, ast.comments, '@module');
        var hasExports = getCommentWith(input, ast.comments, '@exports');

        if (hasExports != null) {
            logger.log('Found @exports.');
            nodeWithRequiresBlock = hasExports;
        } else if (hasModule != null) {
            logger.log('Did not find @exports but found @module.');
            nodeWithRequiresBlock = hasModule;
        }

        if (nodeWithRequiresBlock != null) {
            // var doclet = parseDoclet(walkerObj,
            // nodeWithRequiresBlock.commentBody,
            // false, '', 0, null);

            var statusCheck = {
                merge : false
            };
            var newComment = generateComment(null, ast, walkerObj, input,
                    nodeWithRequiresBlock, statusCheck);

            // logger.warn(walkerObj.source);

            // logger.warn("AST comment node we need to edit:");
            // logger.warn(nodeWithRequiresBlock);
            // logger.warn("Replace with new doclet:");
            // logger.warn(newComment);
            // logger.warn(walkerObj.results.amdProc.requires);

            if (statusCheck.merge) {
                // logger.warn("AST comment node we need to edit:");
                // logger.warn(nodeWithRequiresBlock);
                // logger.warn("Replace with new doclet:");
                // logger.warn(newComment);
                var head = walkerObj.source.substring(0,
                        nodeWithRequiresBlock.range[0] - 1);
                // logger.warn('head: ' + head);
                var tail = walkerObj.source
                        .substring(nodeWithRequiresBlock.range[1] + 1);
                // logger.warn('tail: ' + tail);
                walkerObj.source = (head + newComment + tail);
                // logger.warn(walkerObj.source);
                // Reboot!
                logger.log('>>>>> Need to rewrite requires on '
                        + walkerObj.name + '.');
                walkerObj.checkForRequiresMismatch = false;

                return addMissingComments(walkerObj, errors);

            } else {
                logger.log('No need to rewrite requires on ' + walkerObj.name
                        + '.');
            }

        }
    }

    // writeFile("dump.json", JSON.stringify(ast, null, 2));
    var moduleAtTop = input.indexOf('@exports') === -1;
    var defineModuleInTopOfFile = moduleAtTop;
    var newFile = '';
    var cursor = 0;
    var functionExpressions = getNodesByType(ast, 'FunctionExpression');
    var functionDeclarations = getNodesByType(ast, 'FunctionDeclaration');
    var expressionFunctions = dumpNamedFunctions(walkerObj,
            functionExpressions, ast);
    var allMethods = dumpNamedFunctions(walkerObj, functionDeclarations, ast,
            expressionFunctions);
    var methods = allMethods.methods;
    // // logger.warn(JSON.stringify(methods, null, 2));
    var methodArray = [];
    for ( var m in methods) {
        if (methods.hasOwnProperty(m)) {
            var method = methods[m];
            method.name = m;
            methodArray.push(method);
        }
    }
    // Sort by range to ensure correct playback.
    methodArray = methodArray.sort(function compare(a, b) {
        if (a.range[0] < b.range[0]) {
            return -1;
        } else if (a.range[0] > b.range[0]) {
            return 1;
        }
        return 0;
    });
    // todo: replace code below
    // logger.log(JSON.stringify(methodArray, null, 2));
    var lines = input.split('\n');
    // logger.warn(lines);
    // method knows it's comment, so should know comment's range
    var newFileLines = [];
    var rewriteLines = true;
    // logger.warn(input);
    for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        var line = lines[lineIndex];
        // logger.warn(lineIndex + ' --> ' + line);
        var trimLine = line.trim();
        // || trimLine.indexOf('/*') === 0
        if (trimLine.indexOf('//') === 0 || trimLine.length === 0) {
            newFileLines.push(line);
            continue;
        }
        var method = getMethodOnLine(methodArray, lineIndex + 1, ast, input);
        if (rewriteLines) {
            if (method != null && method.comment === -1) {
                // logger.warn(lineIndex + ',' + method.name);
                var newComment = generateComment(method, ast, walkerObj, input);
                method.jsDoc = newComment;
                newFileLines.push(newComment);
                newFileLines.push(line);
            } else if (method != null && method.comment !== -1) {
                // logger.warn(lineIndex + ',' + method.name);
                var newComment = generateComment(method, ast, walkerObj, input);
                method.jsDoc = newComment;
                // logger.warn(method.name + " >>>" + method.comment);
                // logger.warn(method.name + " >>>" + newComment);
                newFileLines.push(newComment);
                // advance line counter to skip over legacy comments
                lineIndex = method.lineNumber - 1;
                line = lines[lineIndex];
                newFileLines.push(line);
            } else {
                // logger.warn(lineIndex + ',' + line);
                newFileLines.push(line);
            }
        } else {
            newFileLines.push(line);
        }

    }
    newFile = newFileLines.join('\n');
    // logger.warn(newFile);
    newFile = beautify(newFile, {
        'indent_size' : 2,
        'indent_char' : ' ',
        'indent_level' : 0,
        'indent_with_tabs' : false,
        'preserve_newlines' : true,
        'max_preserve_newlines' : 1,
        'jslint_happy' : true,
        'brace_style' : 'collapse',
        'keep_array_indentation' : false,
        'keep_function_indentation' : false,
        'space_before_conditional' : true,
        'break_chained_methods' : false,
        'eval_code' : false,
        'unescape_strings' : false,
        'wrap_line_length' : 200
    });
    if (!walkerObj.preprocessed) {
        logger.warn("checking... re-written code");
        walkerObj.source = newFile;
        walkerObj.preprocessed = true;
        try {
            ast = _esprima.parse(walkerObj.source, {
                comment : true,
                tolerant : true,
                range : true,
                raw : true,
                tokens : true
            });
        } catch (esError) {
            
            writeFile(walkerObj.processedFilePath, walkerObj.source);
            
            reportError('ESPRIMA ERROR 2nd time parse in addMissingComments',
                    esError, errors, walkerObj);
            ex();
            return 'ERROR';
        }
        functionExpressions = getNodesByType(ast, 'FunctionExpression');
        functionDeclarations = getNodesByType(ast, 'FunctionDeclaration');
        var check = expressionFunctions = dumpNamedFunctions(walkerObj,
                functionExpressions, ast);
        if (check === 'AMD_RETURN_BLOCK') {
            // logger.warn("Found the stuff.");
            newFile = walkerObj.source;
        }
    }
    if (walkerObj.source.indexOf('@typedef') !== -1) {
        newFile = walkerObj.source;
        logger.warn('SKIPPING FILE ' + walkerObj.name
                + ' because it\'s got @typedef');
        walkerObj.skip = true;
    }

    var outputArray = [];
    // TODO: build a mockup of jsDoccer data.
    var builtPath = walkerObj.folderPath + _path.sep + walkerObj.fileName;
    var fileNamePath = _fs.realpathSync(builtPath);
    var dir = _path.dirname(fileNamePath);
    var fileNameOnly = _path.basename(fileNamePath);
    var fileNameMinusExt = fileNameOnly.split('.')[0];
    // base path is full path minus local path...
    var basePath = _path.normalize(fileNamePath.split(walkerObj.fileName)[0]);
    var splitPath = basePath.split(_path.sep);
    if (splitPath[splitPath.length - 1] === '') {
        splitPath.pop();
        basePath = splitPath.join(_path.sep);
    }
    // // logger.warn(dir);
    // // logger.warn(fileNameOnly);
    var wrappedMethods = [];
    for (var meth = 0; meth < methodArray.length; meth++) {
        var realMethod = methodArray[meth];
        // {
        // todos: ['RETURNWHAT'],
        // returnType: '?',
        // comment: -1,
        // memberOf: 'this',
        // realName: 'this.chewBakka',
        // longName: 'this.chewBakka',
        // ctor: false,
        // lineNumber: 8,
        // line: 'this.chewBakka = function() {',
        // range: [175, 278],
        // name: 'chewBakka'
        // }
        // logger.log(realMethod);
        var visibility = 'public';
        var staticScope = false;
        var docletNode = realMethod.doclet;
        if (!docletNode) {
            logger.error(new Error(
                    'Method in addMissingComments() lacks a doclet: '
                            + realMethod.name));
            continue;
        }
        var description = '';
        var preamble = '';
        if (docletNode.preamble) {
            preamble = docletNode.preamble;
        }
        if (docletNode.freeText) {
            description = docletNode.freeText;
        }
        var originalJsDocDescription = {};
        if (docletNode.tags) {
            var desc = searchTags(docletNode, 'description');
            originalJsDocDescription = enumTags(docletNode);
            if (desc != null) {
                description = desc.text;
            }
        }
        if (preamble != description) {
            // logger.warn(docletNode);
            if (preamble.length > 0) {
                description = preamble + '\n' + description;
            }
        }

        // logger.warn(docletNode.tags);
        var doclet = realMethod.jsDoc != null ? realMethod.jsDoc : '';

        wrappedMethods.push({
            "name" : realMethod.name,
            "visibility" : visibility,
            "static" : staticScope,
            "lineNumber" : realMethod.lineNumber,
            "memberOf" : realMethod.memberOf,
            "doclet" : doclet,
            "args" : realMethod.params,
            "description" : description,
            // "preamble" : preamble,
            "return" : realMethod.returnType,
            "classDeclarationFlag" : realMethod.ctor,
            "line" : realMethod.line,
            'originalJsDocDescription' : originalJsDocDescription
        });
    }

    if (incompleteLends != null && incompleteLends.possibleClassName != null) {
        var lendsPath = incompleteLends.value.trim();
        if (lendsPath.charAt(lendsPath.length - 1) === '#') {
            lendsPath = lendsPath.substring(0, lendsPath.length - 1);
            logger.log('removed hash: ' + lendsPath);
            // lendsPath += '~' + incompleteLends.possibleClassName + '#';
            lendsPath += '~' + incompleteLends.possibleClassName;
        } else {
            lendsPath += '~' + incompleteLends.possibleClassName;
        }

        // always add this for classes when using @lends
        lendsPath += '#';

        // logger.warn(incompleteLends);

        // incompleteLends.value.trim() + '~' +
        // incompleteLends.possibleClassName
        logger.warn('Added class to @lends: ' + lendsPath);
        newFile = newFile.split(incompleteLends.value).join(lendsPath);
        incompleteLends = null;
    }

    if (spliceInlineConstructor != null) {
        var ctorName = spliceInlineConstructor.name;
        // add module

        var ctorLine = spliceInlineConstructor.line;
        if (ctorLine.indexOf('(') !== -1) {
            ctorLine = ctorLine.split('(')[0];
        }

        // logger.warn("SPLICE IN CONSTRUCTOR TAG for " + ctorName);

        if (newFile.indexOf(ctorLine) !== -1) {
            var where = ctorLine.indexOf(':');
            var fixedCtorLine = ctorLine.substring(0, where + 1);
            fixedCtorLine += ' /** @constructor ' + ctorName + ' */';
            fixedCtorLine += ctorLine.substring(where + 1);
            // logger.warn("SPLICE IN CONSTRUCTOR TAG: " + fixedCtorLine);
            var ctorSimple = '@constructor ' + ctorName;
            if (newFile.indexOf(ctorSimple) !== -1) {
                newFile = newFile
                        .split(ctorSimple)
                        .join(
                                '@fixme: do not use the constructor tag unless it precedes directly a constructor function');
            }

            // newFile = newFile.split(ctorLine).join(fixedCtorLine);
            // logger.warn(newFile);

        } else {
            logger.log("SPLICE IN CONSTRUCTOR TAG for " + ctorName);
            logger.log('COULD NOT FIND ' + ctorLine);
        }
        spliceInlineConstructor = null;

    }

    var jsDoccerBlob = {
        "lines" : lines.length,
        "requires" : [],
        "className" : "n/a",
        "packagePath" : "",
        "directoryPath" : dir,
        "uses_Y" : false,
        "no_lib" : true,
        "inferencedClassName" : "n/a",
        "uses_$" : false,
        "chars" : input.length,
        "uses_YUI" : false,
        "fields" : [],
        "moduleName" : _path.dirname(walkerObj.fileName) + '/'
                + fileNameMinusExt,
        "uses_console_log" : false,
        "uses_backbone" : false,
        "classes" : allMethods.classes,
        "methods" : wrappedMethods,
        "is_module" : false,
        "uses_alert" : false,
        "uses_y_log" : false,
        "requiresRaw" : [],
        "basePath" : basePath,
        "fileName" : fileNameOnly,
        "strict" : false
    };
    outputArray.push(JSON.stringify(jsDoccerBlob, null, 2));
    outputArray.push(newFile);
    // logger.log(newFile);
    outputArray.push('');
    logger.log('done ' + walkerObj.name);
    // console.warn('Named constructors! ', JSON.stringify(
    // walkerObj.namedConstructors, null, 2));
    return outputArray.join('\n/*jsdoc_prep_data*/\n');
}
/**
 * This method scans the raw list of esprima comments. Note: some comments
 * should be ignored, so unless we use the same skip test everywhere, the
 * comments offsets could be wrong.
 * 
 * @param methodArray
 * @param lineNumber
 * @param ast
 * @return our own method object derived from ast method node
 */
function getMethodOnLine(methodArray, lineNumber, ast, input) {
    for (var m = 0; m < methodArray.length; m++) {
        var method = methodArray[m];
        // TODO: check comment line number, too!!
        if (method.comment !== -1) {
            var comment = ast.comments[method.comment];
            var commentBody = input.substring(comment.range[0],
                    comment.range[1]).trim();
            if (commentBody.indexOf('/**') === -1) {
                // logger.log('SKIPPING COMMENT ' + commentBody);
                continue;
            }
            // test for line type is redundant to above test
            if (comment.type.toLowerCase() === 'line') {
                // logger.log('SKIPPING LINE COMMENT');
                continue;
            }

            if (lineNumber === comment.lineNumber) {

                // @WARNING this is only true if the method is on the next
                // non-comment/non-whitespace line after this comment!!!

                // logger.log("Found ORIGINAL comment on line " + lineNumber
                // + ". " + method.name);

                method.commentBody = commentBody;
                method.oldComment = comment;
                // logger.log(method);
                return method;
            }
        }
        if (lineNumber === method.lineNumber) {
            // logger.log("Found A METHOD, but NO COMMENT on line " +
            // lineNumber
            // + ". " + method.name);
            // logger.log(method);
            return method;
        }
    }
    // logger.log("Could not find a method on line " + lineNumber + ".");
    return null;
}

/**
 * Combine physical/logical requires so doclet will print with all.
 * 
 * @param doclet
 */
function mergeRequires(doclet) {
    // logger.log(doclet);
    var needToMerge = false;
    var allRequires = searchTags(doclet, 'requires');

    if (allRequires == null) {
        allRequires = [];
    }
    // logger.log(allRequires);

    var requiresList = doclet.requiresList;
    if (requiresList == null) {
        requiresList = [];
    }
    // logger.log(requiresList);

    var diffRequires = getValuesNotInTags(allRequires, requiresList);

    if (diffRequires.length > 0) {

        // logger.log(diffRequires);
        // logger.log('These require modules were not included: '
        // + diffRequires.toString());
        // // put any items in requiresList after allRequires if they are not
        // already
        // listed
        var line = 1;
        var lastLine = 1;

        if (allRequires.length > 0) {
            var lastTag = allRequires[allRequires.length - 1];
            // logger.log("LAST TAG:");
            // logger.log(lastTag);
            line = lastTag.line + 1;
            lastLine = lastTag.lastLine + 1;
            lastTag.text = lastTag.text.trim();
        }

        for (var i = 0; i < diffRequires.length; i++) {
            var diffRequire = diffRequires[i];
            var newTag = {
                tag : 'requires',
                line : line,
                lastLine : lastLine,
                textStartsOnSameLine : true,
                text : diffRequire
            };
            line++;
            lastLine++;
            // logger.log(newTag);
            doclet.tags.push(newTag);
            needToMerge = true;
        }
    }
    return needToMerge;
}

/**
 * 
 * @param tagList
 * @param valueList
 * @returns {Array}
 */
function getValuesNotInTags(tagList, valueList) {
    var output = [];
    var textValues = getTextFromTags(tagList);
    // logger.log(textValues);
    for (var i = 0; i < valueList.length; i++) {
        var value = valueList[i];
        if (textValues.indexOf(value) === -1) {
            output.push(value);
        }
    }
    return output;
}

/**
 * 
 * @param tagList
 * @returns {Array}
 */
function getTextFromTags(tagList) {
    var output = [];
    for (var i = 0; i < tagList.length; i++) {
        output.push(tagList[i].text.trim());
    }
    return output;
}

/**
 * Generate a new comment, or fix an existing one.
 * 
 * @param functionWrapper
 * @param ast
 * @param walkerObj
 * @param input
 * @returns
 */
function generateComment(functionWrapper, ast, walkerObj, input,
        commentBodyOpt, statusCheck) {
    var funkyName = '';
    var doclet = null;
    var tags = [];
    var oldComment = null;
    if (statusCheck == null) {
        statusCheck = {};
    }
    statusCheck.merge = false;
    if (functionWrapper != null) {
        funkyName = decamelize(functionWrapper.name);
        funkyName = funkyName.split('_');
        funkyName[0] = capitalize(funkyName[0]);
        funkyName = funkyName.join(' ');
        funkyName += '.';
        // logger.log(funkyName);
        if (functionWrapper.ctor) {
            funkyName = 'Creates a new instance of class '
                    + functionWrapper.name + '.';
        }
        if (funkyName.indexOf('[') !== -1) {
            funkyName = '';
        }
        if (funkyName.indexOf('.') !== -1) {
            funkyName = '';
        }
        if (functionWrapper.comment !== -1) {
            oldComment = ast.comments[functionWrapper.comment];
            var range = oldComment.range;
            var commentBody = input.substring(range[0], range[1]).trim();
            if (commentBody.indexOf('/**') !== -1) {
                var commentText = commentBody;
                // logger.log(commentText);
                doclet = parseDoclet(walkerObj, commentText, false, '', 0,
                        functionWrapper);
                functionWrapper.oldComment = oldComment;
                // logger.log(doclet);
            }
        }
    } else {
        commentText = commentBodyOpt.commentBody;
        functionWrapper = {};
        doclet = parseDoclet(walkerObj, commentText, false, '', 0,
                functionWrapper);
        // logger.log(doclet);
        if (mergeRequires(doclet)) {

            console
                    .warn("Requires list needs to be re-printed. Start parse over now.");
            // logger.log(doclet);
            statusCheck.merge = true;
        }

    }

    // // logger.log(funkyName + ' << ' + functionWrapper.name);

    if (doclet != null && doclet.tags) {
        // logger.log(doclet.tags);
        tags = doclet.tags;
    }

    var hasConstructsTag = null;
    var hasConstructorTag = null;
    var hasLendsTag = null;

    // TODO: Rewrite this to dump the tags in the original order they were
    // declared.
    var commentBlock = [];
    commentBlock.push("/**");
    if (doclet != null) {

        hasConstructsTag = searchTags(doclet, 'constructs');
        hasConstructorTag = searchTags(doclet, 'constructor');
        hasLendsTag = searchTags(doclet, 'lends');

        // if (hasConstructorTag) {
        // console.warn('hasConstructorTag: ' +
        // JSON.stringify(hasConstructorTag));
        // }

        if (doclet.freeText && doclet.freeText != '') {
            // logger.log(doclet.freeText);
            // commentBlock.push(' * ' + doclet.freeText);
            var freeText = doclet.freeText.trim();
            freeText = addStarLines(freeText, {});
            commentBlock.push(freeText);
        }

        // this loop skips over tags of type @return and @param... they get done
        // later
        for (var tIndex = 0; tIndex < tags.length; tIndex++) {
            var newTag = tags[tIndex];
            var t = '@' + newTag.tag;

            if (t !== '@return' && t !== '@param') {
                var tag = doclet[t];
                
                if (hasConstructsTag === newTag) {

                    var text = hasConstructsTag.text.trim();

                    if (text.indexOf(functionWrapper.name) === -1) {
                        console
                                .warn('>>>>>>>>>> @constructs pathname lacks class? '
                                        + text + '~' + functionWrapper.name);
                        hasConstructsTag.text = text + '~'
                                + functionWrapper.name;
                        if (incompleteLends != null) {
                            incompleteLends.possibleClassName = functionWrapper.name;
                        }
                    }
                }

                // logger.log(tag);
                if (typeof tag === 'object') {
                    
                    // {
                    // tagName: 'return',
                    // type: '{String}',
                    // description: ' ',
                    // line: '@return {String}'
                    // }
                    // construct doclet tag
                    // logger.log(tag);
                    commentBlock.push(' * ' + tag.line);
                } else {
                    
                    // construct doclet tag
                    // logger.log('JUST TEXT >>> ' +
                    // JSON.stringify(newTag));
                    // addStarLines(newTag.text, newTag));
                    // logger.log(doclet);
                    var newComment = '';
                    //console.warn(newTag);
                    if (newTag.text.trim().length > 0) {
                        var textOfTag = newTag.text.trim();
                        if (textOfTag.indexOf('module:') === 0) {
                            //console.warn('CHANGING ' + textOfTag);
                            newTag.text = fixModuleNameInText(textOfTag,
                                    walkerObj);
                            //console.warn('...TO:  ' + newTag.text);
                        }

                        newComment = ' * ' + t + ' '
                                + addStarLines(newTag.text, newTag);
                        commentBlock.push(newComment);
                    } else {
                        newComment = ' * ' + t;
                        commentBlock.push(newComment);
                    }

                }
            }
            // }
            // }
        }
    } else {
        doclet = {
            params : [],
            returnValue : ''
        };
        // logger.warn('Non-tag lines: ' + funkyName);
        if (funkyName.trim().length > 0) {
            commentBlock.push(' * ' + funkyName);
        }

    }
    var params = functionWrapper.params;
    if (params == null) {
        params = [];
    }
    var returnValue = functionWrapper.returnType;
    if (returnValue == null) {
        returnValue = '';
    }
    var ctor = functionWrapper.ctor;

    if (ctor && (incompleteLends != null)) {
        if (incompleteLends.possibleClassName == null) {
            console
                    .warn('>>>>>>>>>> Guess: does the @lends tag point to this class? '
                            + functionWrapper.name);
            incompleteLends.possibleClassName = functionWrapper.name;
        }
    }
    var moduleName = walkerObj.mappedModuleName;
    if (ctor && hasConstructorTag == null && hasConstructsTag == null) {

        // line: 'constructor: function ControllerRegistry(){',
        // name: 'ControllerRegistry'

        if (incompleteLends != null
                && incompleteLends.possibleClassName === functionWrapper.name) {
            var justPath = incompleteLends.value;
            if (justPath.indexOf('module:') !== -1) {
                // value: '* @lends module:blue/validate/validator# ',
                justPath = justPath.split('module:')[1];
                justPath = justPath.split('#').join('');
                justPath = justPath.trim();
                if (justPath.indexOf(functionWrapper.name) === -1) {
                    justPath += '~' + functionWrapper.name;
                }
                justPath = 'module:' + justPath;

                incompleteLends.fullClassName = justPath;

                // var prefix = incompleteLends.value.split('module:')[0];
                // incompleteLends.value = prefix + justPath;
                console.warn("!!! Add full path to constructor? "
                        + incompleteLends.fullClassName);
            }

        }

        console
                .warn('Constructor FOUND, and we have not already declared it in @constructor or @constructs.');

        if (functionWrapper.line.indexOf('constructor: function') !== -1) {
            console
                    .warn("Constructor, but it's to the RIGHT of \"constructor:\"");
            // console.warn(' "' + functionWrapper.line + '"');

            if (incompleteLends != null
                    && incompleteLends.fullClassName != null) {
                if (walkerObj.namedConstructors[incompleteLends.fullClassName] == null) {
                    functionWrapper.ctorType = '@constructs';
                    walkerObj.namedConstructors[incompleteLends.fullClassName] = functionWrapper;
                    commentBlock.push(' * @constructs '
                            + incompleteLends.fullClassName);
                    console.warn(' * @constructs '
                            + incompleteLends.fullClassName);
                } else {
                    console
                            .warn('Constructor for '
                                    + incompleteLends.fullClassName
                                    + ' already found, so not adding extra @constructs tag');
                }
                // TODO: is this right?
                incompleteLends.fullClassName = null;
                delete incompleteLends.fullClassName;
            } else {
                // logger.log(walkerObj.results.amdProc.moduleName);
                var constructsMarkup = ' * @constructs ' + moduleName + '~'
                        + functionWrapper.name;

                if (walkerObj.namedConstructors[moduleName + '~'
                        + functionWrapper.name] == null) {
                    functionWrapper.ctorType = '@constructs';
                    walkerObj.namedConstructors[moduleName + '~'
                            + functionWrapper.name] = functionWrapper;
                    console.warn('ZZZZZZZZZZZ ' + constructsMarkup);
                    // FIXME: don't add @constructs if @constructor or @class is
                    // already named
                    commentBlock.push(constructsMarkup);
                } else {
                    console
                            .warn('Constructor for '
                                    + moduleName
                                    + '~'
                                    + functionWrapper.name
                                    + ' already found, so not adding extra @constructs tag');
                }
            }

            spliceInlineConstructor = functionWrapper;
        } else {
            var context = functionWrapper.line;
            if (context.indexOf('=') !== -1) {
                context = context.split('=')[0].trim();
            } else if (context.indexOf(':') !== -1) {
                context = context.split(':')[0].trim();
            } else {
                context = functionWrapper.name;
            }
            console.warn('What is left of this "constructor" ? ' + context);
            if (walkerObj.namedConstructors[moduleName + '~' + context] == null) {
                commentBlock.push(' * @constructor');
                functionWrapper.ctorType = '@constructor';
                walkerObj.namedConstructors[moduleName + '~' + context] = functionWrapper;
            } else {
                console.warn('Constructor for ' + moduleName + '~' + context
                        + ' already found.');
            }

        }

        // commentBlock.push(' * @constructor');
        // logger.log(functionWrapper);

    } else if (ctor && (hasConstructorTag != null || hasConstructsTag != null)) {
        functionWrapper.ctorType = '@constructor';
        walkerObj.namedConstructors[moduleName + '~' + functionWrapper.name] = functionWrapper;
    }

    // if (hasConstructorTag != null){
    // logger.log(hasConstructorTag);
    // }

    functionWrapper.doclet = doclet;
    // param tags
    if (doclet.params.length > 0) {
        for (var index = 0; index < doclet.params.length; index++) {
            var param = doclet.params[index];
            var paramLine = ' * @param';
            if (param.type !== '') {
                paramLine += ' ' + param.type;
            }
            // better be something!
            if (param.name !== '') {
                paramLine += ' ' + param.name;
            }
            if (param.description !== '') {
                paramLine += ' ' + param.description;
            }
            commentBlock.push(paramLine);
        }
    } else if (params.length > 0) {
        for (var index = 0; index < params.length; index++) {
            commentBlock.push(' * @param ' + params[index]);
        }
    }
    if (doclet['@return'] != null) {
        commentBlock.push(' * ' + doclet['@return'].line.trim());
    } else if (returnValue !== '') {
        if (returnValue !== '?') {
            commentBlock.push(' * @return ' + returnValue);
        } else {
            commentBlock
                    .push(' * @todo Please describe the return type of this method.');
            commentBlock.push(' * @return {object} ??');
        }
    }
    if (commentBlock.length === 1) {
        commentBlock.push(' * @todo Add some jsDoc comments here!');
    }
    commentBlock.push(" */");
    return commentBlock.join('\n');
}

function isAlpha(input) {
    return (input >= 'a' && input <= 'z\uffff')
            || (input >= 'A' && input <= 'Z\uffff');
}

function isDigit(input) {
    return (input >= '0' && input <= '9');
}

module.exports = {
    'addMissingComments' : addMissingComments
};
if (false) {
    var testFileName = 'index.js';
    var input = {
        name : getModuleName(testFileName),
        source : '',
        fileName : testFileName,
        folderPath : 'test-source',
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
    var source = readFile(input.folderPath + _path.sep + testFileName);
    input.source = source;
    // logger.log(input);
    var testResult = addMissingComments(input);
    testResult = testResult.split('/*jsdoc_prep_data*/')[1];
    // logger.log(testResult);
    writeFile('test-output' + _path.sep + testFileName, testResult);
}