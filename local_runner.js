var path = require('path');
var fs = require('fs');
var healthCheck = require('./fileSystemProcessor');
var rimraf = require('rimraf');
var outPath = 'test-output';
var testPath = 'test-jstests';
var docPath = 'test-jsdocs';
var resultsPath = 'test-results';
var scanPath = 'test-source';
var readFile = require('./singleFileProcessor').readFile;
var writeFile = require('./singleFileProcessor').writeFile;
var exportedProcs = require('./singleFileProcessor').plugins;
///Users/benjamintremblay/jsdoc-prep
var projectPath = process.cwd();
//console.log(exportedProcs);
// /Users/btremblay/jsdoc-prep
// /Users/btremblay/
function rollupModuleData() {
    var map = {};
    var data = JSON.parse(readFile('./modules.json'));
    for (var m in data) {
        if (data.hasOwnProperty(m)) {
            var sourceModule = data[m].requires;
            //console.log(m, sourceModule);
            for (var dm in sourceModule) {
                if (sourceModule.hasOwnProperty(dm)) {
                    var dependency = sourceModule[dm];
                    var hash = map[dm];
                    if (hash) {
                        var count = hash + 1;
                        map[dm] = count;
                    } else {
                        map[dm] = 1;
                    }
                    //console.log(dm, map[dm]);
                }
            }
        }
    }
    var output = [];
    for (var m in map) {
        if (map.hasOwnProperty(m)) {
            //console.log(m);
            var kind = '?';
            if (m.indexOf('-path/') !== -1) {
                kind = 'LOCAL';
            } else if (m.indexOf('/') === -1 || m.indexOf('plugins/') !== -1 || m.indexOf('uiBasePath') !== -1) {
                kind = 'COMMON';
            } else if (m.indexOf('galileo-lib') !== -1) {
                kind = 'ENGINE';
            }
            //          else if (m.indexOf('css!') !== -1) {
            //                kind = 'LOCAL-CSS';
            //            } else if (m.indexOf('text!') !== -1) {
            //                kind = 'LOCAL-TEMPLATE';
            //            } else if (m.indexOf('i18n!') !== -1) {
            //                kind = 'LOCAL-I18N';
            //            }
            output.push({
                name: m,
                count: map[m],
                kind: kind
            });
        }
    }
    output = output.sort(function compare(a, b) {
        if (a.kind < b.kind) {
            return 1;
        } else if (a.kind > b.kind) {
            return -1;
        } else {
            if (a.count < b.count) {
                return 1;
            } else if (a.count > b.count) {
                return -1;
            }
        }
        return 0;
    });
    writeFile('./module-stats.json', JSON.stringify(output, null, 2));
    var buffer = [];
    for (var index = 0; index < output.length; index++) {
        var record = output[index]
        buffer.push(record.name + ',' + record.count + ',' + record.kind);
    }
    writeFile('./module-stats.csv', buffer.join('\n'));
}

function healthCheckCallback(healthCheckResults) {
    rollupModuleData();
    console.log('ALL DONE');

    function runJsDoc(sourceDirectory) {
        // var docPath = projectPath + '/test-jsdocs';
        console.log('Delete the test-jsdocs directory? ' + docPath);
        rimraf(
            path.normalize(docPath),
            function () {
                var USE_HARUKI = false;
                // console.warn(arguments);
                // return;
                // sourceDirectory = path.normalize(sourceDirectory);
                var exePath = path.normalize(projectPath + '/node_modules/.bin/jsdoc');
                // console.warn('runJsDoc: ' + exePath + ' <> ' +
                // sourceDirectory);
                // $ jsdoc -r -l -d ~/workspace/jsdoc-prep/out
                // ~/workspace/jsdoc-prep/processed/framework
                var exec = require('child_process').exec;
                var cmdLine = exePath;
                var docPath = projectPath + '/test-jsdocs';
                var reportPath = projectPath + '/test-results';
                if (USE_HARUKI) {
                    cmdLine += ' -r -l -t templates/../../experimental_template/haruki -d ' + reportPath + '/jsDocModel.json' + ' -q format=json' + ' ' + sourceDirectory + '';
                    console.warn('Haruki Duki Du!!!');
                } else {
                    //                      cmdLine += ' -r -l -d ' + docPath + ' '
                    //                      + sourceDirectory + '';
                    // exePath + ' -r -l -d ' + projectPath
                    // + '/test-jsdocs ' + sourceDirectory + '';
                    cmdLine += ' -r -l -t templates/../../experimental_template/default -d ' + docPath + '' + ' -q format=json' + ' ' + sourceDirectory + '';
                }
                console.log(cmdLine);
                var child = exec(cmdLine, function (error, stdout, stderr) {
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
                        function (code) {
                            console
                                .log('child process "node jsdoc" exited with code ' + code);
                        });
            });
    }
    runJsDoc(projectPath + '/test-output');
}
//'jsDoc3PrepProc',
var processingChain = [
    // 'trimProc',
    // 'thirdPartyFilter',
    'minFilter',
    // 'badCharactersProc',
    // 'trimProc',
    // 'amdFilter',
    //                     'jsBeautifyProc',
    //'JSONFilter',
    'jsBeautifyProc',
    'stripCommentsProc',
    // 'fixMyJsProc',
    //'splitModulesProc',
    'amdProc',
    'exportAMDData',
    'jsDoccerProc',
    'esLintFixProc',
    //   'fixES6ModulesProc',
    //   'fixDecaffeinateProc',
    'esLintFixProc',
    'jsDocNameFixerProc',
    'fixClassDeclarationsProc',
    'jsDoc3PrepProc',
    'jsBeautifyProc'
    //'generateJavaProc'
];
//console.log(processingChain);
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
    callBack: healthCheckCallback,
    scanPath: scanPath,
    writePath: outPath,
    writeTestPath: testPath,
    writeDocPath: docPath,
    writeResultsPath: resultsPath,
    writeEnable: true,
    processingChain: processingChain,
    modulePaths: {
        'blue': 'blue/js'
    }
};
//console.log(cwd);
//console.log(projectPath);
var justDoc = false;
if (justDoc) {
    healthCheckCallback({});
} else {
    //console.warn(outPath);
    rimraf(outPath, function () {
        healthCheck.run({
            modulePaths: opts.modulePaths,
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
