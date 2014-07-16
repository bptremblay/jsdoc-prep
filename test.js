var path = require('path');
var fs = require('fs');
var jswalker = require('./fileSystemProcessor');
var rimraf = require('rimraf');
//
var outPath = 'test-output';
var testPath = 'test-jstests';
var docPath = 'test-jsdocs';
var resultsPath = 'test-results';
var scanPath = 'test-source';

function jswalkerCallback(jswalkerResults) {
	console.log('ALL DONE');

	function runJsDoc(sourceDirectory) {
		
	}

	runJsDoc('test-output');
}

//'jsDoc3PrepProc',

var processingChain = [
// 'trimProc',
'thirdPartyFilter', 'minFilter', 'badCharactersProc',
//'trimProc',
//'amdFilter',
'jsBeautifyProc',
 'amdProc',
 'jsDoccerProc',
'fixJSDocFormattingProc',
//  'jsDocNameFixerProc',
//  //'fixClassDeclarationsProc',
//  'jsDoc3PrepProc',
//  'trimProc',
  'jsBeautifyProc'
];

var opts = {
	callBack : jswalkerCallback,
	scanPath : scanPath,
	writePath : outPath,
	writeTestPath : testPath,
	writeDocPath : docPath,
	writeResultsPath : resultsPath,
	writeEnable : true,
	processingChain : processingChain
};

var justDoc = false;

if (justDoc) {
	jswalkerCallback({});
} else {
	rimraf(outPath, function() {
		jswalker.run({
			callBack : opts.callBack,
			scanPath : opts.scanPath,
			writePath : opts.writePath,
			writeTestPath : opts.writeTestPath,
			writeDocPath : opts.writeDocPath,
			writeResultsPath : opts.writeResultsPath,
			writeEnable : opts.writeEnable,
			processingChain : opts.processingChain
		});
	});
}