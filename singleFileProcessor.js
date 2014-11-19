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
var newJsDoccerEngine = require('./jsdoccer');
var parseDoclet = docletEngine.parseDoclet;
var printDoclet = docletEngine.printDoclet;
var addMissingComments = newJsDoccerEngine.addMissingComments;
var headerProc = {
    id: 'headerProc',
    type: 'processor',
    description: 'SAMPLE: Adds a bogus header to the file.',
    process: function (input, doneCallback) {
        input.source = '// Copyright 1987 Robot Donkey, Inc.' + '\n\n' + input.source;
        doneCallback(input);
    }
};
var uglifyProc = {
    id: 'uglifyProc',
    type: 'processor',
    description: 'Calls uglify2 on the content.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var fixJSDocFormattingResult = input.source;
        try {
            fixJSDocFormattingResult = docletEngine.fixDoclets(input);
        } catch (exxxx) {}
        input.source = fixJSDocFormattingResult;
        writeFile(input.processedFilePath, input.source);
        doneCallback(input);
    }
};

function createJavaClass(input, amdProcData) {
    var exportPath = 'statebaster\\src\\storefront\\modules\\';
    var classFileName = input.camelName + '.java';
    var packageSubpath = amdProcData.webPath;
    var subPackage = packageSubpath.split('/')
        .join('.');
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
}
var generateJavaProc = {
    id: 'generateJavaProc',
    type: 'processor',
    description: 'Writes a fake Java class for each module.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
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
    process: function (input, doneCallback) {
        if (input.results[this.id] == null) {
            input.results[this.id] = {};
        }
        var result = input.results[this.id];
        result.requires = [];
        result.moduleName = input.name;
        result.AMD = false;
        result.webPath = input.webPath;
        // AMD_DATA.paths[result.moduleName] = 'v2' + result.webPath
        // + '/' +
        // result.moduleName;
        var converted = convert(input.source, input.path);
        // console.warn(converted);
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
                    temp = temp.split('\'')
                        .join('');
                    result.push(trim(temp));
                }
                return result;
            }
        //console.warn(converted.requires);
        result.requires = fixRequires(converted.requires);
        //console.warn(result.requires);
        var inlineRequires = fixRequires(getInlineRequires(input));
        for (var ir = 0; ir < inlineRequires.length; ir++) {
            var inlineModule = inlineRequires[ir];
            result.requires.push(inlineModule);
            //console.warn('require("' + inlineModule + '")');
        }
        result.moduleName = converted.name;
        result.AMD = converted.isModule;
        
        result.min = converted.min;
        result.main = converted.isMain;
        result.uses_$ = input.source.indexOf('$(') !== -1;
        result.uses_Y = converted.callsYuiApi;
        // FIXME: BUGGY
        result.uses_alert = input.source.indexOf('alert(') !== -1;
        // FIXME: BUGGY
        result.strict = input.source.indexOf('use strict') !== -1; 

            
        
        doneCallback(input);
    }
};

function getInlineRequires(input) {
    var source = input.source;
    var noSpaceRequire = source.indexOf("require(");
    var oneSpaceRequire = source.indexOf("require (");
    if (noSpaceRequire === -1 && oneSpaceRequire === -1) {
        return [];
    }
    var output = [];
    // console.warn('dig for inline requires() in ' + input.name);
    var chunks = [];
    if (noSpaceRequire > -1) {
        chunks = source.split("require(");
        // console.warn(chunks.length);
        for (var index = 1; index < chunks.length; index++) {
            var chunk = chunks[index];
            var trimChunk = chunk.trim();
            // console.warn(trimChunk);
            var startChar = trimChunk.charAt(0);
            var splitter = trimChunk.split(startChar);
            var moduleName = splitter[1].trim();
            // console.warn(moduleName);
            output.push(moduleName);
        }
    } else if (oneSpaceRequire > -1) {
        chunks = source.split("require (");
        // console.warn(chunks.length);
        for (var index = 1; index < chunks.length; index++) {
            var chunk = chunks[index];
            var trimChunk = chunk.trim();
            // console.warn(trimChunk);
            var startChar = trimChunk.charAt(0);
            var splitter = trimChunk.split(startChar);
            var moduleName = splitter[1].trim();
            // console.warn(moduleName);
            output.push(moduleName);
        }
    }
    return output;
}

function genDoc(fileName, callBackDone) {
    var jsdog = require('jsdog');
    var util = require('util');
    var fs = require('fs');
    var jade = require('jade');
    var jsdog = require('jsdog');
    var nopt = require('nopt');
    var Stream = require('stream')
        .Stream;
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
        },
        shortOpts = {
            's': '--source',
            't': '--tests',
            'm': '--template',
            'n': '--title',
            'v': ['--loglevel', '2'],
            'h': '--help',
            'w': '--wrap',
            'i': '--ignore'
        };
    var parsed = {
        'source': fileName
    };
    var jadeOpts = {},
        filename = parsed.source,
        qunitTestFile = parsed.tests ? fs
        .readFileSync(parsed.tests) + '' : '',
        templateFile = parsed.template ? parsed.template : path
        .dirname(require.resolve('jsdog')) + '/default.jade',
        pageTitle = parsed.title ? parsed.title : path
        .basename(filename),
        dumpAfterParse = parsed.dump ? parsed.dump : false,
        ll = parsed.loglevel ? parsed.loglevel : 0,
        wrapper = parsed.wrap ? parsed.wrap : false;
    if (!pageTitle) {
        pageTitle = filename;
    }
    jsdog.parseSourceFile(filename, parsed, function (data) {
        jadeOpts.locals = {
            pageTitle: pageTitle,
            docs: data.docs,
            genTime: data.genTime,
            src: data.src
        };
        jade.renderFile(templateFile, jadeOpts, function (err, html) {
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var jsdog = require('jsdog');
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
            input.errors[this.id] = ex.message;
            doneCallback(input);
        } catch (e) {}
    }
};
var yuiDocProc = {
    id: 'yuiDocProc',
    type: 'processor',
    description: 'Generates yuidoc JSON. TODO: template',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }

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

            function readFile(filePathName) {
                var FILE_ENCODING = 'utf8';
                filePathName = _path.normalize(filePathName);
                var source = '';
                try {
                    source = _fs.readFileSync(filePathName, FILE_ENCODING);
                } catch (er) {}
                return source;
            }
            var options = {
                quiet: true,
                writeJSON: false,
                outdir: fileOutputDirectory,
                extension: '.js',
                norecurse: true,
                paths: [fileParentDirectory],
                syntaxtype: 'js',
                parseOnly: true
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
                jsonResult.result = json;
            } catch (e) {
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
    process: function (input, doneCallback) {
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
    process: function (input, doneCallback) {
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

function addExtendsAnnotation(inputObject, linesArray, whereInlines) {
    var instance = linesArray[whereInlines];
    if (instance.indexOf('.extend(') !== -1 || instance.indexOf('.extend (') !== -1) {
        var source = '<?source?>';
        var dest = '<?destination?>';
        var extender = '?';
        var usingBackBone = false;
        var notAClass = false;
        var splitter = instance.split('.extend');
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
        if (extender == '$' || extender == '_' || extender == 'YUI()' || extender == 'Y') {
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
                if (splitArgs.length > 1) {
                    var secondItem = '';
                    secondItem = afterLeftParenthesis.split(',')[1];
                    source = secondItem;
                }
            }
        } else {
            usingBackBone = true;
            source = extender;
        }
        if (dest.indexOf('.') !== -1) {
            notAClass = true;
        }
        if (!isUpperCase(dest.charAt(0))) {
            notAClass = true;
        }
        if (usingBackBone && !notAClass) {
            var previousComment = getLastJsDocComment(inputObject, linesArray,
                whereInlines);
            if (previousComment.description != null) {}
            instance = '/**\n * @constructor ' + dest + '\n * @augments ' + source + '\n */\n' + instance;
        }
        if (!notAClass) {}
    }
    return instance;
}

function getLastJsDocComment(inputObject, linesIn, topOfBlock) {
    var inComment = false;
    var buffer = [];
    var comments = {};
    var indx = 0;
    for (indx = topOfBlock; indx > -1; indx--) {
        var line = trim(linesIn[indx]);
        if (line.length > 0) {
            if (line.indexOf('*/') !== -1) {
                if (line.indexOf('/**') !== -1) {
                    buffer.push(line);
                } else if (line.indexOf('/*') !== -1) {
                    buffer.push(line);
                } else {
                    inComment = true;
                    continue;
                }
            } else if (line.indexOf('/*') !== -1) {
                if (inComment) {
                    if (line.indexOf('/**') !== -1) {}
                }
                inComment = false;
                var inDescription = true;
                var desc = '';
                for (var x = 0; x < buffer.length; x++) {
                    var chunk = trim(buffer[x]);
                    chunk = chunk.split('*');
                    chunk.shift();
                    chunk = trim(chunk.join('*'));
                    if (chunk.indexOf('@') === 0) {
                        chunk = chunk.substring(1);
                        var tagName = chunk.split(' ')
                            .shift();
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }

        function checkExpression(inputObject, id, src, wrong, right) {
            if (src.indexOf(wrong) !== -1) {
                var wrongName = wrong;
                if (wrongName == '\t') {
                    wrongName = '\'\\t\'';
                } else if (wrongName == '\r\n') {
                    wrongName = '\'\\r\\n\'';
                } else if (wrongName == '\r') {
                    wrongName = '\'\\r\'';
                }
                if (inputObject.errors[id] == null) {
                    inputObject.errors[id] = [];
                }
                var error = {
                    'id': '(error)',
                    'raw': 'Bad character(s) found.',
                    'code': 'wfBC',
                    'evidence': '',
                    'line': -1,
                    'character': -1,
                    'scope': '(main)',
                    'a': '',
                    'reason': 'Bad character(s) found: \'' + wrongName + '\'.'
                };
                inputObject.errors[id].push(error);
                src = src.split(wrong)
                    .join(right);
            }
            return src;
        }
        input.source = checkExpression(input, this.id, input.source, '\r\n',
            '\n');
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }

        function checkExpression(inputObject, id, src, wrong, right) {
            if (src.indexOf(wrong) !== -1) {
                var wrongName = wrong;
                if (wrongName == '\t') {
                    wrongName = '\'\\t\'';
                } else if (wrongName == '\r\n') {
                    wrongName = '\'\\r\\n\'';
                } else if (wrongName == '\r') {
                    wrongName = '\'\\r\'';
                }
                var error = {
                    'id': '(error)',
                    'raw': 'jsDoc tag error.',
                    'code': 'wfJD',
                    'evidence': '',
                    'line': -1,
                    'character': -1,
                    'scope': '(main)',
                    'a': '',
                    'reason': 'jsDoc tag error: found \'' + wrongName + '\'.'
                };
                inputObject.errors[id].push(error);
                src = src.split(wrong)
                    .join(right);
            }
            return src;
        }
        var src = trim(input.source);
        var lineOne = src.split('\n')[0];
        if (lineOne.indexOf('/*') !== -1 && lineOne.indexOf('/**') === -1) {
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
            input.errors[this.id].push(error);
        }
        input.source = checkExpression(input, this.id, input.source,
            '@return nothing', '');
        input.source = checkExpression(input, this.id, input.source,
            '@return void', '');
        input.source = checkExpression(input, this.id, input.source,
            '@return nada', '');
        input.source = checkExpression(input, this.id, input.source,
            '@param Object', '@param {Object}');
        input.source = checkExpression(input, this.id, input.source,
            '@returns ', '@return ');
        input.source = checkExpression(input, this.id, input.source,
            '@param object', '@param {Object}');
        input.source = checkExpression(input, this.id, input.source,
            '@param Array', '@param {Array}');
        input.source = checkExpression(input, this.id, input.source,
            '@param String', '@param {String}');
        input.source = checkExpression(input, this.id, input.source,
            '@param bool', '@param {Boolean}');
        input.source = checkExpression(input, this.id, input.source,
            '@param boolean', '@param {Boolean}');
        input.source = checkExpression(input, this.id, input.source,
            '@param {bool}', '@param {Boolean}');
        input.source = checkExpression(input, this.id, input.source,
            '@param int', '@param {Number}');
        input.source = checkExpression(input, this.id, input.source,
            '@param float', '@param {Number}');
        writeFile(input.processedFilePath, input.source);
        doneCallback(input);
    }
};
var parseFilter = {
    id: 'parseFilter',
    type: 'filter',
    description: 'Filters out js files that cannot be parsed.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var _esprima = require('esprima');
        try {
            var ast = _esprima.parse(input.source);
            doneCallback(input);
        } catch (ex) {
            input.errors[this.id] = ex.message;
            finishedProcessingChain();
        }
    }
};

function scanForMinifiedLines(input) {
    var lines = input.split('\n');
    var linesLength = lines.length;
    var strikes = 0;
    for (var index = 0; index < linesLength; index++) {
        var line = lines[index].trim();
        if (line.length > 200) {
            strikes++;
            if (strikes > 2) {
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        if (input.fileName.indexOf('.min.js') !== -1 || input.fileName.indexOf('-min.js') !== -1) {
            finishedProcessingChain();
        } else if (scanForMinifiedLines(input.source)) {
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var temp = input.source;
        var stripped = stripOneLineComments(stripCComments(temp));
        var yuiAdd_A = stripped.indexOf('YUI().add(') !== -1;
        var yuiAdd_B = stripped.indexOf('YUI.add(') !== -1;
        if (yuiAdd_A || yuiAdd_B) {
            doneCallback(input);
        } else {
            finishedProcessingChain();
        }
    }
};
var amdFilter = {
    id: 'amdFilter',
    type: 'filter',
    description: 'Filters out js files that are not AfMD modules.',
    process: function (input, doneCallback) {
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
            finishedProcessingChain();
        }
    }
};
var thirdPartyFilter = {
    id: 'thirdPartyFilter',
    type: 'filter',
    description: 'Filters out js files in defined 3rd party directories.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var temp = input.path;
        var pathDelim = temp.indexOf('/') == -1 ? '\\' : '/';
        if (input.fileName.indexOf('afc') === -1 && input.fileName.indexOf('corsframe') === -1 && input.fileName.indexOf('foresee') === -1) {
            if (temp.indexOf(pathDelim + 'lib') === -1 && temp.indexOf(pathDelim + 'yui_sdk') === -1 && temp.indexOf(pathDelim + 'infrastructure') === -1 && input.source.indexOf('ShockwaveFlash') === -1) {
                doneCallback(input);
            } else {
                input.errors[this.id] = 'In a designated 3rd party folder.';
                finishedProcessingChain();
            }
        } else {
            input.errors[this.id] = 'In a designated 3rd party folder.';
            finishedProcessingChain();
        }
    }
};
var amdOrYuiFilter = {
    id: 'amdOrYuiFilter',
    type: 'filter',
    description: 'Filters out js files that are not valid modules.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        temp = input.source;
        var stripped = stripOneLineComments(stripCComments(temp));
        var yuiAdd_A = stripped.indexOf('YUI().add(') !== -1;
        var yuiAdd_B = stripped.indexOf('YUI.add(') !== -1;
        var isModule = stripped.indexOf('define(') !== -1;
        var isMain = stripped.indexOf('require(') !== -1;
        if ((yuiAdd_A || yuiAdd_B || isModule || isMain) && temp.indexOf('@license') == -1 && temp.indexOf('define.amd') == -1 && temp.indexOf('Yahoo! Inc') == -1) {
            input.moduleFile = true;
            doneCallback(input);
        } else {
            input.moduleFile = false;
            finishedProcessingChain();
        }
    }
};
var jsBeautifyProc = {
    id: 'jsBeautifyProc',
    type: 'processor',
    description: 'node-js-beautify module. TODO: add options support.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }

        function unpacker_filter(source) {
            var trailing_comments = '',
                comment = '',
                unpacked = '',
                found = false;
            do {
                found = false;
                if (/^\s*\/\*/.test(source)) {
                    found = true;
                    comment = source.substr(0, source.indexOf('*/') + 2);
                    source = source.substr(comment.length)
                        .replace(/^\s+/, '');
                    trailing_comments += comment + '\n';
                } else if (/^\s*\/\//.test(source)) {
                    found = true;
                    comment = source.match(/^\s*\/\/.*/)[0];
                    source = source.substr(comment.length)
                        .replace(/^\s+/, '');
                    trailing_comments += comment + '\n';
                }
            } while (found);
            var unpackers = [P_A_C_K_E_R, Urlencoded, JavascriptObfuscator,
                                               MyObfuscate
                                               ];
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
            'max_preserve_newlines': 1,
            'jslint_happy': true,
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
        doneCallback(input);
    }
};
var jsHintProc = {
    id: 'jsHintProc',
    type: 'processor',
    description: 'node jsHint module. TODO: add options support.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var JSHINT = require('jshint')
            .JSHINT;
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
        input.errors[this.id] = JSHINT.errors;
        JSHINT.errors = null;
        doneCallback(input);
    }
};
var trimProc = {
    id: 'trimProc',
    type: 'processor',
    description: 'Trim each line of the file.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var source = input.source;
        var lines = source.split('\n');
        for (var index = 0; index < lines.length; index++) {
            var line = lines[index];
            line = trim(line);
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var source = input.source;
        var esformatter = require('esformatter');
        var options = {
            preset: 'default',
            indent: {
                value: '  '
            },
            lineBreak: {
                before: {
                    BlockStatement: 1,
                    DoWhileStatementOpeningBrace: 1
                }
            },
            whiteSpace: {}
        };
        input.source = esformatter.format(source, options);
        doneCallback(input);
    }
};
var gsLintProc = {
    id: 'gsLintProc',
    type: 'processor',
    description: 'Runs Closure gjslint tool. TODO: add logging.',
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        var self = this;

        function runGjsLint(fileName) {
            fileName = _path.normalize(fileName);
            var exePath = _path
                .normalize('"C:\\Program Files (x86)\\Python\\Scripts\\gjslint.exe"');
            var exec = require('child_process')
                .exec;
            var cmdLine = exePath + ' --nojsdoc ' + fileName;
            var child = exec(cmdLine, function (error, stdout, stderr) {
                var report = [];
                var results = stdout.split('\r\n');
                for (var line = 0; line < results.length; line++) {
                    var resultLine = results[line];
                    if (resultLine.indexOf('Line ') === 0) {
                        var lineNumber = resultLine.split(',')[0];
                        lineNumber = trim(lineNumber.split(' ')[1]);
                        var errorCode = trim(resultLine.split(',')[1]
                            .split(': ')[0]);
                        var reason = trim(resultLine.split(': ')[1]);
                        var error = {
                            'id': '(error)',
                            'raw': reason,
                            'code': errorCode,
                            'evidence': '',
                            'line': parseInt(lineNumber, 10),
                            'character': -1,
                            'scope': '(main)',
                            'a': '',
                            'reason': reason
                        };
                        report.push(error);
                    }
                }
                input.errors[self.id] = report;
            });
            child.on('close', function (code) {
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
    process: function (input, doneCallback) {
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }

        function runJsDoccer(fileName, id) {
            // console.warn('runJsDoccer');
            var exePath = 'java -jar jsdoccer.jar';
            var exec = require('child_process')
                .exec;
            var basePath = _path.normalize(input.outputDirectory + '/' + input.packagePath);
            var name = input.fileName;
            var internalErrors = [];
            var stdout = addMissingComments(input, internalErrors);
            
            if (internalErrors.length > 0) {
                var lineNumber = -1;
                var reason = 'Parse error. Aborted.';
                var error = {
                    'id': '(error)',
                    'raw': 'parseError',
                    'code': 'addMissingComments',
                    'evidence': '',
                    'line': -1,
                    'character': -1,
                    'scope': '(main)',
                    'a': '',
                    'reason': reason
                };
                input.errors[id].push(error);
            }
            
            // var child = exec(exePath + ' ' + basePath + ' ' +
            // name, function
            // (error, stdout, stderr) {
            // if (error) {}
            var splitter = stdout.split('/*jsdoc_prep_data*/');
            try {
                input.jsDoccerProcData = JSON.parse(unescape(splitter[0]));
                var amdProcData = input.results.amdProc;
                input.jsDoccerProcData.requires = amdProcData.requires;
                input.jsDoccerProcData.is_module = amdProcData.AMD;
                

                input.jsDoccerProcData.min = amdProcData.min;
                input.jsDoccerProcData.main = amdProcData.main;
                input.jsDoccerProcData.uses_$ = amdProcData.uses_$;
                input.jsDoccerProcData.uses_Y = amdProcData.uses_Y;
                input.jsDoccerProcData.uses_alert = amdProcData.uses_alert;
                input.jsDoccerProcData.strict = amdProcData.strict;
                input.jsDoccerProcData.uses_console_log = input.source.indexOf('console.') !== -1;
                input.jsDoccerProcData.uses_backbone = input.source.indexOf('Backbone.') !== -1;
                
                var classes = input.jsDoccerProcData.classes;
                if (classes[input.camelName] == null) {
                    var classArray = [];
                    for (var c in classes) {
                        classArray.push(classes[c]);
                    }
                    if (classArray.length > 0) {
                        input.possibleClassname = classArray[0].name;
                    }
                }
                var methods = input.jsDoccerProcData.methods;
                for (var m = 0; m < methods.length; m++) {
                    var method = methods[m];
                    if (method.visibility === 'public') {
                        if (method.originalJsDocDescription == null) {
                            method.originalJsDocDescription = {};
                        }
                        var keys = [];
                        for (var k in method.originalJsDocDescription) {
                            if (method.originalJsDocDescription
                                .hasOwnProperty(k)) {
                                keys.push(method.originalJsDocDescription[k]);
                            }
                        }
                        if (keys.length === 0) {
                            var lineNumber = method.lineNumber;
                            var reason = 'No jsDoc Comments for method \'' + method.name + '\'.';
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
                        }
                    }
                }
            } catch (ex) {
                input.jsDoccerProcData = null;
            }
            input.source = unescape(splitter[1]);
            input.testStubs = unescape(splitter[2]);
            // console.warn(input.source);
            writeFile(input.processedFilePath, input.source);
            doneCallback(input);
            // });
            // child.on('close', function (code) {
            // doneCallback(input);
            // });
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

function test() {
    var basePath = 'jsdoc-preptoolkit';
    var inPath = 'jsdoc-preptoolkit\\includes\\js\\toolkit\\toolkit.js';
    var outPath = 'jsdoc-preptoolkit\\processed';
    var testPath = 'jsdoc-preptoolkit\\jstests';
    var docPath = 'jsdoc-preptoolkit\\jsdocs';
    processFile(basePath, inPath, outPath, testPath, docPath, [gsLintProc],
        function (result) {});
}

function readFile(filePathName) {
    filePathName = _path.normalize(filePathName);
    var source = '';
    try {
        source = _fs.readFileSync(filePathName, FILE_ENCODING);
    } catch (er) {}
    return source;
}

function writeFile(filePathName, source) {
    // if (filePathName.indexOf('.json') === -1){
    // console.warn(arguments.callee.caller);
    // console.warn('writeFile: ' + filePathName);
    // //console.warn(source);
    // }
    if (WRITE_ENABLED) {
        filePathName = _path.normalize(filePathName);
        safeCreateFileDir(filePathName);
        _fs.writeFileSync(filePathName, source);
    }
}

function setWriteEnable(val) {
    WRITE_ENABLED = val;
}

function processFile(baseDirectory, filePathName, outputDirectory,
    testDirectory, docDirectory, processorChain, completionCallback,
    writeEnable) {
    var pathDelim = filePathName.indexOf('/') == -1 ? '\\' : '/';
    WRITE_ENABLED = writeEnable = writeEnable != null ? writeEnable : false;
    finishedProcessingChain = _finishedProcessingChain;
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
    var wholePath = filePathName.split(pathDelim);
    var fileName = wholePath.pop();
    wholePath = wholePath.join(pathDelim);
    output.folderPath = wholePath;
    output.fileName = fileName;
    output.packagePath = wholePath.substring(baseDirectory.length);
    if (pathDelim === '\\') {
        output.webPath = output.packagePath.split('\\')
            .join('/');
    } else {
        output.webPath = output.packagePath;
    }
    var outputSourceDir = _path.normalize(outputDirectory + '/' + output.packagePath);
    safeCreateDir(outputSourceDir);
    outputfilePathName = outputSourceDir + '/' + output.fileName;
    outputfilePathName = _path.normalize(outputfilePathName);
    var libFile = false;
    var min = filePathName.indexOf('.min.') !== -1 || filePathName.indexOf('-min.') !== -1;
    libFile = filePathName.indexOf('infrastructure') !== -1 || filePathName.indexOf('yui_sdk') !== -1 || min;
    output.libFile = libFile;
    output.min = min;
    var moduleName = getModuleName(filePathName);
    if (moduleName.indexOf('/') !== -1) {
        moduleName = moduleName.split('/')
            .pop();
    }
    output.realName = moduleName;
    output.name = normalizeName(moduleName);
    output.camelName = camelize(output.name);
    var source = readFile(filePathName);
    output.rawSource = source;
    output.source = source;
    output.processedFilePath = outputfilePathName;
    var currentChainIndex = 0;

    function runNextProcessor() {
        output.undoBuffer = output.source;
        if (!WRITE_ENABLED) {
            output.source = output.rawSource;
        }
        var processor = processorChain[currentChainIndex];
        processor.process(output, function (result) {
            currentChainIndex++;
            if (currentChainIndex < processorChain.length) {
                runNextProcessor();
            } else {
                _finishedProcessingChain();
            }
        });
    }
    var processor = processorChain[currentChainIndex];
    output.couldParseOriginalSource = canParse(filePathName, output.rawSource,
        processor.id);
    runNextProcessor();

    function _finishedProcessingChain() {
        var VERIFY_PARSE = true;
        // console.warn(output.source);
        writeFile(outputfilePathName, output.source);
        output.couldParseProcessedSource = canParse(outputfilePathName,
            output.source, processor.id);
        output.corrupted = false;
        output.numberOfLines = output.source.split('\n')
            .length;
        for (var e in output.errors) {
            var error = output.errors[e];
            var numberOfErrors = error.length;
            if (typeof error === 'string') {
                numberOfErrors = 1;
            }
            var percent = Math.floor(numberOfErrors / output.numberOfLines * 100);
            if (percent > ERROR_THRESHOLD) {}
        }
        if (VERIFY_PARSE) {
            if (output.couldParseOriginalSource != output.couldParseProcessedSource) {
                if (!output.couldParseProcessedSource) {
                    console.warn('COULD NOT PARSE MODIFIED SOURCE in file ' + output.name);
                    output.source = output.undoBuffer;
                    output.corrupted = false;
                    writeFile(outputfilePathName, output.source);
                }
            }
        }
        output.rawSource = null;
        delete output.rawSource;
        completionCallback(output);
    }
}

function decamelize(input) {
    var test = input.split('_');
    if (test.length > 1 && input.indexOf('_') > 0) {
        var output = trim(input.toLowerCase());
        return output;
    }
    test = input.split('-');
    if (test.length > 1 && input.indexOf('-') > 0) {
        var output = trim(input.toLowerCase());
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
            chararcter = chararcter.toLowerCase();
            words.push(trim(word));
            word = '';
            word += chararcter;
        } else {
            word += chararcter;
        }
    }
    if (trim(word)
        .length > 0) {
        words.push(trim(word));
    }
    var name = trim(words.join(' '));
    name = name.split(' ')
        .join('_');
    return name.split('-')
        .join('_');
}

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

function trim(input) {
    return input.trim();
}

function trimRight(s) {
    return s.replace(new RegExp('/s+$/'), '');
}

function camelize(input) {
    var test = input.split('_');
    if (test.length > 1 && input.indexOf('_') > 0) {
        for (var index = 0; index < test.length; index++) {
            test[index] = capitalize(test[index]);
        }
        return test.join('');
    }
    test = input.split('-');
    if (test.length > 1 && input.indexOf('-') > 0) {
        for (var index = 0; index < test.length; index++) {
            test[index] = capitalize(test[index]);
        }
        return test.join('');
    }
    return capitalize(input);
}

function camelizeVariable(input) {
    var test = input.split('_');
    if (test.length > 1 && input.indexOf('_') > 0) {
        for (var index = 0; index < test.length; index++) {
            test[index] = capitalize(test[index]);
        }
        test[0] = test[0].toLowerCase();
        return test.join('');
    }
    test = input.split('-');
    if (test.length > 1 && input.indexOf('-') > 0) {
        for (var index = 0; index < test.length; index++) {
            test[index] = capitalize(test[index]);
        }
        test[0] = test[0].toLowerCase();
        return test.join('');
    }
    input = input.split('');
    input[0] = input[0].toLowerCase();
    input = input.join('');
    return input;
}

function isUpperCase(aCharacter) {
    return aCharacter >= 'A' && aCharacter <= 'Z';
}

function normalizeName(input) {
    return input.split('-')
        .join('_');
}

function safeCreateFileDir(path) {
    if (!WRITE_ENABLED) {
        return;
    }
    var dir = _path.dirname(path);
    if (!_fs.existsSync(dir)) {
        _wrench.mkdirSyncRecursive(dir);
    }
}

function safeCreateDir(dir) {
    if (!WRITE_ENABLED) {
        return;
    }
    if (!_fs.existsSync(dir)) {
        _wrench.mkdirSyncRecursive(dir);
    }
}

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

function stripOneLineComments(input) {
    var lines = input.split('\n');
    var L = 0;
    for (L = 0; L < lines.length; L++) {
        var commentCheck = lines[L].split('//');
        lines[L] = commentCheck[0];
    }
    return lines.join('\n');
}

function canParse(moduleName, input, procId) {
    return true;
}

function esprimafy(moduleName, input) {
    var _esprima = require('esprima');
    var then = new Date()
        .getTime();
    try {
        var response = {};
        var ast = _esprima.parse(input);
        var optimized = _esmangle.optimize(ast, null);
        var result = _esmangle.mangle(optimized);
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
        response.moduleName = moduleName;
        response.code = output;
        response.timeTaken = new Date()
            .getTime() - then;
        response.ratio = response.code.length / input.length;
        return response;
    } catch (ex) {}
    return null;
}

function uglyDucklify(moduleName, input) {
    var then = new Date()
        .getTime();
    try {
        var result = _uglifyjs.minify(input, {
            fromString: true
        });
        result.timeTaken = new Date()
            .getTime() - then;
        result.moduleName = moduleName;
        result.ratio = result.code.length / input.length;
        return result;
    } catch (ex) {}
    return {
        code: '<ERROR>'
    };
}
var modules = {};

function convert(input, filePathname) {
    var pathDelim = filePathname.indexOf('/') == -1 ? '\\' : '/';
    var wholePath = filePathname.split(pathDelim);
    wholePath.pop();
    wholePath = wholePath.join(pathDelim);
    var temp = trim(input);
    var moduleName = '?';
    var requires = [];
    var output = {};
    output.callsYuiApi = false;
    output.rawSource = input;
    var libFile = false;
    var min = filePathname.indexOf('.min.') !== -1 || filePathname.indexOf('-min.') !== -1;
    libFile = filePathname.indexOf('infrastructure') !== -1 || filePathname.indexOf('yui_sdk') !== -1 || min;
    output.name = moduleName;
    output.isShim = false;
    output.min = min;
    if (pathDelim === '\\') {
        filePathname = filePathname.split('\\')
            .join('/');
    }
    output.path = filePathname;
    var stripped = stripOneLineComments(stripCComments(temp));
    var yuiAdd_A = stripped.indexOf('YUI().add(') !== -1;
    var yuiAdd_B = stripped.indexOf('YUI.add(') !== -1;
    if (false) {
        var yuiAdd = 'YUI().add(';
        if (yuiAdd_B) {
            yuiAdd = 'YUI.add(';
        }
        var yuiChunk = temp.split(yuiAdd);
        moduleName = yuiChunk[1].split(',')[0];
        moduleName = trim(moduleName.split('\'')
            .join('')
            .split('"')
            .join(''));
        if (modules[moduleName] != null) {
            moduleName = getModuleName(filePathname);
        }
        if (moduleName.indexOf('/') !== -1) {
            moduleName = moduleName.split('/')
                .pop();
        }
        output.isModule = true;
        var requiresString = yuiChunk[1].split(',')[1].split('(')[1].split(')')[0];
        if (requiresString.length > 1) {}
        if (stripped.indexOf('Y.') !== -1) {
            if (JSON.stringify(requires)
                .indexOf('"yui"') == -1) {
                requires.push('yui');
            }
            output.callsYuiApi = true;
        }
        if (stripped.indexOf('$(') !== -1) {
            if (JSON.stringify(requires)
                .indexOf('"jquery"') == -1) {
                requires.push('jquery');
            }
        }
        yuiChunk = temp.split('requires: [');
        var hasRequiresBlock = false;
        if (yuiChunk.length > 1) {
            hasRequiresBlock = true;
            requiresString = trim(yuiChunk[1].split(']')[0]);
            var requiredModules = [];
            if (requiresString.indexOf(',') !== -1) {
                requiredModules = requiresString.split(',');
                if (requiresString.indexOf('*') !== -1) {
                    requiredModules = eval('[' + requiredModules + ']');
                }
            } else {
                requiredModules.push(requiresString);
            }
            for (var index = 0; index < requiredModules.length; index++) {
                var mod = trim(requiredModules[index].split('\'')
                    .join('')
                    .split('"')
                    .join(''));
                if (mod.length == 0) {
                    continue;
                }
                if (mod == 'jQuery') {
                    mod = 'jquery';
                }
                if (JSON.stringify(requires)
                    .indexOf('"' + mod + '"') == -1) {
                    requires.push(mod);
                }
            }
        }
        yuiChunk = temp.split(yuiAdd);
        var afterAdd = yuiChunk[1];
        afterAdd = afterAdd.split('{');
        afterAdd.shift();
        afterAdd = afterAdd.join('{');
        yuiChunk[1] = afterAdd;
        var requireSkeleton = 'define("' + moduleName + '", [';
        for (var r = 0; r < requires.length; r++) {
            if (r > 0) {
                requireSkeleton += ', ';
            }
            requireSkeleton += '"' + requires[r] + '"';
        }
        requireSkeleton += '], function(';
        for (var r = 0; r < requires.length; r++) {
            if (r > 0) {
                requireSkeleton += ', ';
            }
            if (requires[r].toLowerCase()
                .indexOf('jquery.') !== -1) {
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
        var newBody = yuiChunk.join(requireSkeleton);
        yuiChunk = newBody.split('}');
        if (hasRequiresBlock) {
            yuiChunk.pop();
        }
        yuiChunk.pop();
        newBody = yuiChunk.join('}');
        newBody += '\n});';
        temp = newBody;
    } else {
        // console.warn("convert--> AMD");
        moduleName = getModuleName(filePathname);
        temp = input;
        stripped = stripped.split('define (')
            .join('define(');
        stripped = stripped.split('require (')
            .join('require(');
        var indexOfDefine = stripped.indexOf('define(');
        output.isModule = stripped.indexOf('define(') !== -1;
        var indexOfRequire = stripped.indexOf('require(');
        output.isMain = (output.isModule) & (indexOfRequire !== -1) && (indexOfRequire < indexOfDefine);
        // console.warn(indexOfRequire + ',' + indexOfDefine);
        // console.warn(output);
        var defineBlock = stripped.indexOf('define(') !== -1 && !libFile;
        if (defineBlock && (!output.isMain)) {
            var afterDefine = stripped.split('define(')[1];
            afterDefine = afterDefine.split(')')[0].trim();
            if (afterDefine.charAt(0) !== '{' && afterDefine.indexOf('[') !== -1) {
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
                // console.warn("convert--> depsRaw");
                // console.warn(depsRaw);
                requires = depsRaw;
                var afterDefineSplit = afterDefine.split('(');
                if (afterDefineSplit.length > 1) {
                    var depVarnames = afterDefineSplit[1];
                    depVarnames = depVarnames.split(')')[0];
                    depVarnames = depVarnames.split(',');
                    for (var index = 0; index < depVarnames.length; index++) {
                        var item = depVarnames[index];
                        item = trim(item);
                        if (item.indexOf('*' !== -1)) {}
                        depVarnames[index] = item;
                    }
                    output.depVarnames = depVarnames;
                } else {
                    console.warn('afterDefine: ' + afterDefine);
                    console.warn('Problem file: ' + filePathname);
                    // throw(new Error("Can't split afterDefine!"));
                }
            }
            afterDefine = stripped.split('define(')[1];
            afterDefine = afterDefine.split(')')[0];
            if (afterDefine.indexOf(moduleName) == -1) {
                var all = temp.split('define(');
                all[1] = '"' + moduleName + '",' + all[1];
                temp = all.join('define(');
            }
        } else {
            var requireBlock = stripped.indexOf('require(') !== -1 && !libFile;
            if (requireBlock) {
                var afterDefine = stripped.split('require(')[1];
                afterDefine = afterDefine.split(')')[0];
                if (afterDefine.indexOf('[') !== -1) {
                    afterDefine = afterDefine.split('[')[1];
                    var depsRaw = afterDefine.split(']')[0];
                    depsRaw = depsRaw.split(',');
                    for (var index = 0; index < depsRaw.length; index++) {
                        var item = depsRaw[index];
                        item = item.split('"')
                            .join('');
                        item = trim(item);
                        depsRaw[index] = item;
                    }
                    requires = depsRaw;
                    var depVarnames = afterDefine.split('(')[1];
                    depVarnames = depVarnames.split(')')[0];
                    depVarnames = depVarnames.split(',');
                    for (var index = 0; index < depVarnames.length; index++) {
                        var item = depVarnames[index];
                        item = trim(item);
                        depVarnames[index] = item;
                    }
                    output.depVarnames = depVarnames;
                }
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
    if (output.name.indexOf('*') !== -1 || output.name.indexOf('/') !== -1) {}
    if (output.name === 'backbone') {
        output.requires = ['underscore', 'jquery'];
    } else if (output.name === 'jquery') {
        output.requires = [];
    } else if (output.requires.length === 0) {
        if (temp.indexOf(' $.') !== -1 || temp.indexOf(' $(') !== -1) {
            output.requires = ['jquery'];
        }
    }
    if (output.name !== 'backbone') {
        if (input.indexOf('Backbone.') !== -1) {
            if (JSON.stringify(output.requires)
                .indexOf('"backbone"') == -1) {
                output.requires.push('backbone');
            }
            if (JSON.stringify(output.requires)
                .indexOf('"underscore"') == -1) {
                output.requires.push('underscore');
            }
        }
    }
    output.libFile = libFile;
    output.realName = output.name;
    output.name = normalizeName(output.name);
    return output;
}

function getRequiresTags(input) {
    console.warn('getRequiresTags: ' + input.name);
    var output = '';
    var amdProcData = input.results.amdProc;
    if (!amdProcData.AMD) {
        return '';
    }
    // console.warn(amdProcData);
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

function getLines(lines, x, y) {
    var buffer = [];
    for (var index = x; index < y + 1; index++) {
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

function concatLines(lines, codeBlock) {
    var blockLines = codeBlock.split('\n');
    for (var index = 0; index < blockLines.length; index++) {
        lines.push(blockLines[index]);
    }
    return lines;
}

function replace(source, original, token) {
    var array = source.split(original);
    return array.join(token);
}
var jsDoc3PrepProc = {
    id: 'jsDoc3PrepProc',
    type: 'processor',
    description: 'Fixes annotations. Less is more.',
    process: function jsDoc3PrepProcess(input, doneCallback) {
        var PROC_DOCLETS = true;
        if (input.errors[this.id] == null) {
            input.errors[this.id] = [];
        }
        input.name = input.fileName.split('.js')[0];
        // console.warn(input.name);
        var source = input.source;
        // console.warn(input.source);
        // if (input.name === 'context'){
        // //console.warn(splitter[0]);
        // console.warn(source);
        // }
        source = replace(source, '{string}', '{String}');
        source = replace(source, '{object}', '{Object}');
        source = replace(source, '{number}', '{Number}');
        source = replace(source, '{int}', '{Number}');
        source = replace(source, '{long}', '{Number}');
        source = replace(source, '{double}', '{Number}');
        source = replace(source, '{boolean}', '{Boolean}');
        source = replace(source, '{bool}', '{Boolean}');
        source = replace(source, '{function}', '{Function}');
        input.source = source;
        firstDoclet = null;
        // console.warn(getRequiresTags(input));
        var lines = input.source.split('\n');
        var index = 0;
        var linesLength = lines.length;
        var lastLine = '';
        for (index = 0; index < linesLength; index++) {
            var line = lines[index];
            if (line.trim()
                .indexOf('//') === 0) {
                continue;
            }
            // DO NOT REMOVE THESE!!! They are part of the jsDoc spec.
//            if (line.indexOf('* @method') !== -1 || line.indexOf('* @function') !== -1 || line.indexOf('* @memberOf') !== -1) {
//                lines[index] = '';
//            }
            // if (line.indexOf('* @requires') !== -1) {
            // lines[index] = '';
            // }
            // this is for Backbone stuff.
            if (line.indexOf('* @lends') !== -1 || line.indexOf('*@lends') !== -1) {
                if (lastLine.indexOf('.extend') === -1) {
                    // console.warn('hacking a @lends tag: '
                    // + line);
                    lines[index] = line;
                } else {
                    if (line.indexOf('~') === -1) {
                        console.warn('hacking a @lends tag with reference to a class');
                        var lendSplit = line.split('@lends ');
                        lendSplit[1] = 'module:' + input.name + '~' + lendSplit[1];
                        line = lendSplit.join('@lends ');
                        lines[index] = line;
                    } else {
                        console.warn('leave the @lends tag alone');
                        lines[index] = line;
                    }
                }
            }
            lastLine = line;
        }
        input.source = lines.join('\n');
        // if (input.name === 'context'){
        // console.warn(input.source);
        // }
        var whereDefine = input.source.indexOf('define(\'');
        if (whereDefine === -1) {
            whereDefine = input.source.indexOf('define("');
        }
        if (whereDefine === -1) {
            whereDefine = input.source.indexOf('define(');
        }
        if (input.source.indexOf('define = function') !== -1) {
            whereDefine = -1;
        }
        // HANDLE THIS:
        // define( function( require ){
        // var is = require( './is' ),
        //
        // Context = require( './declare' )( /** @lends
        // module:fluffy/context#
        // */ {
        //
        // /**
        // * @constructs module:fluffy/context
        // * @augments {null}
        // */
        // constructor: function Context(){
        if (whereDefine !== -1) {
            // console.warn('jsDoc3PrepProc: found define()
            // in the module');
            var source = input.source.substring(whereDefine);
            var whereVar = source.indexOf('var ');
            var whereFunctionNoSpace = source.indexOf('function(');
            var whereFunction = source.indexOf('function ');
            var whereDefine = source.indexOf('define(');
            // Loosen out test here?
            // if (source.indexOf('@exports ' + input.name)
            // === -1) {
            // define(function(require) {
            if (source.indexOf('@exports ') === -1) {
                if (whereVar > 0 || (whereFunction > 0 || whereFunctionNoSpace > 0)) {
                    if (whereFunctionNoSpace === -1 && whereFunction === -1 && whereDefine === -1) {
                        console.warn('jsDoc3PrepProc: could not find a function or define() in the module?');
                    } else {
                        console.warn('jsDoc3PrepProc: found @exports in the module');
                        var splitter = [];
                        if (whereFunctionNoSpace === -1) {
                            splitter = source.split('function (');
                        } else if (whereFunction === -1) {
                            splitter = source.split('function(');
                        } else if (whereFunctionNoSpace < whereFunction) {
                            splitter = source.split('function(');
                        } else {
                            splitter = source.split('function (');
                        }
                        var combiner = [];
                        // if (input.name === 'context'){
                        // //console.warn(splitter[0]);
                        // console.warn(source);
                        // }
                        // console.warn(JSON.stringify(input,null,2));
                        var packagePath = input.path.split('/');
                        packagePath.shift();
                        packagePath = packagePath.join('/');
                        packagePath = packagePath.split('.js')[0];
                        // console.warn(packagePath);
                        combiner.push(splitter[0] + '\n' + '/**\n * @exports ' + packagePath + '\n' + getRequiresTags(input) + ' */\n');
                        // if (input.name === 'context'){
                        // console.warn(splitter[0]);
                        // //console.warn(source);
                        // }
                        var splitterLength = splitter.length;
                        for (index = 1; index < splitterLength; index++) {
                            // if (input.name ===
                            // 'context'){
                            // console.warn(splitter[index]);
                            // //console.warn(source);
                            // }
                            combiner.push(splitter[index]);
                        }
                        source = combiner.join('function(');
                    }
                } else if (whereDefine !== -1 && source.indexOf('@module') === -1) {
                    var combiner = [];
                    // console.warn(JSON.stringify(input,null,2));
                    var packagePath = input.path.split('/');
                    packagePath.shift();
                    packagePath = packagePath.join('/');
                    packagePath = packagePath.split('.js')[0];
                    // console.warn(packagePath);
                    source = ('/**\n * @module ' + packagePath + '\n' + getRequiresTags(input) + ' */\n') + source;
                } else {
                    console.warn('jsDoc3PrepProc: whereVar??: ' + whereVar + ',' + whereFunction + ',' + whereFunctionNoSpace);
                }
            }
            
            var originalHeader = input.source.substring(0, whereDefine);
            console.warn('jsDoc3PrepProc: splicing header');
            //console.warn('originalHeader: "' + originalHeader + '"');
            input.source = originalHeader + '\n' + source;
            // console.warn(input.source);
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
        // Loosen out test here?
        // if (!prototypal
        // && input.source.indexOf('@exports ' + input.name)
        // !== -1) {
        // console.warn(input.fileName);
        if (!prototypal && input.source.indexOf('@exports ') !== -1) {
            if (input.source.indexOf('@constructor') !== -1) {
                console.warn('exports @constructor');
                var splitter = input.source.split('@constructor');
                input.source = splitter.join('@constructor');
            } else if (input.source.indexOf('var exports') !== -1) {
                if (input.source.indexOf('@alias module') === -1) {
                    console.warn('exports var exports');
                    var splitter = input.source.split('@module');
                    input.source = splitter.join('<br />Module');
                    splitter = input.source.split('var exports');
                    var newDoc = '\n /**\n * @alias module:' + input.name + '\n */';
                    input.source = splitter.join('/** @alias module:' + input.name + ' */\n var exports');
                    splitter = input.source.split('@class exports');
                    input.source = splitter.join('');
                }
            } else if (input.source.indexOf('var utils ') !== -1) {
                if (input.source.indexOf('@alias module') === -1) {
                    console.warn('exports var utils');
                    var splitter = input.source.split('@module');
                    input.source = splitter.join('<br />Module');
                    splitter = input.source.split('var utils ');
                    var newDoc = '\n /**\n * @alias module:' + input.name + '\n */';
                    input.source = splitter.join('/** @alias module:' + input.name + ' */\n var utils ');
                    splitter = input.source.split('@class utils');
                    input.source = splitter.join('');
                }
            } else if (input.source.indexOf('@class') !== -1) {
                console.warn('exports @class');
                var splitter = input.source.split('@class');
                input.source = splitter.join('@class');
            }
        }
        var splitter = input.source.split('@class');
        input.source = splitter.join('@constructor');
        splitter = input.source.split('@extends');
        input.source = splitter.join('@augments');
        writeFile(input.processedFilePath, input.source);
        doneCallback(input);
    }
};
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
module.exports = {
    'plugins': plugins,
    'processFile': processFile,
    'writeFile': writeFile,
    'setWriteEnable': setWriteEnable,
    'getAmdConfig': getAmdConfig
};

