//==========================================================================
//Copyright: &copy;Wayfair LLC All rights reserved.
//==========================================================================

requirejs.config({
	paths: {
		'jquery': '../infrastructure/jquery/jquery',
		'backbone': '../infrastructure/backbone/backbone-min',
		'underscore': '../infrastructure/backbone/underscore-min',
		'logger': 'logger',
		'stacktrace': '../infrastructure/stacktrace/stacktrace-0.4-min'
	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: [
			       'underscore',
			       'jquery'
			       ],
			       exports: 'Backbone'
		}
	}
});

//define inheritance but it yields no object
define([
        'jquery',
        'underscore',
        'backbone',
        'logger',
        'stacktrace'
        ], function($, _, BackBone, Logger, StackTrace) {
	'use strict';

	var processingChainCheck = [];

	//DO NOT REMOVE THIS LINE
	jQuery.support.cors = true;

	Logger.USE_CONSOLE = false;

	Logger.log(Logger.level.INFO, 'init-toolkit module loaded!');

	var currentToolChain = null;

	$(function() {
		function ToolChain(name, tools) {
			this.name = name;
			this.tools = tools;
		}

		ToolChain.prototype.hasTool = function(toolId) {
			for (var t = 0; t < this.tools.length; t++) {
				var tool = this.tools[t];

				//console.log("hasTool(" + toolId + ") >> " + tool);
				if (tool === toolId) {
					return true;
				}
			}

			return false;
		};

		var toolChains = {};
		toolChains.pluginsToUseInHealthCheckVersionOne = new ToolChain(
				'General Code Health Check', [
				                              'minFilter',
				                              'parseFilter',
				                              'thirdPartyFilter',
				                              'badCharactersProc',
				                              'jsDocNameFixerProc',
				                              //'gsLintProc',
				                              'jsHintProc'
				                              ]);

		toolChains.pluginsToUseToBuildJsDoc = new ToolChain(
				'Generate JS Doc and Verify', [
				                               'minFilter',
				                               'parseFilter',
				                               'thirdPartyFilter',
				                               'badCharactersProc',
				                               'jsBeautifyProc',
				                               'jsDocNameFixerProc',
				                               'jsDoccerProc',
				                               //'polyStyleProc',
				                               'parseFilter',
				                               'jsBeautifyProc'
				                               ]);

		toolChains.pluginsForBen = new ToolChain("Ben's stuff.", [
		                                                          'amdProc',
		                                                          'jsDoccerProc',
		                                                          'jsDocNameFixerProc',
		                                                          'fixClassDeclarationsProc',
		                                                         'jsDoc3PrepProc',
		                                                          'jsBeautifyProc'
		                                                          ]);

		// Handler for .ready() called.

		// Get all the plugins and display them when ready.

		$.ajax({
			url: '/plugins'
		}).done(function(results) {
			if (results.error != null) {
				$('#results').text('ERROR:' + results.error);
				return;
			}
			console.log('got plugins data');

			var pluginsPanel = $('#plugins');
			var builder = [];
			var pluginDictionary = results.results;
			processingChainCheck = [];

			//for (var index = 0;
			//   index < pluginsToUseInHealthCheckVersionOne.length; index++) {
			//   var pluginId = pluginsToUseInHealthCheckVersionOne[index];

			// dump ALL plugins!!!
			for (var pluginId in pluginDictionary) {
				if (pluginDictionary.hasOwnProperty(pluginId)){
					builder.push('<br ' + 'id="' + pluginId + '_break" />');
					builder.push('<span ' + 'id="' + pluginId + '_name"'
							+ ' class="plugin-label">' + pluginId + ':</span>');
					builder.push('<input type = "checkbox" value = "' + pluginId
							+ '" id = "' + pluginId + '"  >');
					builder.push('<span ' + 'id="' + pluginId + '_desc"'
							+ ' class="plugin-description">'
							+ pluginDictionary[pluginId].description + '</span>');
					processingChainCheck.push(pluginId);
				}

			}

			pluginsPanel.html(builder.join('\n'));

			builder = [];

			var toolChainSelector = $('#toolChains');

			for (var toolChainId in toolChains) {
				var toolChain = toolChains[toolChainId];
				builder.push('<option>');
				builder.push(toolChain.name);
				builder.push('</option>');
			}

			toolChainSelector.html(builder.join('\n'));

			toolChainSelector.on('change', function() {
				setToolChain();
			});

			setToolChain();

			function setToolChain() {
				var selection = toolChainSelector.val();
				console.log(selection);

				for (var toolChainId in toolChains) {
					var toolChain = toolChains[toolChainId];

					if (toolChain.name === selection) {
						currentToolChain = toolChain;
						applyToolChain(currentToolChain);
						return;
					}
				}
			}

			function applyToolChain(toolChain) {
				// draw the checkboxes

				for (var pluginId in pluginDictionary) {

					var checkBox = $('#' + pluginId);
					var checked = toolChain.hasTool(pluginId);
					checkBox.prop('checked', checked);

					if (checked) {
						$('#' + pluginId + '_break').show();
						$('#' + pluginId + '_name').show();
						$('#' + pluginId + '_desc').show();
						checkBox.show();
					} else {
						$('#' + pluginId + '_break').hide();
						$('#' + pluginId + '_name').hide();
						$('#' + pluginId + '_desc').hide();
						checkBox.hide();
					}
				}

				// make sure it's runnable

				// processingChainCheck.push(pluginId);
			}

			$('#results').text('Ready.');
		}).fail(function() {
			console.log('error');
		}).always(function() {
			console.log('complete');
		});

		Logger.log(Logger.level.INFO, 'init-toolkit doc.ready!');
	});

	$('#test').on('click', function() {
		$('#results').text('twiddling...');
		// health check recipe

		var processingChain = [];
		var tools = currentToolChain.tools;

		for (var index = 0; index < tools.length; index++) {
			var procId = tools[index];
			var checked = $('#' + procId).prop('checked');

			if (checked) {
				console.log("adding tool '" + procId + "' to chain...");
				processingChain.push(procId);
			}
		}

		var hcOptions = {
				scanPath: $('#path').val(),
				writeEnable: true,
				processingChain: processingChain
		};

		console.log(hcOptions);
		Logger.log(Logger.level.INFO, 'fetch me some data!');

		$.ajax({
			data: {
				'options': JSON.stringify(hcOptions)
			},
			url: '/check'
		}).done(function(results) {
			if (results.error != null) {
				$('#results').text('ERROR:' + results.error);
				return;
			}
			console.log('second success');

			var report = ["Scanned JavaScript in '" + results.path + "'."];
			report.push('Examined ' + results.results.length + ' files.');
			report.push('Completed in ' + results.timeInSeconds + ' seconds.');

			var errorLog = [];
			var fileResults = results.results;
			var totalFilesWithErrors = 0;

			for (var index = 0; index < fileResults.length; index++) {
				var scriptCheckResult = fileResults[index];
				var errs = scriptCheckResult.errors;
				var totalErrors = 0;

				for (var procId in errs) {
					var problems = errs[procId];
					totalErrors += problems.length;
				}

				if (totalErrors > 0) {
					errorLog.push(scriptCheckResult.fileName + ': ' + totalErrors
							+ ' errors found.');
					totalFilesWithErrors++;
				}
			}
			report.push('Found ' + totalFilesWithErrors
					+ ' files with errors (of some kind).');
			report.push(' ');

			report = report.concat(errorLog);

			$('#results').text(report.join('\n'));
		}).fail(function() {
			console.log('error');
		}).always(function() {
			console.log('complete');
		});
	});
});
