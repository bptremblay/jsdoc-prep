/**
 * Gruntfile.js.
 */
module.exports = function (grunt) {
    'use strict';
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
                        options: {}
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
                        options: {}
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


    grunt.registerTask('default', ['initConfiguration', 'scrapeAMD:src', 'scrapeAMD:spec', 'jsbeautifier:src', 'jsbeautifier:spec', 'jsdoc']);
    grunt.registerTask('native', ['initConfiguration', 'prepForJsDoc', 'jsdoc']);

};