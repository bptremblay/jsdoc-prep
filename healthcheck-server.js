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
 * @copyright 2013 Wayfair LLC
 */

var port = 8000;
var serverUrl = "127.0.0.1";

var http = require("http");
var path = require("path");
var fs = require("fs");
var healthCheck = require('./fileSystemProcessor');

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

						var outPath = '/Users/btremblay/Documents/workspace/js-health-check/processed';
						var testPath = '/Users/btremblay/Documents/workspace/js-health-check/jstests';
						var docPath = '/Users/btremblay/Documents/workspace/js-health-check/jsdocs';
						var resultsPath = '/Users/btremblay/Documents/workspace/js-health-check/results';

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

						var outPath = '/Users/btremblay/Documents/workspace/js-health-check/processed';
						var testPath = '/Users/btremblay/Documents/workspace/js-health-check/jstests';
						var docPath = '/Users/btremblay/Documents/workspace/js-health-check/jsdocs';
						var resultsPath = '/Users/btremblay/Documents/workspace/js-health-check/results';

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
