/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
  'use strict';
  var scanPath = null;
  var logger = require('./lib/logger');
  grunt.registerTask('prepForJsDoc', function () {
    try {
      var done = this.async();
      var config = grunt.config('prepForJsDoc');
      var args = this.args;
      if (args.length > 0) {
        config = config[args[0]];
      } else {
        config = config.default;
      }
      var sourceDirectory = config.sourceDirectory;
      var specDirectory = config.specDirectory;
      config = grunt.config('prepForJsDoc');
      args = this.args;
      if (args.length > 0) {
        config = config[args[0]];
      } else {
        config = config.default;
      }
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
        'amdProc',
        'convertCommentsProc',
        'jsDoccerProc',
        'esLintFixProc',
        'fixES6ModulesProc',
        'fixDecaffeinateProc',
        'esLintFixProc',
        'jsDocNameFixerProc',
        'fixClassDeclarationsProc',
        'jsDoc3PrepProc',
        'jsBeautifyProc'
      ];
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
    } catch (ex) {
      console.error(ex.stack);
    }
  });
};