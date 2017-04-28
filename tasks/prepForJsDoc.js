/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
    'use strict';
    var scanPath = null;
    var projectRoot = null;
    var logger = require('./lib/logger');
    var readFile = require('./lib/singleFileProcessor').readFile;
    var writeFile = require('./lib/singleFileProcessor').writeFile;
    var rollupModuleData = require('./lib/rollupModuleData').rollupModuleData;
    logger.setGrunt(grunt);
    grunt.registerTask('prepForJsDoc', function () {
        try {
            var done = this.async();
            var config = grunt.config('prepForJsDoc');
            scanPath = config.options.scanPath;
            projectRoot = config.options.scanPath;
          //  console.log(projectRoot);
 // dkkdl()
            var args = this.args;
            if (args.length > 0) {
                config = config[args[0]];
            } else {
                config = config.default;
            }
            var sourceDirectory = config.sourceDirectory;
            var specDirectory = config.specDirectory;
            var path = require('path');
            var fs = require('fs');
            var healthCheck = require('./lib/fileSystemProcessor');
            var rimraf = require('rimraf');
            var outPath = config.outPath;
            var testPath = config.testPath;
            var docPath = config.docPath;
            var resultsPath = config.resultsPath;
            var scanPath = config.scanPath;
            var processingChain = [
                'minFilter',
                'jsBeautifyProc',
                'libFilesFilter',
                'stripCommentsProc',
                'amdProc',
                'exportAMDData',
                //                'convertCommentsProc',
                'jsDoccerProc',
                'esLintFixProc',
                'fixES6ModulesProc',
                //                'fixDecaffeinateProc',
                //'generateJavaProc',

                'generateTestProc',
                'esLintFixProc',

                //'jsDocNameFixerProc',
                //'fixClassDeclarationsProc',
                'jsDoc3PrepProc',
                'jsBeautifyProc'
            ];
            var tallyModules = function () {
                rollupModuleData(scanPath);
                done();
            };
            var opts = {
                callBack: tallyModules,
                scanPath: scanPath,
                writePath: outPath,
                writeTestPath: testPath,
                writeDocPath: docPath,
                writeResultsPath: resultsPath,
                writeEnable: true,
                processingChain: processingChain,
                projectRoot: projectRoot
            };
//            var options = {
//                sourceFile: sourceFile,
//                processingChain: processingChain,
//                moduleClassName: moduleClassName,
//                moduleExport: moduleExport,
//                baseDirectory: config.files,
//                projectRoot: srcPath
//            };
            healthCheck.run({
                callBack: opts.callBack,
                scanPath: opts.scanPath,
                writePath: outPath,
                writeTestPath: testPath,
                writeDocPath: docPath,
                writeResultsPath: resultsPath,
                writeEnable: opts.writeEnable,
                processingChain: opts.processingChain,
                projectRoot: projectRoot
            });
        } catch (ex) {
            logger.error(ex.stack);
        }
    });
};
