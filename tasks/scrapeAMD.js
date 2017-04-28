/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
  'use strict';
  var DELETE_COFFEE_FILES = false;
  var scanPath = null;
  var logger = require('./lib/logger');
  var readFile = require('./lib/singleFileProcessor').readFile;
  var writeFile = require('./lib/singleFileProcessor').writeFile;
  var rollupModuleData = require('./lib/rollupModuleData').rollupModuleData;
  var decafErrorCount = 0;
  var projectPath = '';
  var FIX_COFFEE_CONSTRUCTOR_ORDER = true;
  logger.setGrunt(grunt);
  grunt.todoList = [];
  grunt.coffeeScriptLines = 0;

  function addToDoItem(path, task, msg) {
    var toDoItem = {
      path: path,
      task: task,
      msg: msg
    };
    grunt.todoList.push(toDoItem);
    return toDoItem;
  }
  grunt.addToDoItem = addToDoItem;

  function printToDolList() {
    if (grunt.option.flags().indexOf('--force') !== -1) {
      DELETE_COFFEE_FILES = true;
    }
    var args = this.args;
    var config = grunt.config('scrapeAMD');
    scanPath = config.options.scanPath;
    if (args.length > 0) {
      config = config[args[0]];
    } else {
      config = config.default;
    }
    var sourceDirectory = config.sourceDirectory;
    var specDirectory = config.specDirectory;
    //console.log("CONFIG!!!!!", JSON.stringify(grunt.config.get(), null, 2));
    projectPath = scanPath;
    var style = 'table {padding: 2px;} pre {padding: 2px; white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word; font-size: 8pt;}\n html {font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 10px;}\n body{ background:rgb(204,204,204); padding: 12px 1em 0; }';
    var texts = grunt.todoList;
    //texts.unshift("TASK" + ', ' + "MESSAGE");
    //console.log('&&&&&&& ' + projectPath);
    var fixMePage = [];
    fixMePage.push('<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <title>Things to fix after trying to get rid of CoffeeScript</title><style>{{style}}</style></head><body>'.split('{{style}}').join(style));
    fixMePage.push('<table border="1">');
    // add header here
    // console.log(headerRow);
    fixMePage.push('<tr>');
    fixMePage.push('<th>');
    fixMePage.push('FILE');
    fixMePage.push('</th>');
    fixMePage.push('<th>');
    fixMePage.push('TASK');
    fixMePage.push('</th>');
    fixMePage.push('<th width="800">');
    fixMePage.push('MESSAGE');
    fixMePage.push('</th>');
    fixMePage.push('</tr>');
    // add rows here
    for (var row = 0; row < texts.length; row++) {
      var currentRow = texts[row];
      fixMePage.push('<tr>');
      fixMePage.push('<td>');
      fixMePage.push('galileo-' + currentRow.path.split('/galileo-')[1]);
      //fixMePage.push('galileo-' + currentRow.path.split('/galileo-')[1]);
      fixMePage.push('</td>');
      fixMePage.push('<td>');
      fixMePage.push(currentRow.task);
      fixMePage.push('</td>');
      fixMePage.push('<td width="800">');
      fixMePage.push('\n<pre>\n' + currentRow.msg + '\n</pre>\n');
      fixMePage.push('</td>');
      fixMePage.push('</tr>');
    }
    fixMePage.push('</table></body></html>');
    writeFile(projectPath + '/fixme' + '.html', fixMePage.join('\n'));
  }
  grunt.registerTask('printToDolList', function () {
    //printToDolList(this);
    printToDolList.apply(this, arguments);
  });
  var spliceLinesBelow = function (lines, belowHere, a, b) {
    var result = [];
    var head = lines.slice(0, belowHere + 1);
    var ctorChunk = lines.slice(a, b);
    for (var index = a; index < b; index++) {
      lines[index] = '';
    }
    var tail = lines.slice(belowHere + 1);
    result = result.concat(head);
    result = result.concat(ctorChunk);
    result = result.concat(tail);
    return result.join('\n');
  };
  grunt.registerTask('scrapeAMD', function () {
    try {
      var done = this.async();
      if (grunt.option.flags().indexOf('--force') !== -1) {
        DELETE_COFFEE_FILES = true;
      }
      if (grunt.option.flags().indexOf('--verbose') !== -1) {
        logger.setVerbose(true);
      }
      var args = this.args;
      var config = grunt.config('scrapeAMD');
      scanPath = config.options.scanPath;
      if (args.length > 0) {
        config = config[args[0]];
      } else {
        config = config.default;
      }
      var sourceDirectory = config.sourceDirectory;
      var specDirectory = config.specDirectory;
      //console.log("CONFIG!!!!!", JSON.stringify(grunt.config.get(), null, 2));
      projectPath = scanPath;
      // works on the original coffeescript source file
      var patchCoffeeFile = function (sourceFile) {
        var source = grunt.file.read(sourceFile);
        var codeLines = source.split('\n');
        grunt.coffeeScriptLines += codeLines.length;
        var coffeeCode = source;
        if (FIX_COFFEE_CONSTRUCTOR_ORDER) {
          if (coffeeCode.indexOf('#fixed constructor order in class') === -1) {
            var ctorStart = -1;
            var ctorIndent = -1;
            var ctorEnd = -1;
            var currentIndent = -1;
            var topOfClass = -1;
            if (coffeeCode.indexOf('class ') !== -1) {
              var lines = coffeeCode.split('\n');
              var lineNumber = 0;
              for (lineNumber = 0; lineNumber < lines.length; lineNumber++) {
                var line = lines[lineNumber];
                if (line.trim() && line.trim().charAt(0) === '#') {
                  continue;
                }
                currentIndent = getIndent(line);
                if (line.trim().indexOf('class ') === 0) {
                  console.log('Found Coffee class def: ' + lineNumber);
                  topOfClass = lineNumber;
                }
                if (ctorStart > -1) {
                  if (currentIndent === ctorIndent || lineNumber === lines.length - 1) {
                    ctorEnd = lineNumber;
                    console.log('FOUND A CTOR BLOCK: ', ctorStart, ctorEnd);
                    break;
                  }
                } else if (ctorStart === -1 && line.indexOf('constructor:') !== -1) {
                  ctorStart = lineNumber;
                  ctorIndent = getIndent(line);
                  console.log('FOUND constructor', ctorStart, ctorIndent);
                }
              }
              if (ctorStart > -1 && ctorEnd === -1) {
                if (currentIndent === ctorIndent || lineNumber === lines.length - 1) {
                  ctorEnd = lineNumber;
                  console.log('FOUND A CTOR BLOCK: ', ctorStart, ctorEnd);
                }
              }
              if (ctorStart > -1 && ctorEnd > -1) {
                console.log('SPLICE NOW');
                coffeeCode = spliceLinesBelow(lines, topOfClass, ctorStart, ctorEnd);
                coffeeCode = '#fixed constructor order in class\n' + coffeeCode;
                source = coffeeCode;
              }
            }
          }
        }
        var originalSource = source;
        source = source.split('_ ?= window._').join('# Can\'t redefine module values, they are const!! _ ?= window._');
        source = source.split('.defaults').join('.XXXDEFAULTS');
        source = source.split('.default, ').join(', ');
        source = source.split('.default) ').join(') ');
        source = source.split('.default').join('');
        source = source.split('.XXXDEFAULTS').join('.defaults');
        var isAMD = (source.indexOf('define [') !== -1) || (source.indexOf('define ->') !== -1);
        if (isAMD) {
          grunt.verbose.writeln('This module uses RequireJS.', sourceFile);
        }
        var isSpec = (source.indexOf(' describe \'') !== -1);
        var moduleClassName = '';
        var classDeclaration = '';
        var exportLine = '';
        var isClass = source.indexOf('class ') !== -1;
        if (isClass) {
          classDeclaration = source.split('class ')[1].trim();
          classDeclaration = classDeclaration.split(' ')[0];
          moduleClassName = classDeclaration.trim();
          var firstChar = moduleClassName.charAt(0);
          if (firstChar === firstChar.toUpperCase()) {
            grunt.verbose.writeln('This module exports class ' + moduleClassName + '.');
            grunt.verbose.writeln('This module defines a Class.', source.indexOf('class '), sourceFile);
          } else {
            isClass = false;
          }
        }
        if (source.indexOf('Backbone.listenTo') !== -1 && (moduleClassName.indexOf('View') !== -1 || moduleClassName.indexOf('Model') !== -1)) {
          grunt.log.writeln('Using Backbone.listenTo here!', sourceFile);
          source = source.split('Backbone.listenTo').join('this.listenTo');
        }
        if (isAMD && isClass && !isSpec) {
          source = source.trim();
          var lines = source.split('\n');
          var realLines = source.split('\n');
          var lastLine = lines.pop();
          var finalLine = '';
          var nextToLastLine = lines[lines.length - 1];
          if (lastLine.indexOf(':') !== -1 && nextToLastLine.indexOf('->') === -1) {
            var lastLineIndent = getIndent(lastLine);
            var current = lines.length - 1;
            var compoundBlock = lastLine;
            while (true) {
              var someLine = lines[current].toString();
              var originalLine = realLines[current].toString();
              var someIndent = getIndent(someLine);
              if (someIndent !== lastLineIndent) {
                current++;
                if (current < lines.length) {
                  someIndent = getIndent(lines[current]);
                  lines[current] = someIndent + '# Exporting an object here, please fix wrapper: \n' + lines[current];
                }
                break;
              } else {
                compoundBlock = originalLine + ',\n' + compoundBlock;
              }
              current--;
            }
            compoundBlock = compoundBlock.trim();
            if (compoundBlock.length) {
              exportLine = compoundBlock;
            }
          } else if (lastLine.indexOf(moduleClassName) !== -1 && lastLine.indexOf('return ') === -1) {
            var indent = getIndent(lastLine);
            exportLine = indent + 'return ' + lastLine.trim();
            lastLine = '  # Add explicit return to exports:\n' + indent + 'return ' + lastLine.trim();
          } else if (lastLine.indexOf(moduleClassName) !== -1 && lastLine.indexOf('return ') !== -1) {
            exportLine = lastLine;
          } else if (lastLine.indexOf('}') !== -1) {
            exportLine = lastLine;
          } else {
            finalLine = '  # Added explicit return to exports at EOF:\n  return ' + moduleClassName;
            exportLine = 'return ' + moduleClassName;
          }
          lines.push(lastLine);
          if (finalLine.length > 0) {
            lines.push(finalLine);
          }
          lines.push('');
          source = lines.join('\n');
        }
        if (originalSource !== source) {
          grunt.file.write(sourceFile, source);
        }
        return {
          "class": moduleClassName,
          "export": exportLine
        };
      };
      /**
       * runs decaffeinate
       */
      var convertCoffee = function (sourceFile, allowInvalidConstructors) {
        logger.log('convertCoffee', sourceFile);
        var path = require('path');
        var exePath = path.normalize('node_modules/.bin/decaffeinate');
        var exec = require('child_process').exec;
        var cmdLine = exePath;
        logger.log('convertCoffee', 0);
        var amdData = patchCoffeeFile(sourceFile);
        logger.log('convertCoffee', 1);
        var moduleClassName = amdData.class;
        var saveErr = null;
        if (allowInvalidConstructors) {
          cmdLine += ' ' + sourceFile + ' --prefer-const --allow-invalid-constructors';
        } else {
          cmdLine += ' ' + sourceFile + ' --prefer-const';
        }
        grunt.verbose.writeln(cmdLine);
        logger.log('convertCoffee', 2, cmdLine);
        var child = exec(cmdLine, function (error, stdout, stderr) {
          logger.log('convertCoffee', 3);
          //console.log(arguments);
          if (stderr && stderr.indexOf('magicString.insertLeft') === -1) {
            saveErr = stderr;
          }
        });
        /**
         * Close.
         * @param code
         */
        child.on('close', function (code) {
          logger.log('convertCoffee', 4);
          if (code !== 0 || saveErr) {
            // check to see if
            // "Cannot automatically convert a subclass that uses bound methods."
            if (saveErr.indexOf('Cannot automatically convert a subclass that uses bound methods.') !== -1) {
              addToDoItem(sourceFile, 'convertCoffee', saveErr);
              return convertCoffee(sourceFile, true);
            } else if (saveErr.indexOf("Cannot automatically convert a subclass with a") !== -1) {
              addToDoItem(sourceFile, 'convertCoffee', saveErr);
              return convertCoffee(sourceFile, true);
            } else {
              logger.log('decaffeinate process exited with code ' + code);
              grunt.log.errorlns(saveErr);
              //grunt.fail.fatal('Failure in \n' + cmdLine + '\n');
              logger.error('Failure in \n' + cmdLine + '\n');
              decafErrorCount++;
              addToDoItem(sourceFile, 'convertCoffee', saveErr);
            }
          }
          var newFile = sourceFile.split('.coffee').join('.js');
          grunt.file.copy(newFile, newFile + '.decaf.js');
          grunt.file.delete(newFile);
          if (DELETE_COFFEE_FILES && code === 0) {
            grunt.file.delete(sourceFile);
          }
          prebeautify(newFile + '.decaf.js', moduleClassName, amdData.export);
        });
        child.on('error', function (code) {
          logger.log('decaffeinate process errored with code ' + code + ', ' + saveErr);
        });
      };
      var prebeautify = function (sourceFile, moduleClassName, moduleExport) {
        logger.log('prebeautify', sourceFile);
        var path = require('path');
        var exePath = path.normalize('node_modules/.bin/js-beautify');
        var exec = require('child_process').exec;
        var cmdLine = exePath;
        cmdLine += ' ' + sourceFile;
        grunt.verbose.writeln(cmdLine);
        var child = exec(cmdLine, function (error, stdout, stderr) {
          if (stderr) {
            grunt.log.errorlns(stderr);
          }
        });
        /**
         * Close.
         * @param code
         */
        child.on('close', function (code) {
          grunt.verbose.writeln('beautify process exited with code ' + code);
          convertAMD(sourceFile, moduleClassName, moduleExport);
        });
        child.on('error', function (code) {
          grunt.verbose.writeln('beautify process errored with code ' + code);
        });
      };
      var postbeautify = function (sourceFile) {
        logger.log('postbeautify', sourceFile);
        var processor = require('./lib/singleFileProcessor');
        var source = grunt.file.read(sourceFile);
        var originalJSFileName = sourceFile.split('.decaf.js')[0];
        var processingChain = [
          'jsBeautifyProc'
        ];
        processingChain = processor.getProcs(processingChain);
        var options = {
          sourceFile: sourceFile,
          processingChain: processingChain,
          grunt: grunt
        };
        // logger.log('processSingleFile', options);
        processor.processSingleFile(options, function (result) {
          source = result.source;
          grunt.file.write(originalJSFileName, source);
          grunt.file.delete(sourceFile);
          grunt.verbose.writeln('\n');
        });
      };
      var getIndent = function (text) {
        var buffer = '';
        if (text == null) {
          var err = (new Error('getIndent FAILED, input is null'));
          console.error(err.stack);
        }
        text = text.split('');
        for (var index = 0; index < text.length; index++) {
          var char = text[index];
          if (char === ' ') {
            buffer += char;
          }
        }
        return buffer;
      };
      var convertComments = function (input) {
        var lines = input.split('\n');
        var inComment = false;
        var startOfComment = -1;
        for (var index = 0; index < lines.length; index++) {
          var line = lines[index];
          var originalLine = line;
          var indent = getIndent(line);
          line = line.trim();
          if (!inComment && (line.indexOf('//') === 0)) {
            if (lines[index + 1].trim().indexOf('//') === -1) {
              continue;
            }
          }
          if (line.indexOf('//') === 0) {
            line = line.substring(2);
            if (!inComment) {
              startOfComment = index;
              inComment = true;
              line = indent + '/**\n' + indent + ' * ' + line;
            } else {
              line = indent + ' * ' + line;
            }
          } else {
            if (inComment) {
              line = indent + ' */ \n' + line;
              inComment = false;
            } else {
              line = originalLine;
            }
          }
          lines[index] = line;
        }
        lines = lines.join('\n');
        return lines;
      };
      var convertAMD = function (sourceFile, moduleClassName, moduleExport) {
        logger.log('convertAMD', sourceFile);
        var processor = require('./lib/singleFileProcessor');
        var source = grunt.file.read(sourceFile);
        var originalJSFileName = sourceFile.split('.decaf.js')[0];
        var srcPath = grunt.option('project');
        var processingChain = [
          'minFilter',
          'libFilesFilter',
          'jsBeautifyProc',
          'amdProc',
          'exportAMDData',
          //                    'convertCommentsProc',
          'jsDoccerProc',
          'esLintFixProc',
          //'fixES6ModulesProc',
          'fixDecaffeinateProc',
          'generateTestProc',
          'esLintFixProc',
          'jsDocNameFixerProc',
          'fixClassDeclarationsProc',
          'jsDoc3PrepProc',
          'jsBeautifyProc'
          //'generateJavaProc'
        ];
        processingChain = processor.getProcs(processingChain);
        var options = {
          sourceFile: sourceFile,
          processingChain: processingChain,
          moduleClassName: moduleClassName,
          moduleExport: moduleExport,
          baseDirectory: config.files,
          projectRoot: srcPath
        };
        // logger.log('processSingleFile', options);
        processor.processSingleFile(options, function (result) {
          source = result.source;
          grunt.file.write(originalJSFileName, source);
          grunt.file.delete(sourceFile);
          grunt.verbose.writeln('\n');
          lintFix(originalJSFileName);
        });
      };
      var lintFix = function (sourceFile) {
        var path = require('path');
        var exePath = path.normalize('node_modules/.bin/eslint --fix -c .eslintrc.json');
        var exec = require('child_process').exec;
        var cmdLine = exePath;
        cmdLine += ' ' + sourceFile;
        grunt.verbose.writeln(cmdLine);
        var child = exec(cmdLine, function (error, stdout, stderr) {
          if (stderr) {
            grunt.log.errorlns(stderr);
          }
        });
        /**
         * Close.
         * @param code
         */
        child.on('close', function (code) {
          grunt.verbose.writeln('lintFix process exited with code ' + code);
          beautify(sourceFile);
        });
        child.on('error', function (code) {
          grunt.log.writeln('lintFix process errored with code ' + code);
        });
      };
      var beautify = function (sourceFile) {
        var path = require('path');
        var exePath = path.normalize('node_modules/.bin/js-beautify --editorconfig');
        var exec = require('child_process').exec;
        var cmdLine = exePath;
        cmdLine += ' ' + sourceFile;
        grunt.verbose.writeln(cmdLine);
        var child = exec(cmdLine, function (error, stdout, stderr) {
          if (stderr) {
            grunt.log.errorlns(stderr);
          }
        });
        /**
         * Close.
         * @param code
         */
        child.on('close', function (code) {
          grunt.verbose.writeln('lintFix process exited with code ' + code);
          batch();
        });
        child.on('error', function (code) {
          grunt.verbose.writeln('lintFix process errored with code ' + code);
        });
      };
      // THE MAIN LOOP IS HERE //
      var coffeeFiles = [];
      var batch = function () {
        if (coffeeFiles.length === 0) {
          logger.log('Decaffeinate all files DONE. ' + grunt.coffeeScriptLines + ' Lines. Found ', decafErrorCount, ' errors.');
          //printToDolList();
          rollupModuleData(scanPath);
          done();
          return;
        }
        var nextCoffee = coffeeFiles.pop();
        convertCoffee(nextCoffee);
      };
      // TELL US WHERE WE ARE READING FROM
      logger.log('PATH is ', config.files);
      grunt.file.expand({
        filter: 'isFile'
      }, config.files).forEach(function (path) {
        coffeeFiles.push(path);
      });
      if (coffeeFiles.length === 0 && !DELETE_COFFEE_FILES) {
        logger.log('No *.coffee files were found.');
      } else {
        logger.log('About to TRY to decaffeinate ' + coffeeFiles.length + ' files.');
      }
      decafErrorCount = 0;
      batch();
    } catch (ex) {
      logger.error('scrapeAMD: ', ex.stack);
    }
  });
};
