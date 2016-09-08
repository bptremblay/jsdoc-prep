var fso; //= new ActiveXObject("Scripting.FileSystemObject");

// UTILITIES - Should put this in a lib. //
function readFile(fileName) {
  var fso, f, ts, s;
  var ForReading = 1,
    ForWriting = 2,
    ForAppending = 3;
  var TristateUseDefault = -2,
    TristateTrue = -1,
    TristateFalse = 0;
  fso = new ActiveXObject("Scripting.FileSystemObject");
  f = fso.GetFile(fileName);
  ts = f.OpenAsTextStream(ForReading, TristateUseDefault);
  s = ts.ReadAll();
  ts.Close();
  return (s);
}

function writeFile(fileName, text) {
  var fso, f, ts, s;
  var ForReading = 1,
    ForWriting = 2,
    ForAppending = 3;
  var TristateUseDefault = -2,
    TristateTrue = -1,
    TristateFalse = 0;
  fso = new ActiveXObject("Scripting.FileSystemObject");
  fso.CreateTextFile(fileName);
  f = fso.GetFile(fileName);
  ts = f.OpenAsTextStream(ForWriting, TristateUseDefault);
  ts.Write(text);
  ts.Close();
}

// need these functions for non-js files!!!
function listTags(data) {
  var scripts = data.split("<script");
  var report = new Array();
  if (scripts.length > 1) {
    var i;
    for (i = 1; i < scripts.length; i++) {
      var script = "<script" + scripts[i];
      var attributes = script.split(">")[0] + ">";
      if (attributes.indexOf("src") == -1) {
        script = script.split("</script>")[0] + "</script>";
        report.push(script);
      }
    }
    return report.join("\r---------\r");
  } else {
    return "NO SCRIPTS FOUND.";
  }
}
var totalTagCount = 0;
var totalFileCount = 0;
var allFiles = new Array();

function exportTags(data, fileName, dontWrite) {
  var scripts = data.split("<script");
  var count = 0;
  var serverTag = "<" + "%";
  var htmlCommentTag = "<!--";
  var htmlCommentEndTag = "-->";
  if (scripts.length > 1) {
    var i;
    for (i = 1; i < scripts.length; i++) {
      var script = scripts[i];
      if (script.indexOf(serverTag) != -1) {
        continue;
      }
      script = script.split(serverTag).join("[@");
      script = script.split("%>").join("@]");
      script = script.split(htmlCommentTag).join("/*@!--*/");
      script = script.split(htmlCommentEndTag).join("/*--@*/");
      var attributes = script.split(">")[0];
      var totalLines = 0;
      script = script.split("</script>")[0];
      var lineCounter = new String(script);
      var lines = lineCounter.split("\r");
      if (lines.length < 2) {
        var lflines = lineCounter.split("\l");
        if (lflines.length > lines.length) {
          lines = lflines;
        }
      }
      totalLines = lines.length;
      if ((attributes.indexOf("src") == -1)) {
        script = script.replace(" = ", "=");
        script = script.replace("= ", "=");
        script = script.replace(" =", "=");
        script = script.split(">")[1];
        var newSrc = fileName + "." + count + ".js";
        writeFile(newSrc, script);
        var slashes = newSrc.split("\\");
        var justFile = slashes[slashes.length - 1];
        script = scripts[i];
        script = script.split(serverTag).join("[@");
        script = script.split("%>").join("@]");
        script = script.split(htmlCommentTag).join("/*@!--*/");
        script = script.split(htmlCommentEndTag).join("/*--@*/");
        script = script.split("</script>")[1];
        script = script.replace(" = ", "=");
        script = script.replace("= ", "=");
        script = script.replace(" =", "=");
        var newScript = " id='" + count + "' src='" + justFile + "'></script>";
        scripts[i] = newScript + script;
        totalTagCount++;
        count++;
      }
    }
    var html = scripts.join("<script");
    if ((!dontWrite) && (count > 0)) {
      html = html.split("[@").join("%>");
      html = html.split("@]").join("%>");
      allFiles.push(fileName);
      writeFile(fileName, html);
      totalFileCount++;
    }
    return "formatted " + count + " files";
  } else {
    return "no scripts in this file";
  }
}

function getFolderList(folderSpec) {
  var i, fc, files = [];
  for (fc = new Enumerator((fso.GetFolder(folderSpec)).subFolders), i = 0; !fc.atEnd(); fc.moveNext()) {
    files[i++] = fc.item();
  }
  return files;
}

function getFileList(folderSpec, filter) {
  var i, fc, files = [];
  for (fc = new Enumerator((fso.GetFolder(folderSpec)).files), i = 0; !fc.atEnd(); fc.moveNext()) {
    if (filter != null) {
      var splitter = fc.item().Name.split(".");
      if (splitter.length < 2) {
        continue;
      }
      var ext = splitter.pop();
      //alert(ext);
      if (("." + ext) == filter) {
        files[i++] = fc.item();
      }
    } else {
      files[i++] = fc.item();
    }
  }
  return files;
}

function ShowFolderList(folderspec) {
  var f, fc, s;
  f = fso.GetFolder(folderspec);
  fc = new Enumerator(f.SubFolders);
  s = "";
  for (; !fc.atEnd(); fc.moveNext()) {
    s += fc.item();
    s += "<br>";
  }
  return (s);
}

function readFile(fileName) {
  var f, ts, s;
  var ForReading = 1,
    ForWriting = 2,
    ForAppending = 3;
  var TristateUseDefault = -2,
    TristateTrue = -1,
    TristateFalse = 0;
  f = fso.GetFile(fileName);
  ts = f.OpenAsTextStream(ForReading, TristateUseDefault);
  s = ts.ReadAll();
  ts.Close();
  return (s);
}

function writeFile(fileName, text) {
  var f, ts, s;
  var ForReading = 1,
    ForWriting = 2,
    ForAppending = 3;
  var TristateUseDefault = -2,
    TristateTrue = -1,
    TristateFalse = 0;
  fso.CreateTextFile(fileName);
  f = fso.GetFile(fileName);
  ts = f.OpenAsTextStream(ForWriting, TristateUseDefault);
  ts.Write(text);
  ts.Close();
}
