//==========================================================================
//Copyright: &copy;Ben Tremblay All rights reserved.
//==========================================================================
requirejs.config({
  paths: {
    'jquery': '../../includes/js/infrastructure/jquery/jquery',
    'backbone': '../../includes/js/infrastructure/backbone/backbone-min',
    'underscore': '../../includes/js/infrastructure/backbone/underscore-min',
    'logger': 'logger-min',
    'stacktrace': '../../includes/js/infrastructure/stacktrace/stacktrace-0.4-min'
  },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  }
});
//define inheritance but it yields no object
define(
    ['jquery', 'underscore', 'backbone', 'logger', 'stacktrace'],
    function ($, _, BackBone, Logger, StackTrace) {
      'use strict';
      var processingChainCheck = [];
      // DO NOT REMOVE THIS LINE
      jQuery.support.cors = true;
      Logger.USE_CONSOLE = false;
      Logger.log(Logger.level.INFO, 'init-toolkit module loaded!');
      var currentToolChain = null;
      $(document)
      .ready(function () {

        listFiles();
        function ToolChain(name, tools) {
          this.name = name;
          this.tools = tools;
        }
        ToolChain.prototype.hasTool = function (toolId) {
          for (var t = 0; t < this.tools.length; t++) {
            var tool = this.tools[t];
            // console.log("hasTool(" + toolId + ")
            // >> " + tool);
            if (tool === toolId) {
              return true;
            }
          }
          return false;
        };
        var toolChains = {};
        toolChains.pluginsToUseInHealthCheckVersionOne = new ToolChain(
            'General Code JsDoc Fixup', [
                                         'minFilter', 'parseFilter',
                                         'thirdPartyFilter',
                                         'badCharactersProc',
                                         'jsDocNameFixerProc',
                                         'gsLintProc', 'jsHintProc']);
        toolChains.pluginsToUseToBuildJsDoc = new ToolChain(
            'Generate JS Doc and Verify', ['minFilter', 'parseFilter',
                                           'thirdPartyFilter',
                                           'badCharactersProc',
                                           'jsBeautifyProc',
                                           'jsDocNameFixerProc',
                                           'jsDoccerProc',

                                           'parseFilter', 'jsBeautifyProc'
                                           ]);
        toolChains.pluginsForBen = new ToolChain("Ben's stuff.", [
                                                                  // 'minFilter',
                                                                  'parseFilter',
                                                                  // 'thirdPartyFilter',
                                                                  'badCharactersProc', 'jsBeautifyProc',
                                                                  'fixMyJsProc',
                                                                  'jsDocNameFixerProc',
                                                                  'jsDoccerProc',
                                                                  'jsBeautifyProc']);
        // Handler for .ready() called.
        // Get all the plugins and display them when
        // ready.
        $.ajax({
          url: '/plugins'
        })
        .done(function (results) {
          if (results.error != null) {
            $('#results')
            .text('ERROR:' + results.error);
            return;
          }
          console.log('got plugins data');
          var pluginsPanel = $('#plugins');
          var builder = [];
          var pluginDictionary = results.results;
          processingChainCheck = [];
          // for (var index = 0;
          // index <
          // pluginsToUseInHealthCheckVersionOne.length;
          // index++) {
          // var pluginId =
          // pluginsToUseInHealthCheckVersionOne[index];
          // dump ALL plugins!!!
          for (var pluginId in pluginDictionary) {
            builder.push('<br ' + 'id="' + pluginId + '_break" />');
            builder.push('<span ' + 'id="' + pluginId + '_name"' +
                ' class="plugin-label">' + pluginId + ':</span>');
            builder.push('<input type = "checkbox" value = "' +
                pluginId + '" id = "' + pluginId + '"  >');
            builder.push('<span ' + 'id="' + pluginId + '_desc"' +
                ' class="plugin-description">' + pluginDictionary[
                                                                  pluginId].description + '</span>');
            processingChainCheck.push(pluginId);
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
          toolChainSelector.on('change', function () {
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
                $('#' + pluginId + '_break')
                .show();
                $('#' + pluginId + '_name')
                .show();
                $('#' + pluginId + '_desc')
                .show();
                checkBox.show();
              } else {
                $('#' + pluginId + '_break')
                .hide();
                $('#' + pluginId + '_name')
                .hide();
                $('#' + pluginId + '_desc')
                .hide();
                checkBox.hide();
              }
            }
            // make sure it's runnable
            // processingChainCheck.push(pluginId);
          }
//        var allFiles = [];
//        allFiles.push('/interactive/scripts/prettify/prettify.js');
//        allFiles.push('/interactive/scripts/prettify/lang-css.js');
          $('#files')
          .on('change', function () {
            var selection = parseInt($(this)
                .val(), 10);
            var file = allFiles[selection];
            loadFile(file);
          });
          $('#results')
          .text('Ready.');
        })
        .fail(function () {
          console.log('error');
        })
        .always(function () {
          console.log('complete');
        });
        Logger.log(Logger.level.INFO, 'init-toolkit doc.ready!');
      });
      $('#test')
      .on('click', function () {
        $('#results')
        .text('twiddling...');
        // JsDoc Fixup recipe
        var processingChain = [];
        var tools = currentToolChain.tools;
        for (var index = 0; index < tools.length; index++) {
          var procId = tools[index];
          var checked = $('#' + procId)
          .prop('checked');
          if (checked) {
            console.log("adding tool '" + procId + "' to chain...");
            processingChain.push(procId);
          }
        }
        var hcOptions = {
            scanPath: $('#path')
            .val(),
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
        })
        .done(function (results) {
          if (results.error != null) {
            $('#results')
            .text('ERROR:' + results.error);
            return;
          }
          console.log('second success');
          var report = ["Scanned JavaScript in '"
                        + results.path
                        + "'."];
          report.push('Examined ' + results.results.length + ' files.');
          report.push('Completed in ' + results.timeInSeconds +
          ' seconds.');
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
              errorLog.push(scriptCheckResult.fileName + ': ' +
                  totalErrors + ' errors found.');
              totalFilesWithErrors++;
            }
          }
          report.push('Found ' + totalFilesWithErrors +
          ' files with errors (of some kind).');
          report.push(' ');
          report = report.concat(errorLog);
          $('#results')
          .text(report.join('\n'));
        })
        .fail(function () {
          console.log('error');
        })
        .always(function () {
          console.log('complete');
        });
      });
    });

function reportJsDoccerProcData(data) {
  report('General Stats: ', 'H4');
  report('Processed about ' + data.lines + ' lines of code.');
  if (data.uses_$) {
    report('Uses jQuery.');
  }
  if (data.uses_alert) {
    report('Uses window.alert()');
  }
  if (data.uses_console_log) {
    report('Uses window.console directly.');
  }
  if (data.is_module) {
    report('A module file, requiring ' + data.requires.length +
    ' other modules.');
  }
  report('Has ' + data.methods.length + ' methods.');
  report('Has ' + data.fields.length + ' data properties.');
}

function loadFile(file) {
  console.warn(file);
  //$('#input').val('// ' + file.path);
  process(file);
}

var rawDoc = null;
function process(pickedFile) {
  var processingChain = ['jsBeautifyProc', 'amdProc',
                         'jsDoccerProc','jsBeautifyProc'];
  var hcOptions = {
      scanPath: 'temp-input',
      writeEnable: true,
      processingChain: processingChain
  };
  // console.warn(processingChain);

  if (pickedFile){
    //alert(JSON.stringify(pickedFile, null, 2));
    hcOptions.file = escape(pickedFile.path);
  }
  else{
    hcOptions.source = escape($('#input')
        .val());
  }
  var url = pickedFile != null ? '/getSingleAndCheck': '/single';
  var options = JSON.stringify(hcOptions);
  $.ajax({
    data: {
      'options': options
    },
    url: url
  })
  .done(function (results) {
    //console.log(results);
    $('#input')
    .val(decodeURI(results.source));
    $('#output')
    .val(decodeURI(results.processedSource));
    $('#report')
    .html('');
    
    if (results.jsDocOutput){
      var raw = unescape(results.jsDocOutput);
      raw = raw.split("<body")[1];
      raw = raw.split("</body>")[0];
      raw = raw.trim();
      raw = raw.split(">");
      raw.shift();
      raw = raw.join(">");
      rawDoc = raw.trim();
      
      
      
      $("#results").html(rawDoc);
      
      var links = $("#results").find("a");
      for (var h = 0; h<links.length; h++){
        var hlink = $(links[h]);
        var theLink = hlink.attr("href");
        theLink = "../test-jsdocs/" + theLink;
        hlink.attr("href", theLink);
      }
    }
    report('Results: ');
    report('Completed in ' + results.timeInSeconds + ' seconds.');
    if (results.results.length) {
      var currentResults = results.results[0];
      var jsDoccerProcData = currentResults.jsDoccerProcData;
      reportJsDoccerProcData(jsDoccerProcData);
      report('General Issues: ', 'H4');
      for (var e in currentResults.errors) {
        console.log(e);
        if (currentResults.errors.hasOwnProperty(e)) {
          var errorList = currentResults.errors[e];
          if (errorList.length > 0) {
            for (var index = 0; index < errorList.length; index++) {
              var error = errorList[index];
              //console.warn(error);
              report(e + ': Line ' + error.line + ', ' + error.reason,
              'i');
              report(error.evidence, 'xmp');
            }
          }
        }
      }
      report('Documentation Issues: ', 'H4');
      // report('Processed about ' + data.lines + ' lines of code.');
    }
  });
  //  $.getJSON('json/data.json', function(json){
  //  processSource(json).then(function(json){
  //  generateDoc(json).then(
  //  function(json){
  //  update(json);
  //  }
  //  )
  //  });
  //  });
}

function report(msg, tag) {
  tag = tag ? tag : 'span';
  var content = $('#report')
  .html();
  if (content.trim()
      .length > 0) {
    content += '<br />';
  }
  content += ('<' + tag + '> ' + msg + ' </' + tag + '>');
  $('#report')
  .html(content);
}

function update(json) {
  $('#input')
  .html(json.input);
  $('#output')
  .html(json.output);
  $('#results')
  .html(json.results);
  $('#report')
  .html(json.report);
}

function processSource(json) {
  var when = new Promise(function (resolve, reject) {
    json.output = json.input.trim()
    .toLowerCase();
    resolve(json);
  });
  return when;
}

function generateDoc(json) {
  var when = new Promise(function (resolve, reject) {
    json.results = '<h1>dummy</h1>';
    resolve(json);
  });
  return when;
}

var allFiles = [];

function listFiles() {
  var processingChain = ['JSONFilter'];
  var hcOptions = {
      scanPath: 'test-source',
      writeEnable: false,
      processingChain: processingChain
  };
  $.ajax({
    data: {
      'options': JSON.stringify(hcOptions)
    },
    url: '/check'
  })
  .done(function (results) {
    allFiles = [];
    if (results.error != null) {
      $('#results')
      .text('ERROR:' + results.error);
      return;
    }
    console.log('second success');
    var report = ["Scanned JavaScript in '"
                  + results.path
                  + "'."];
    report.push('Examined ' + results.results.length + ' files.');
    report.push('Completed in ' + results.timeInSeconds + ' seconds.');
    var errorLog = [];
    var fileResults = results.results;
    var totalFilesWithErrors = 0;
    var filesBrowser = $('#files');
    for (var index = 0; index < fileResults.length; index++) {
      var scriptCheckResult = fileResults[index];
      allFiles.push(scriptCheckResult);

      //console.warn(scriptCheckResult);
      var opt = $('<option value="' + index + '" >' + scriptCheckResult.name + '</option>');
      filesBrowser.append(opt);
    }
    var file = allFiles[0];
    loadFile(file);
  });

}