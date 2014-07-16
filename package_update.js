/**
 * Dump package info, from
 * http://stackoverflow.com/questions/9961502/is-there-a-way-to-automatically-build-the-package-json-file-for-node-js-projects
 */
var fs = require("fs");

function dump() {
	console.log('Gather all package info.');
	var output = {};
	fs.readdir("./node_modules", function(err, dirs) {
		if (err) {
			console.log(err);
			return;
		}
		
		var dirsLen = dirs.length;
		var dirCount = 0;
		console.log('Got dir info for ' + dirsLen + ' files.');
		dirs
				.forEach(function(dir) {

					if (dir.indexOf('.') !== 0) {
						var packageJsonFile = "./node_modules/" + dir
								+ "/package.json";
						if (fs.existsSync(packageJsonFile)) {
							fs.readFile(packageJsonFile, function(err, data) {
								if (err) {
									console.log(err);
								} else {
									var json = JSON.parse(data);
									var packageBlock = { };
									output[json.name] = json.version;
					
									dirCount++;
									if (dirCount === (dirsLen - 1)) {
										console.log('DONE NOW >>>');
										console.log('"dependencies": ' + JSON.stringify(output, null, 2));
									}

								}
							});
						} else {
							console.warn('Could not find: ' + packageJsonFile);
						}
					}
				});
	});

}

dump();