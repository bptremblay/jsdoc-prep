/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
    'use strict';
    var logger = require('./tasks/lib/logger');
    var writeFile = require('./tasks/lib/singleFileProcessor').writeFile;
    var setWriteEnable = require('./tasks/lib/singleFileProcessor').setWriteEnable;
    var rollupModuleData = require('./tasks/lib/rollupModuleData').rollupModuleData;
    var scanPath = process.cwd();
    grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('initConfiguration', function () {
        try {
            var sourceDirectory;
            var scanPath;
            var specDirectory;
            var setupConfig = function (grunt) {
                grunt.initConfig({
                    jsdoc: {
                        default: {
                            sourceDirectory: 'src',
                            specDirectory: 'spec',
                            src: ['src/*.js'],
                            options: {
                                destination: 'doc',
                                template: "node_modules/ink-docstrap/template",
                                configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                            }
                        }
                    },
                    'jsbeautifier': {
                        default: {
                            src: [scanPath + '/src/**/*.js']
                        },
                        src: {
                            src: [scanPath + '/src/**/*.js']
                        },
                        spec: {
                            src: [scanPath + '/spec/**/*.js']
                        },
                        options: {}
                    },
                    'scrapeAMD': {
                        src: {
                            files: [scanPath + '/src/**/*.coffee']
                        },
                        spec: {
                            files: [scanPath + '/spec/**/*.coffee']
                        },
                        'engine-src': {
                            files: [scanPath + '/js/app/**/*.coffee']
                        },
                        'engine-spec': {
                            files: [scanPath + '/js/test/**/*.coffee']
                        },
                        default: {
                            files: [scanPath + '/test-source/**/*.coffee']
                        },
                        options: {
                            scanPath: scanPath
                        }
                    },
                    babel: {
                        options: {
                            sourceMap: true,
                            presets: ['es2015'],
                            plugins: ['transform-es2015-modules-amd']
                        },
                        src: {
                            files: [{
                                expand: true,
                                src: ['test-source/**/*.js'],
                                dest: 'temp',
                                ext: '.js'
                            }]
                        },
                        spec: {
                            files: [{
                                expand: true,
                                src: ['test-source/**/*.js'],
                                dest: 'temp',
                                ext: '.js'
                            }]
                        }
                    },
                    prepForJsDoc: {
                        default: {
                            scanPath: scanPath,
                            outPath: scanPath + '/../converted',
                            resultsPath: scanPath + '/..//metadata',
                            testPath: scanPath + '/../test',
                            docPath: scanPath + '/../doc'
                        },
                        src: {
                            scanPath: scanPath + '/src',
                            outPath: scanPath + '/src/../converted',
                            resultsPath: scanPath + '/sr/..//metadata',
                            testPath: scanPath + '/src/../test',
                            docPath: scanPath + '/src/../doc'
                        },
                        spec: {
                            scanPath: scanPath + '/spec',
                            outPath: scanPath + '/spec/../converted',
                            resultsPath: scanPath + '/spec/..//metadata',
                            testPath: scanPath + '/spec/../test',
                            docPath: scanPath + '/spec/../doc'
                        }
                    }
                });
            };
            var applyConfig = function (grunt, scanPath, sourceDirectory, specDirectory) {
                // console.log(scanPath, sourceDirectory, specDirectory);
                grunt.config.merge({
                    jsdoc: {
                        default: {
                            scanPath: scanPath,
                            sourceDirectory: sourceDirectory,
                            specDirectory: specDirectory,
                            src: ['src/*.js'],
                            options: {
                                destination: 'doc',
                                template: "node_modules/ink-docstrap/template",
                                configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                            }
                        }
                    },
                    'jsbeautifier': {
                        default: {
                            src: [scanPath + '/' + sourceDirectory + '/**/*.js']
                        },
                        src: {
                            src: [scanPath + '/' + sourceDirectory + '/**/*.js']
                        },
                        spec: {
                            src: [scanPath + '/' + specDirectory + '/**/*.js']
                        },
                        options: {}
                    },
                    'scrapeAMD': {
                        src: {
                            files: [scanPath + '/' + sourceDirectory + '/**/*.coffee']
                        },
                        spec: {
                            files: [scanPath + '/' + specDirectory + '/**/*.coffee']
                        },
                        'engine-src': {
                            files: [scanPath + '/js/app/**/*.coffee']
                        },
                        'engine-spec': {
                            files: [scanPath + '/js/test/**/*.coffee']
                        },
                        default: {
                            files: [scanPath + '/test-source/**/*.coffee']
                        },
                        options: {
                            scanPath: scanPath
                        }
                    },
                    'pretty': {
                        src: {
                            files: [scanPath + '/' + sourceDirectory + '/**/*.js']
                        },
                        spec: {
                            files: [scanPath + '/' + specDirectory + '/**/*.js']
                        },
                        'engine-src': {
                            files: [scanPath + '/js/app/**/*.js']
                        },
                        'engine-spec': {
                            files: [scanPath + '/js/test/**/*.js']
                        },
                        default: {
                            files: [scanPath + '/test-source/**/*.js']
                        },
                        options: {
                            scanPath: scanPath
                        }
                    },
                    babel: {
                        options: {
                            sourceMap: true,
                            presets: ['es2015'],
                            plugins: ['transform-es2015-modules-amd']
                        },
                        src: {
                            files: [{
                                expand: true,
                                src: [sourceDirectory + '/**/*.js'],
                                dest: 'temp',
                                ext: '.js'
                            }]
                        },
                        spec: {
                            files: [{
                                expand: true,
                                src: [sourceDirectory + '/**/*.js'],
                                dest: 'temp',
                                ext: '.js'
                            }]
                        }
                    },
                    prepForJsDoc: {
                        default: {
                            scanPath: scanPath + '/' + sourceDirectory,
                            outPath: scanPath + '/' + sourceDirectory,
                            resultsPath: scanPath + '/doc/metadata/' + sourceDirectory,
                            testPath: scanPath + '/' + sourceDirectory + '/../test ',
                            docPath: scanPath + '/doc'
                        },
                        src: {
                            scanPath: scanPath + '/' + sourceDirectory,
                            outPath: scanPath + '/' + sourceDirectory,
                            resultsPath: scanPath + '/doc/metadata/' + sourceDirectory,
                            testPath: scanPath + '/' + sourceDirectory + '/../test ',
                            docPath: scanPath + '/doc'
                        },
                        spec: {
                            scanPath: scanPath + '/' + specDirectory,
                            outPath: scanPath + '/' + specDirectory,
                            resultsPath: scanPath + '/doc/metadata/' + specDirectory,
                            testPath: scanPath + '/' + specDirectory,
                            docPath: scanPath + '/doc'
                        },
                        options: {
                            scanPath: scanPath
                        }
                    }
                });
            };
            setupConfig(grunt);
            var srcPath = grunt.option('project');
            if (srcPath) {
                scanPath = srcPath;
            } else {
                grunt.fatal('Please supply -project path.');
            }
            var srcDirectory = grunt.option('source');
            if (srcDirectory) {
                sourceDirectory = srcDirectory;
            } else {
                grunt.fatal('Please supply -source directory name (e.g. js/app).');
            }
            var spcDirectory = grunt.option('spec');
            if (spcDirectory) {
                specDirectory = spcDirectory;
            } else {
                grunt.fatal('Please supply -spec directory name (e.g. js/test).');
            }
            applyConfig(grunt, scanPath, sourceDirectory, specDirectory);
        } catch (ex) {
            console.error(ex.stack);
        }
    });
    grunt.registerTask('default', ['initConfiguration', 'scrapeAMD:src', 'scrapeAMD:spec', /* 'jsbeautifier:src', 'jsbeautifier:spec', */ 'jsdoc', 'printToDolList']);
    grunt.registerTask('native', ['initConfiguration', 'prepForJsDoc', 'jsdoc', 'printToDolList']);
    grunt.registerTask('doc', ['initConfiguration', 'jsdoc']);
    //grunt native -force -project=/Users/btremblay/src/galileo-button-editor/build/dev  -source=src -spec=spec
    var superMap = {};

    function getModuleDependencies(projectPath, srcPath, cb) {
        logger.log('*********** getModuleDependencies ***********');
        logger.log(' ');

        function runTheTask(projectPath, srcPath) {
            logger.log('runTheTask');

            function runTask() {
                var exec = require('child_process').exec;

                function puts(error, stdout, stderr) {
                    console.log(stdout)
                }
                var cmdLine = 'grunt native -force -project=' + projectPath + '/build/dev' + ' -source=src -spec=spec';
                console.log(cmdLine);
                var child = exec(cmdLine, puts);
                child.on('error', function (err) {
                    console.log('child errd with: ' + err);
                });
                child.on('close',
                    function (code) {
                        console.log('child process "node runTask" exited with code ' + code);
                        // get the data
                        var json = grunt.file.readJSON(projectPath + '/build/dev/' + srcPath + '/module-stats.json');
                        for (var index = 0; index < json.length; index++) {
                            var module = json[index];
                            if (superMap[module.name]) {
                                superMap[module.name].count = superMap[module.name].count + module.count;
                            } else {
                                superMap[module.name] = module;
                            }
                        }
                        // munge the data
                        cb(projectPath);
                    });
                child.stdout.on('data', function (d) {
                    console.log('child stdout: ' + d);
                });
            }
            runTask();
        }
        runTheTask(projectPath, srcPath);
    }
    grunt.registerTask('dependencies', function () {
        var done = this.async();
        var projectsCounter = 0;
        var myBaseDirectory = '/Users/btremblay/src/';
        var projectsToCheck = [
            "galileo-action-block-editor",
            "galileo-aloha-text-editor",
            "galileo-artisanal-layout-editor",
            "galileo-basic-image-editor",
            "galileo-build-palette",
            "galileo-button-editor",
            "galileo-color-picker-palette",
            "galileo-column-and-block-layout-editor",
            "galileo-divider-editor",
            "galileo-email-document-editor",
            "galileo-email-footer-layout-editor",
            "galileo-email-header-layout-editor",
            "galileo-email-message-settings-editor",
            "galileo-email-row-layout-editor",
            "galileo-image-palette",
            "galileo-rsvp-editor",
            "galileo-social-button-editor",
            "galileo-spacer-editor",
            "galileo-web-content-editor"
        ];

        function nextBuild() {
            if (projectsCounter < projectsToCheck.length) {
                var project = myBaseDirectory + projectsToCheck[projectsCounter];
                runBuild(project);
                projectsCounter++;
            } else {
                var output = [];
                var map = superMap;
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
                        } else if (m.indexOf('css!') !== -1) {
                            kind = 'LOCAL-CSS';
                        } else if (m.indexOf('text!') !== -1) {
                            kind = 'LOCAL-TEMPLATE';
                        } else if (m.indexOf('i18n!') !== -1) {
                            kind = 'LOCAL-I18N';
                        }
                        if (kind === 'COMMON' || kind === 'ENGINE') {
                            output.push({
                                name: m,
                                count: map[m].count,
                                kind: kind
                            });
                        }
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
                setWriteEnable(true);
                writeFile('./module-stats.json', JSON.stringify(output, null, 2));
                var buffer = [];
                buffer.push("NAME" + ',' + "REFERENCES" + ',' + "LOCATION");
                for (var index = 0; index < output.length; index++) {
                    var record = output[index]
                    buffer.push(record.name + ',' + record.count + ',' + record.kind);
                }
                writeFile('./module-stats' + '.csv', buffer.join('\n'));
                grunt.file.write('./supermap.json', JSON.stringify(superMap, null, 2));
                done();
            }
        }

        function runBuild(projectPath) {
            logger.log('runBuild: ', projectPath);

            function install() {
                var exec = require('child_process').exec;

                function puts(error, stdout, stderr) {
                    logger.log(stdout)
                }
                var cmdLine = 'npm --prefix ' + projectPath + ' install';
                console.log(cmdLine);
                var child = exec(cmdLine, puts);
                child.on('error', function (err) {
                    console.error('child errd with: ' + err);
                });
                child.on('close',
                    function (code) {
                        logger.log('child process "npm install" exited with code ' + code);
                        runTheBuild();
                    });
                child.stdout.on('data', function (d) {
                    logger.log('child stdout: ' + d);
                });
            }

            function runTheBuild() {
                if (false) {
                    var exec = require('child_process').exec;

                    function puts(error, stdout, stderr) {
                        logger.log(stdout)
                    }
                    var cmdLine = 'npm --prefix ' + projectPath + ' run dev-build';
                    console.log(cmdLine);
                    var child = exec(cmdLine, puts);
                    child.on('error', function (err) {
                        console.error('child errd with: ' + err);
                    });
                    child.on('close',
                        function (code) {
                            logger.log('child process "node runBuild" exited with code ' + code);
                            getModuleDependencies(projectPath, 'src', function (path) {
                                logger.log('getModuleDependencies DONE');
                                nextBuild();
                            });
                        });
                    child.stdout.on('data', function (d) {
                        logger.log('child stdout: ' + d);
                    });
                } else {
                    getModuleDependencies(projectPath, 'src', function (path) {
                        logger.log('getModuleDependencies DONE');
                        nextBuild();
                    });
                }

            }
            //install();
            runTheBuild();
        }
        nextBuild();
    });
};
