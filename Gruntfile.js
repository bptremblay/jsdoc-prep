    /**
 * Gruntfile.js.
 *
 * @module gruntfile
 */
/**
 * Exports.
 * @param grunt
 */
module.exports = function (grunt) {
    'use strict';
    var myPath = 'test-source';
    var outputPath = 'test-output';
    var reportPath = 'test-results';
    var docPath = 'test-jsdocs';
    var myFiles = [myPath + '/**/*.js'];
    var myProcessedFiles = [outputPath + '/**/*.js'];
    var _fs = require('fs');
    var _path = require('path');
    var _wrench = require('wrench');
    grunt.initConfig({
        fileList: myFiles,
        jsbeautifier: {
            files: myProcessedFiles,
            options: {
                indent_size: 2,
                wrap_line_length: 200
            }
        },
        fixmyjs: {
            options: {},
            my_stuff: {
                files: [{
                    expand: true,
                    cwd: myPath,
                    src: ['**/*.js'],
                    dest: myPath,
                    ext: '.js'
            }]
            }
        },
        prepForJsDoc: {
            scanPath: myPath,
            outPath: outputPath,
            resultsPath: reportPath + '/metadata',
            testPath: reportPath + '/test',
            docPath: docPath
        },
        doc: {
            scanPath: myPath,
            outPath: outputPath,
            resultsPath: reportPath,
            docPath: docPath
        },
        plato: {
            custom_complexity_v2: {
                options: {
                    jshint: grunt.file.readJSON('.jshintrc'),
                    complexity: {
                        logicalor: false,
                        switchcase: false,
                        forin: true,
                        trycatch: true,
                        newmi: true
                    }
                },
                src: [myProcessedFiles],
                dest: reportPath + '/platonic'
            }
        }
    });
    grunt.registerTask('beautify', ['jsbeautifier']);

    grunt.registerTask('doc', function () {
        var config = grunt.config('doc');
        var path = require('path');
        var fs = require('fs');
        var rimraf = require('rimraf');
        var outPath = config.outPath;
        var docPath = config.docPath;
        var USE_HARUKI = false;


        /**
         * Run js doc.
         * @param gruntInstance
         * @param sourceDirectory
         */

        function runJsDoc(gruntInstance, sourceDirectory) {
            var done = gruntInstance.async();

            rimraf(docPath, function () {
                var exePath = path.normalize('node_modules/.bin/jsdoc');
                var exec = require('child_process').exec;
                var cmdLine = exePath;
                if (USE_HARUKI) {
                    cmdLine += ' -r -l -t templates/haruki -d console -q format=json' + ' ' + sourceDirectory + '';
                } else {
                    cmdLine += ' -r -l -d ' + docPath + ' ' + sourceDirectory + '';
                }
                console.log(cmdLine);

                var child = exec(cmdLine, function (error, stdout, stderr) {
                    console.error(stderr);
                });

                /**
                 * Close.
                 * @param code
                 */
                child.on('close', function (code) {
                    console.log('child process exited with code ' + code);
                    done();
                });
            });
        }
        runJsDoc(this, outPath);
    });

    grunt.registerTask('prepForJsDoc', function () {
        var config = grunt.config('prepForJsDoc');
        var path = require('path');
        var fs = require('fs');
        var healthCheck = require('./fileSystemProcessor');
        var rimraf = require('rimraf');
        var outPath = config.outPath;
        var testPath = config.testPath;
        var docPath = config.docPath;
        var resultsPath = config.resultsPath;
        var scanPath = config.scanPath;
        var processingChain = [
          'badCharactersProc',
          'jsBeautifyProc',
          'amdProc',
          'jsDoccerProc',
          'jsBeautifyProc',
          'jsDoc3PrepProc',
          'jsBeautifyProc',
          'fixJSDocFormattingProc',
          'jsBeautifyProc'
        ];
        var done = this.async();
        var opts = {
            callBack: done,
            scanPath: scanPath,
            writePath: outPath,
            writeTestPath: testPath,
            writeDocPath: docPath,
            writeResultsPath: resultsPath,
            writeEnable: true,
            processingChain: processingChain
        };

        rimraf(outPath, function () {
            healthCheck.run({
                callBack: opts.callBack,
                scanPath: opts.scanPath,
                writePath: outPath,
                writeTestPath: testPath,
                writeDocPath: docPath,
                writeResultsPath: resultsPath,
                writeEnable: opts.writeEnable,
                processingChain: opts.processingChain
            });
        });
    });


    /**
     * Read file.
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
            source = '';
        }
        return source;
    }


    /**
     * Safe create file dir.
     * @param path
     */

    function safeCreateFileDir(path) {
        var dir = _path.dirname(path);
        if (!_fs.existsSync(dir)) {
            _wrench.mkdirSyncRecursive(dir);
        }
    }


    /**
     * Safe create dir.
     * @param dir
     */

    function safeCreateDir(dir) {
        if (!_fs.existsSync(dir)) {
            _wrench.mkdirSyncRecursive(dir);
        }
    }


    /**
     * Write file.
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
     * @param input
     */

    function trim(input) {
        return input.trim();
    }
    var firstDoclet = null;


    /**
     * Camelize.
     * @param input
     */

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


    /**
     * Capitalize.
     * @param input
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
    grunt.registerTask('hintfix', ['fixmyjs']);
    grunt.registerTask('default', [
        'beautify',
        'prepForJsDoc',
        'beautify',
        'doc'
      ]);
    grunt.loadNpmTasks('grunt-fixmyjs');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jsbeautifier');
};