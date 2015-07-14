/**
 * @module ben
 * @requires rethinkdb
 * @requires fs
 * @requires path
 * @requires wrench
 */
var r = require('rethinkdb');
var _fs = require('fs');
var _path = require('path');
var _wrench = require('wrench');
// Stub out a standard config object.
var config = {};
config.rethinkdb = {
  host: '10.64.253.25',
  port: 8090,
  db: '',
  authKey: ''
};
var _rdbConn = null;
// Name of source DB
var source = "QA_DA_TEST";
// Name of destination DB
var destination = "perfhub_ben_test";
// List of file/table names used when reading from JSON. TODO: make this dynamic
var tableFileList = JSON.parse(readFile('tables.json'));
var JSON_FOLDER = 'seed_data';
var JSON_FILE_SUFFIX = '';
// Set this to true or false to either serialize or deserialize data.
var DUMP_TO_FILES = true;

/**
 * Create/populate tables from a source database.
 * @param r
 * @param conn
 * @param cb
 */
function createTablesFromDB(r, conn, cb) {
  console.log('createTables 0');
  // List tables.
  r.db(source).tableList().run(conn, function (err, res) {
    if (err) {
      throw err;
    }
    console.log('createTables: Create these tables:\n', res);
    var completionCount = 0;
    for (var t = 0; t < res.length; t++) {
      var func = function (tableName) {
        console.log('createTables: Creating "' + tableName + '".');
        r.db(destination).tableDrop(tableName).run(conn, function () {
          // might fail... does it
          // matter?
          r.db(destination).tableCreate(tableName).run(conn, function (err, newTable) {
            if (err) {
              console.warn(err.message);
            }
            console.log('createTables: Created "' + newTable.config_changes[0].new_val.name + '".');
            r.db(destination).table(tableName).insert(r.db(source).table(tableName)).run(conn, function (err, rez) {
              if (err) {
                throw err;
              }
              console.log('Inserted data for ' + tableName);
              completionCount++;
              if (completionCount === res.length) {
                cb(done);
              }
            });
          });
        });
      };
      // Closure for table name variable.
      func(res[t]);
    }
  });
}
/**
 * Create JSON files from tables.
 * @param r
 * @param conn
 * @param cb
 */
function createJSONFromTables(r, conn, cb) {
  console.log('createJSONFromTables 0');
  // List tables.
  r.db(source).tableList().run(conn, function (err, res) {
    if (err) {
      throw err;
    }
    console.log('createJSONFromTables: Create JSON from these tables:\n', res);
    writeFile('tables.json', JSON.stringify(res, null, 2));
    var completionCount = 0;
    for (var t = 0; t < res.length; t++) {
      var func = function (tableName) {
        var jsonFileName = tableName + JSON_FILE_SUFFIX + '.json';
        //console.log('createJSONFromTables: Create "' + jsonFileName + '".');
        r.db(source).table(tableName).run(conn, function (err, cursor) {
          console.log('createJSONFromTables: Creating "' + jsonFileName + '".');
          if (err) {
            throw err;
          }
          cursor.toArray(function (err, result) {
            if (err) {
              throw err;
            }
            var jsonOutput = JSON.stringify(result, null, 2);
            writeFile(JSON_FOLDER + '/' + jsonFileName, jsonOutput);
            completionCount++;
            if (completionCount === res.length) {
              cb(done);
            }
          });
        });
      };
      // Closure for table name variable.
      func(res[t]);
    }
  });
}
/**
 * Create tables from JSON files.
 * @param res
 * @param r
 * @param conn
 * @param cb
 */
function createTablesFromJSON(res, r, conn, cb) {
  console.log('createTables 0');
  console.log('createTables: Create these tables:\n', res);
  var completionCount = 0;
  for (var t = 0; t < res.length; t++) {
    /**
     * Func.
     * @param tableName
     */
    var func = function (tableName) {
      console.log('createTables: Creating "' + tableName + '".');
      r.db(destination).tableDrop(tableName).run(conn, function () {
        // might fail... does it matter?
        r.db(destination).tableCreate(tableName).run(conn, function (err, newTable) {
          if (err) {
            console.warn(err.message);
          }
          console.log('createTables: Created "' + newTable.config_changes[0].new_val.name + '".');
          var newData = readFile(JSON_FOLDER + '/' + tableName + JSON_FILE_SUFFIX + '.json');
          var newJSON = JSON.parse(newData);
          r.db(destination).table(tableName).insert(newJSON).run(conn, function (err, rez) {
            if (err) {
              throw err;
            }
            console.log('Inserted data for ' + tableName);
            completionCount++;
            if (completionCount === res.length) {
              cb(done);
            }
          });
        });
      });
    };
    // Closure for table name variable.
    func(res[t]);
  }
}
/**
 * Done.
 */
function done() {
  _rdbConn.close();
  console.log("ALL DONE");
}
/**
 * Main.
 */
function main() {
  config.rethinkdb.db = 'perfhub_ben';
  r.connect(config.rethinkdb, function (err, conn) {
    if (err) {
      throw err;
    }
    _rdbConn = conn;
    if (DUMP_TO_FILES) {
      createJSONFromTables(r, conn, done);
    } else {
      createTablesFromJSON(tableFileList, r, conn, done);
    }
  });
}
// ///////////////////// UTILITY METHODS ////////////////////////
/**
 * Read file.
 * @name readFile
 * @method readFile
 * @param filePathName
 * @todo Please describe the return type of this method.
 * @return {String}
 */
function readFile(filePathName) {
  var _fs = require('fs');
  var _path = require('path');
  var FILE_ENCODING = 'utf8';
  filePathName = _path.normalize(filePathName);
  var source = '';
  try {
    source = _fs.readFileSync(filePathName, FILE_ENCODING);
  } catch (er) {
    // logger.error(er.message);
    source = '';
  }
  return source;
}
/**
 * Safe create file dir.
 * @name safeCreateFileDir
 * @method safeCreateFileDir
 * @param path
 */
function safeCreateFileDir(path) {
  var dir = _path.dirname(path);
  if (!_fs.existsSync(dir)) {
    // // // logger.log("does not exist");
    _wrench.mkdirSyncRecursive(dir);
  }
}
/**
 * Safe create dir.
 * @name safeCreateDir
 * @method safeCreateDir
 * @param dir
 */
function safeCreateDir(dir) {
  if (!_fs.existsSync(dir)) {
    // // // logger.log("does not exist");
    _wrench.mkdirSyncRecursive(dir);
  }
}
/**
 * Write file.
 * @name writeFile
 * @method writeFile
 * @param filePathName  
 * @param source
 */
function writeFile(filePathName, source) {
  filePathName = _path.normalize(filePathName);
  safeCreateFileDir(filePathName);
  _fs.writeFileSync(filePathName, source);
}
// ///////////////////////// LASTLY, CALL MAIN //////////////////////////
main();

