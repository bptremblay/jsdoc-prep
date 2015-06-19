var path = require('path');
var fs = require('fs');
var healthCheck = require('./fileSystemProcessor');
var rimraf = require('rimraf');

var outPath = 'test-output';
var testPath = 'test-jstests';
var docPath = 'test-jsdocs';
var resultsPath = 'test-results';
var scanPath = 'test-source';
///Users/benjamintremblay/jsdoc-prep
var projectPath = '~/';

function healthCheckCallback(healthCheckResults) {
    console.log('ALL DONE');

    function runJsDoc(sourceDirectory) {

        // var docPath = projectPath + '/jsdoc-prep/test-jsdocs';
        console.log('Delete the test-jsdocs directory? ' + docPath);
        rimraf(
                path.normalize(docPath),
                function() {
                    var USE_HARUKI = false;

                    // console.warn(arguments);
                    // return;

                    // sourceDirectory = path.normalize(sourceDirectory);
                    var exePath = path.normalize(projectPath
                            + '/jsdoc-prep/node_modules/.bin/jsdoc');
                    // console.warn('runJsDoc: ' + exePath + ' <> ' +
                    // sourceDirectory);
                    // $ jsdoc -r -l -d ~/workspace/jsdoc-prep/out
                    // ~/workspace/jsdoc-prep/processed/framework
                    var exec = require('child_process').exec;
                    var cmdLine = exePath;
                    var docPath = projectPath + '/jsdoc-prep/test-jsdocs';
                    var reportPath = projectPath + '/jsdoc-prep/test-results';

                    if (USE_HARUKI) {
                        cmdLine += ' -r -l -t templates/../../experimental_template/haruki -d ' + reportPath + '/jsDocModel.json' + ' -q format=json'
                        + ' ' + sourceDirectory + '';
                    } else {
//                      cmdLine += ' -r -l -d ' + docPath + ' '
//                      + sourceDirectory + '';
                        // exePath + ' -r -l -d ' + projectPath
                        // + '/jsdoc-prep/test-jsdocs ' + sourceDirectory + '';

                        cmdLine += ' -r -l -t templates/../../experimental_template/default -d ' + docPath + '' + ' -q format=json'
                        + ' ' + sourceDirectory + '';
                    }

                    console.log(cmdLine);
                    var child = exec(cmdLine, function(error, stdout, stderr) {
                        // normal
                        if (stderr) {
                            console.error(stderr);
                        } else {
                            console.log(stdout);
                        }
                    });
                    /**
                     * Handler for close event.
                     * 
                     * @function
                     * @name close
                     * @method close
                     * @param code
                     */
                    child
                    .on(
                            'close',
                            function(code) {
                                console
                                .log('child process "node jsdoc" exited with code '
                                        + code);
                            });
                });
    }
    runJsDoc(projectPath + '/jsdoc-prep/test-output');
}
//'jsDoc3PrepProc',
var processingChain = [
                       // 'trimProc',
                       // 'thirdPartyFilter',
                       // 'minFilter',
                       // 'badCharactersProc',
                       // 'trimProc',
                       // 'amdFilter',
//                     'jsBeautifyProc',
                       'JSONFilter',
                       'jsBeautifyProc',
                       'amdProc',
                       'jsDoccerProc',
//                       'jsDocNameFixerProc',
//                       'fixClassDeclarationsProc',
//                       'jsDoc3PrepProc',
                       
                       'jsBeautifyProc',
                      // 'generateJavaProc'
                       ];

//var processingChain = [
//// 'trimProc',
//'thirdPartyFilter',
//'minFilter',
//'badCharactersProc',
////'trimProc',
//'amdFilter',
//'jsBeautifyProc',
//'amdProc',
//'jsDoccerProc',
//'jsBeautifyProc'
//];
var opts = {
        callBack : healthCheckCallback,
        scanPath : scanPath,
        writePath : outPath,
        writeTestPath : testPath,
        writeDocPath : docPath,
        writeResultsPath : resultsPath,
        writeEnable : true,
        processingChain : processingChain,
        modulePaths: {
            'blue': 'blue/js'
        }
};
var justDoc = false;
if (justDoc) {
    healthCheckCallback({});
} else {
    //console.warn(outPath);
    rimraf(outPath, function() {
        healthCheck.run({
            
            modulePaths: opts.modulePaths,
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
}