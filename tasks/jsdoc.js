/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
    'use strict';
    var scanPath = null;
    var logger = require('./lib/logger');
    grunt.registerTask('jsdoc', function () {
        function getTitle(sourcePath) {
            try {
                var packageData = grunt.file.readJSON(sourcePath + '/package.json');
                return packageData.name + '@' + packageData.version;
            } catch (e) {
                return '?';
            }
        }

        function runEsdoc(projectPath, sourceDirectory) {
            logger.log('runEsdoc');
            var completion = new Promise(function (resolve, reject) {
                var path = require('path');
                var docPath = projectPath + '/doc/esdoc';

                function dependoHandler() {
                    var title = getTitle(projectPath);
                    var exePath = './node_modules/.bin/esdoc ';
                    var exec = require('child_process').exec;
                    var cmdLine = exePath;
                    grunt.file.mkdir(projectPath + '/doc');
                    var esdocConfig = {
                        "source": projectPath + '/' + sourceDirectory,
                        "destination": docPath,
                        "title": title,
                        "package": projectPath + "/package.json",
                        "index": projectPath + "/README.md"
                    };
                    grunt.file.write('.' + '/esdoc.json', JSON.stringify(esdocConfig));
                    cmdLine += '-c ' + '.' + '/esdoc.json';
                    logger.log(cmdLine);
                    var child = exec(cmdLine, function (error, stdout, stderr) {
                        if (stderr) {
                            console.error(stderr);
                        } else {}
                    });
                    child
                        .on(
                            'close',
                            function (code) {
                                if (code !== 0) {
                                    console
                                        .log('child process "node esdoc" exited with code ' + code);
                                    reject(code);
                                } else {
                                    resolve(0);
                                }
                            });
                }
                try {
                    dependoHandler();
                } catch (e) {
                    logger.log(e.stack);
                }
            });
            return completion;
        }

        function runDependo(projectPath, sourceDirectory) {
            logger.log('runDependo');
            var completion = new Promise(function (resolve, reject) {
                var path = require('path');
                var docPath = projectPath + '/doc';

                function dependoHandler() {
                    var title = getTitle(projectPath);
                    var exePath = './node_modules/.bin/dependo ';
                    var exec = require('child_process').exec;
                    var cmdLine = exePath;
                    grunt.file.mkdir(projectPath + '/doc');
                    var reportPath = projectPath + '/doc/dependo.html';
                    cmdLine += '-t ' + title + ' -f es6 ' + (projectPath + '/' + sourceDirectory) + ' > ' + reportPath;
                    var child = exec(cmdLine, function (error, stdout, stderr) {
                        if (stderr) {
                            console.error(stderr);
                        } else {
                            logger.log(stdout);
                        }
                    });
                    child
                        .on(
                            'close',
                            function (code) {
                                if (code !== 0) {
                                    console
                                        .log('child process "node dependo" exited with code ' + code);
                                    reject(code);
                                } else {
                                    resolve(0);
                                }
                            });
                }
                try {
                    dependoHandler();
                } catch (e) {
                    logger.log(e.stack);
                }
            });
            return completion;
        }

        function runPlato(projectPath, sourceDirectory) {
            logger.log('runPlato');
            var completion = new Promise(function (resolve, reject) {
                var path = require('path');
                var docPath = projectPath + '/doc';

                function platoHandler() {
                    var plato = require('plato');
                    var title = getTitle(projectPath);
                    var files = [];
                    var cb = function callback(abspath, rootdir, subdir, filename) {
                        files.push(abspath);
                    };
                    grunt.file.recurse(projectPath + '/' + sourceDirectory, cb);
                    var outputDir = projectPath + '/doc/plato';
                    var options = {
                        title: title
                    };
                    var callback = function (report) {
                        resolve(0);
                    };
                    plato.inspect(files, outputDir, options, callback);
                }
                try {
                    platoHandler();
                } catch (e) {
                    logger.log(e.stack);
                    reject(e);
                }
            });
            return completion;
        }

        function runJsDoc(projectPath, sourceDirectory, done) {
            logger.log('runJsDoc');
            var rimraf = require('rimraf');
            var path = require('path');
            var docPath = projectPath + '/doc';

            function getContents(source, tag) {
                var tagHunk = source.split('<' + tag + '>')[1];
                tagHunk = tagHunk.split('</' + tag + '>')[0];
                return tagHunk;
            }
            rimraf(
                path.normalize(docPath),
                function jsdocHandler() {
                    runDependo(projectPath, sourceDirectory).then(function (code) {
                        runPlato(projectPath, sourceDirectory).then(function (code) {
                            runEsdoc(projectPath, sourceDirectory).then(function (code) {
                                var USE_HARUKI = false;
                                var exePath = './node_modules/.bin/jsdoc ';
                                var exec = require('child_process').exec;
                                var cmdLine = exePath;
                                var reportPath = projectPath + '/doc/metadata';
                                if (USE_HARUKI) {
                                    cmdLine += ' -r -l -t templates/../../tasks/experimental_template/haruki -d ' + reportPath + '/jsDocModel.json' + ' -q format=json' + ' ' + projectPath + '/' +
                                        sourceDirectory + '';
                                    console.warn('Haruki Duki Du!!!');
                                } else {
                                    cmdLine += ' -r -l -t templates/../../tasks/experimental_template/default -d ' + docPath + '' + ' -q format=json' + ' ' + projectPath + '/' + sourceDirectory +
                                        '';
                                }
                                var child = exec(cmdLine, function (error, stdout, stderr) {
                                    if (stderr) {
                                        console.error(stderr);
                                    } else {
                                        logger.log(stdout);
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
                                            if (code !== 0) {
                                                console
                                                    .log('child process "node jsdoc" exited with code ' + code);
                                            } else {
                                                var metrics = '<iframe frameBorder="0" height="100%" style="zoom: 0.75; width: 99%; min-height:500px;" src="' + projectPath + '/doc/plato/index.html' +
                                                    '"></iframe>';
                                                var mySection = '<section style="height: 600px;">' + metrics + '</section>';
                                                var source = grunt.file.read(projectPath + '/doc/index.html');
                                                var splitter = source.split('<div id="main">');
                                                var chunks = splitter[1].split('</div>');
                                                chunks[0] = chunks[0] + mySection;
                                                splitter[1] = chunks.join('</div>');
                                                source = splitter.join('<div id="main">');
                                                grunt.file.write(projectPath + '/doc/index.html', source);
                                            }
                                            done();
                                        });
                            });
                        });
                    });
                });
        }
        var done = this.async();
        var config = grunt.config('jsdoc').default;
        logger.log(config);
        scanPath = config.scanPath;
        var sourceDirectory = config.sourceDirectory;
        var specDirectory = config.specDirectory;
        runJsDoc(scanPath, sourceDirectory, done);
    });
};