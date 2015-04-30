/**
 * @constructor
 * @class HealthCheckServer
 * @returns {HealthCheckServer}
 */
function HealthCheckServer() {

}

/**
 * Based on sample provided here: https://gist.github.com/hectorcorrea A very
 * basic web server in node.js Stolen from: Node.js for Front-End Developers by
 * Garann Means (p. 9-10)
 * 
 * @author btremblay
 * @copyright 2013 btremblay@me.com LLC
 */

var port = 9999;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");
var healthCheck = require('./fileSystemProcessor');
var sfp = require('./singleFileProcessor');
console
		.log("Starting healthcheck web application at " + serverUrl + ":"
				+ port);

/**
 * Create server.
 * 
 * @static
 * @ignore
 * @function
 * @memberOf http
 * @param req
 */
http
		.createServer(
				function(req, res) {

					var now = new Date();

					var filename = req.url;

					if (filename == "/") {
						filename = "/index.html";
					}
					var ext = path.extname(filename);
					var localPath = __dirname;
					console.log(filename);

					var queryStringSplit = filename.split("?");
					filename = queryStringSplit[0];
					var params = "";

					if (queryStringSplit.length > 1) {
						params = queryStringSplit[1];
					}

					// Compare filename to determine endpoint ops.
					// TODO: replace with Backbone.Router.
					if (filename == "/plugins") {
						console.log("Return dictionary of plugins.");
						var contents = {
							"error" : "?"
						};

						try {
							contents = {
								"results" : healthCheck.getPlugins()
							};
						} catch (exception) {
							contents.error = exception.message;
						}

						res.setHeader("Content-Type", "application/json");

						// FIXME: Why doesn't Content-Length work here? The number is too
						// small.
						// res.setHeader("Content-Length", contents.length);

						res.statusCode = 200;
						res.end(JSON.stringify(contents));
						return;
					} else if (filename == "/check") {
						var paramsBlock = {};

						if (params.length > 0) {
							var paramsSplit = params.split("&");

							for (var index = 0; index < paramsSplit.length; index++) {
								var kv = paramsSplit[index];
								kv = kv.split("=");
								paramsBlock[kv[0]] = unescape(kv[1]);
							}
						}

						// console.warn(paramsBlock);
						/**
						 * Completion callback for processor tasks.
						 * 
						 * @inner
						 * @param healthCheckResults
						 */
						function healthCheckCallback(healthCheckResults) {
							console.log("Results are ready.");
							var contents = JSON.stringify(healthCheckResults);

							res.setHeader("Content-Type", "application/json");

							// FIXME: Why doesn't Content-Length work here? The number is
							// too
							// small.
							// res.setHeader("Content-Length", contents.length);

							res.statusCode = 200;
							res.end(contents);
						}

						var outPath = 'test-output';
						var testPath = 'test-jstests';
						var docPath = 'test-jsdocs';
						var resultsPath = 'test-results';

						if (paramsBlock.options != null) {
							var opts = JSON.parse(paramsBlock.options);

							if (opts.processingChain.length === 0) {
								console
										.warn("Error: must have at least one proc in the processing chain.");
								var contents = {
									"error" : "Select at least one processor chain item."
								};

								res.setHeader("Content-Type",
										"application/json");

								res.statusCode = 200;
								res.end(JSON.stringify(contents));
								return;
							}
							healthCheck.run({
								callBack : healthCheckCallback,
								scanPath : opts.scanPath,
								writePath : outPath,
								writeTestPath : testPath,
								writeDocPath : docPath,
								writeResultsPath : resultsPath,
								writeEnable : opts.writeEnable,
								processingChain : opts.processingChain
							});
						} else {
							console.warn(paramsBlock);
							console.warn("Error: invalid request params.");
							var contents = {
								"error" : "no options parameter"
							};

							res.setHeader("Content-Type", "application/json");

							res.statusCode = 200;
							res.end(JSON.stringify(contents));
						}

						return;
					} else if (filename == "/single") {
						var paramsBlock = {};

						if (params.length > 0) {
							var paramsSplit = params.split("&");

							for (var index = 0; index < paramsSplit.length; index++) {
								var kv = paramsSplit[index];
								kv = kv.split("=");
								paramsBlock[kv[0]] = unescape(kv[1]);
							}
						}

						var tempFilePath = 'temp-input/temp.js';
						// console.warn(paramsBlock);
						/**
						 * Completion callback for processor tasks.
						 * 
						 * @inner
						 * @param healthCheckResults
						 */
						function healthCheckCallback(healthCheckResults) {
							console.log("Results are ready.");
							var newSource = sfp.readFile('test-output/temp.js');
							healthCheckResults.source = newSource;
							var contents = (JSON.stringify(healthCheckResults));
							
							
							res.setHeader("Content-Type", "application/json");

							// FIXME: Why doesn't Content-Length work here? The number is
							// too
							// small.
							// res.setHeader("Content-Length", contents.length);

							res.statusCode = 200;
							res.end(contents);
							//console.log(newSource);
						}

						var outPath = 'test-output';
                        var testPath = 'test-jstests';
                        var docPath = 'test-jsdocs';
                        var resultsPath = 'test-results';
                        
                        var realSource = '// Source not found!!!';
                        
                        

						if (paramsBlock.options != null) {
							var opts = JSON.parse(paramsBlock.options);

							if (opts.processingChain.length === 0) {
								console
										.warn("Error: must have at least one proc in the processing chain.");
								var contents = {
									"error" : "Select at least one processor chain item."
								};

								res.setHeader("Content-Type",
										"application/json");

								res.statusCode = 200;
								res.end(JSON.stringify(contents));
								return;
							}
							realSource = unescape(opts.source);
							sfp.writeFile(tempFilePath, realSource);
							
							healthCheck.run({
								callBack : healthCheckCallback,
								scanPath : opts.scanPath,
								writePath : outPath,
								writeTestPath : testPath,
								writeDocPath : docPath,
								writeResultsPath : resultsPath,
								writeEnable : opts.writeEnable,
								processingChain : opts.processingChain
							});
						} else {
							console.warn(paramsBlock);
							console.warn("Error: invalid request params.");
							var contents = {
								"error" : "no options parameter"
							};

							res.setHeader("Content-Type", "application/json");

							res.statusCode = 200;
							res.end(JSON.stringify(contents));
						}

						return;
					} else if (filename == "/getSingleAndCheck") {
                        var paramsBlock = {};
                        var realSource = '// Source not found!!!';

                        if (params.length > 0) {
                            var paramsSplit = params.split("&");

                            for (var index = 0; index < paramsSplit.length; index++) {
                                var kv = paramsSplit[index];
                                kv = kv.split("=");
                                paramsBlock[kv[0]] = unescape(kv[1]);
                            }
                        }

                        var tempFilePath = 'temp-input/temp.js';
                        console.warn('>>>>>>>>> getSingleAndCheck', paramsBlock);
                        /**
                         * Completion callback for processor tasks.
                         * 
                         * @inner
                         * @param healthCheckResults
                         */
                        function healthCheckCallback(healthCheckResults) {
                            console.log("Results are ready.");
                            var newSource = sfp.readFile('test-output/temp.js');
//                            healthCheckResults.source = sfp.readFile(tempFilePath);
                            healthCheckResults.source = realSource;
                            healthCheckResults.processedSource = newSource;
                            var contents = (JSON.stringify(healthCheckResults));
                            
                            
                            res.setHeader("Content-Type", "application/json");

                            // FIXME: Why doesn't Content-Length work here? The number is
                            // too
                            // small.
                            // res.setHeader("Content-Length", contents.length);

                            res.statusCode = 200;
                            res.end(contents);
                            console.log(newSource);
                        }

                        var outPath = 'test-output';
                        var testPath = 'test-jstests';
                        var docPath = 'test-jsdocs';
                        var resultsPath = 'test-results';
                        
                        if (paramsBlock.options != null) {
                            var opts = JSON.parse(paramsBlock.options);

                            if (opts.processingChain.length === 0) {
                                console
                                        .warn("Error: must have at least one proc in the processing chain.");
                                var contents = {
                                    "error" : "Select at least one processor chain item."
                                };

                                res.setHeader("Content-Type",
                                        "application/json");

                                res.statusCode = 200;
                                res.end(JSON.stringify(contents));
                                return;
                            }
                            
                            var realFilePath = opts.file;
                            console.warn('READ THE REAL FILE: ', realFilePath);
                            opts.source = sfp.readFile(realFilePath);
                            
                            realSource = unescape(opts.source);
                            sfp.writeFile(tempFilePath, realSource);

                            healthCheck.run({
                                callBack : healthCheckCallback,
                                scanPath : opts.scanPath,
                                writePath : outPath,
                                writeTestPath : testPath,
                                writeDocPath : docPath,
                                writeResultsPath : resultsPath,
                                writeEnable : opts.writeEnable,
                                processingChain : opts.processingChain
                            });
                        } else {
                            console.warn(paramsBlock);
                            console.warn("Error: invalid request params.");
                            var contents = {
                                "error" : "no options parameter"
                            };

                            res.setHeader("Content-Type", "application/json");

                            res.statusCode = 200;
                            res.end(JSON.stringify(contents));
                        }

                        return;
                    }
					var validExtensions = {
						".html" : "text/html",
						".js" : "application/javascript",
						".json" : "application/json",
						".css" : "text/css",
						".txt" : "text/plain",
						".jpg" : "image/jpeg",
						".gif" : "image/gif",
						".png" : "image/png",
						".ico" : "image/ico"
					};

					var isValidExt = validExtensions[ext];

					if (isValidExt) {

						localPath += filename;
						/**
						 * Local path.
						 * 
						 * @param exists
						 */
						fs.exists(localPath, function(exists) {
							if (exists) {
								// console.log("Serving file: " + localPath);
								getFile(localPath, res, ext);
							} else {
								console.log("File not found: " + localPath);
								res.writeHead(404);
								res.end();
							}
						});
					} else {
						console.log("Invalid file extension detected: "
								+ filename);
					}
				}).listen(port, serverUrl);

/**
 * Get file.
 * 
 * @param localPath
 * @return The file.
 */
function getFile(localPath, res, mimeType) {
	/**
	 * Local path.
	 * 
	 * @param err
	 * @param contents
	 */
	fs.readFile(localPath, function(err, contents) {
		if (!err) {
			res.setHeader("Content-Length", contents.length);
			res.setHeader("Content-Type", mimeType);
			res.statusCode = 200;
			res.end(contents);
		} else {
			res.writeHead(500);
			res.end();
		}
	});
}
