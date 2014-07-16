var path = require('path');
var fs = require('fs');
var healthCheck = require('./fileSystemProcessor');
var rimraf = require('rimraf');
//
var outPath = 'processed';
var testPath = 'jstests';
var docPath = 'jsdocs';
var resultsPath = 'results';
var scanPath = 'test';


function healthCheckCallback(healthCheckResults) {
  console.log('ALL DONE');

  function runJsDoc(sourceDirectory) {
    rimraf('/Users/f558910/workspace/jsdoc-prep/jsdocs', function() {
      // sourceDirectory = path.normalize(sourceDirectory);
      var exePath = path.normalize('jsdoc');
      // console.warn('runJsDoc: ' + exePath + ' <> ' + sourceDirectory);
      // $ jsdoc -r -l -d ~/workspace/jsdoc-prep/out
      // ~/workspace/jsdoc-prep/processed/framework
      var exec = require('child_process').exec;
      var cmdLine = exePath + ' -r -l -d /Users/f558910/workspace/jsdoc-prep/jsdocs '
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

  runJsDoc('/Users/f558910/workspace/jsdoc-prep/processed');
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