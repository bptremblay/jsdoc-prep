var path = require('path');
var fs = require('fs');
var healthCheck = require('./fileSystemProcessor');
var rimraf = require('rimraf');
//
var outPath = 'C:\\Users\\btremblay\\workspace\\js-health-check\\processed';
var testPath = 'C:\\Users\\btremblay\\workspace\\js-health-check\\jstests';
var docPath = 'C:\\Users\\btremblay\\workspace\\js-health-check\\jsdocs';
var resultsPath = 'C:\\Users\\btremblay\\workspace\\js-health-check\\results';
var scanPath = 'D:\\code\\resources\\st4\\includes\\js\\amd_modules';

// var scanPath = 'C:\\Users\\btremblay\\workspace\\Html5Charting\\src\\js';

function healthCheckCallback(healthCheckResults) {
  console.log('ALL DONE');

  function runJsDoc(sourceDirectory) {
    rimraf('/Users/btremblay/workspace/js-health-check/jsdocs', function() {
      // sourceDirectory = path.normalize(sourceDirectory);
      var exePath = path.normalize('jsdoc');
      // console.warn('runJsDoc: ' + exePath + ' <> ' + sourceDirectory);
      // $ jsdoc -r -l -d ~/workspace/js-health-check/out
      // ~/workspace/js-health-check/processed/framework
      var exec = require('child_process').exec;
      var cmdLine = exePath + ' -r -l -d /Users/btremblay/workspace/js-health-check/jsdocs '
          + sourceDirectory + '';
      console.log(cmdLine);

      var child = exec(cmdLine, function(error, stdout, stderr) {

        // normal
        console.log(stdout);
        console.error(stderr);
      });
      /**
       * Handler for close event.
       *
       * @function
       * @name close
       * @method close
       * @param code
       */
      child.on('close', function(code) {
        console.log('child process exited with code ' + code);
      });
    });
  }

  runJsDoc('/Users/btremblay/workspace/js-health-check/processed');
}


//'jsDoc3PrepProc',

var processingChain = [
  // 'trimProc',
  'thirdPartyFilter',
  'minFilter',
  'badCharactersProc',
  //'trimProc',
  'amdFilter',
  'jsBeautifyProc',
  'amdProc',
  'jsDoccerProc',
  'jsDocNameFixerProc',
  //'fixClassDeclarationsProc',
  'jsDoc3PrepProc',
  'trimProc',
  'jsBeautifyProc'
  ];

var opts = {
  callBack: healthCheckCallback,
  scanPath: scanPath,
  writePath: outPath,
  writeTestPath: testPath,
  writeDocPath: docPath,
  writeResultsPath: resultsPath,
  writeEnable: true,
  processingChain: processingChain
};

var justDoc = false;

if (justDoc) {
  healthCheckCallback({});
} else {
  rimraf(outPath, function() {
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
}