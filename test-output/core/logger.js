/**
 * The Class Logger. Implementation-independent logging interface.
 *
 * @author btremblay
 * @version 1.0
 * @created 25-Apr-2013 3:33:12 PM
 */
define('logger', [], function () {
  //
  var LOG_TO_SERVER = false;
  /**
   * Logger
   *
   * @module Logger The Class Logger. Implementation-independent logging
   *         interface.
   */
  /**
   *The internal reference to the Singleton instance.
   * @private {Logger}
   * @memberOf {Logger}
   */
  var instance = null;
  /**
   *The internal reference to the chosen implementation of the Logger.
   * @private {LoggerImplementation}
   * @memberOf {Logger}
   */
  var implementation = null;
  /**
   * Instantiates a new Logger.
   * @class Logger
   * @constructor
   * @public
   */
  function Logger() {
    //$.get('http://wayfaircom.csnzoo.com/sandbox/dev-logger/dev-logger.php?msg=' + escape(new Date().toDateString()));
    // by default we will ignore trace
    /** The default log level. */
    this.logLevel = this.level.INFO;
    this.implementation = new DefaultLogger();
    /**
     * Call the logger implementation.
     * @memberOf {Logger}
     * @protected
     * @param {Number} logLevel  
     * @param {String} message
     */
    this.implementLog = function (logLevel, message) {
      if (this.enabled && (this.implementation != null)) {
        message = trim(message);
        var levelName = getLevelName(logLevel);
        if (instance.logLevel === instance.level.ALL) {
          this.implementation.log(message, levelName);
        } else if (logLevel >= instance.logLevel) {
          this.implementation.log(message, levelName);
        }
      }
    };
  }
  /**
   * The default log level.
   *
   * @public {Number}
   */
  Logger.prototype.logLevel = 0;
  /**
   * Enabled state of the logger.
   *
   * @public {Boolean}
   */
  Logger.prototype.enabled = false;
  /**
   * Log level enumeration.
   *
   * public {Object}
   */
  Logger.prototype.level = {
    /** NONE is intended to turn off all logging. */
    NONE: -1,
    /**
     * The ALL level has the lowest possible rank and is intended to turn on all
     * logging.
     */
    ALL: 0,
    /**
     * The TRACE Level designates finer-grained informational events than the
     * DEBUG
     */
    TRACE: 1,
    /**
     * The DEBUG Level designates fine-grained informational events that are
     * most useful to debug an application.
     */
    DEBUG: 2,
    /**
     * The INFO level designates informational messages that highlight the
     * progress of the application at coarse-grained level.
     */
    INFO: 3,
    /** The WARN level designates potentially harmful situations. */
    WARN: 4,
    /**
     * The ERROR level designates error events that might still allow the
     * application to continue running.
     */
    ERROR: 5,
    /**
     * The FATAL level designates very severe error events that will presumably
     * lead the application to abort.
     */
    FATAL: 6
  };
  /**
   * Log.
   *
   * @memberOf {Logger}
   * @method log
   * @public
   * @param msg
   */
  Logger.prototype.log = function (msg) {
    this.implementLog(this.level.TRACE, msg);
  };
  /**
   * Trace.
   * @memberOf {Logger}
   * @method trace
   * @public
   * @param msg
   */
  Logger.prototype.trace = function (msg) {
    this.log(msg);
  };
  /**
   * Debug.
   * @memberOf {Logger}
   * @method debug
   * @public
   * @param msg
   */
  Logger.prototype.debug = function (msg) {
    this.implementLog(this.level.DEBUG, msg);
  };
  /**
   * Info.
   * @memberOf {Logger}
   * @method info
   * @public
   * @param msg
   */
  Logger.prototype.info = function (msg) {
    this.implementLog(this.level.INFO, msg);
  };
  /**
   * Warn.
   * @memberOf {Logger}
   * @method warn
   * @public
   * @param msg
   */
  Logger.prototype.warn = function (msg) {
    this.implementLog(this.level.WARN, msg);
  };
  /**
   * Error.
   * @memberOf {Logger}
   * @method error
   * @public
   * @param msg
   */
  Logger.prototype.error = function (msg) {
    this.implementLog(this.level.ERROR, msg);
  };
  /**
   * Instantiates a new DefaultLogger.
   *  This class is built into the Logger class as the default implementation of Logger.
   * @constructor
   * @protected
   */
  function DefaultLogger() {}
  /**
   * Write log to JavaScript console.
   *  Handle contingencies.
   * @memberOf {DefaultLogger}
   * @method implementLog
   * @public
   * @param {String} msg  
   * @param {String} level  
   * @return {String} the formatted message.
   */
  DefaultLogger.prototype.log = function (msg, level) {
    if (msg === null) {
      msg = 'null';
    }
    if (window.console !== undefined) {
      if (window.console.log !== undefined) {
        if (typeof (msg) === 'string') {
          msg = msg.split('<br />').join('\r\n');
        }
        if (level === 'ERROR') {
          if (window.console.error !== undefined) {
            window.console.error(level + ': ' + msg);
          } else {
            window.console.log(level + ': ' + msg);
          }
        } else if (level === 'WARN') {
          if (window.console.warn !== undefined) {
            window.console.warn(level + ': ' + msg);
          } else {
            window.console.log(level + ': ' + msg);
          }
        } else {
          window.console.log(level + ': ' + msg);
        }
      }
    }
    if (LOG_TO_SERVER) {
      //http://wayfaircom.csnzoo.com/sandbox/dev-logger/dev-logger.php
      if (msg.indexOf('PROFILER REPORT') != -1) {
        $.get(YUI_config.app.store_url + '/sandbox/dev-logger/dev-logger.php?msg=' + escape(msg));
      } else {
        $.get(YUI_config.app.store_url + '/sandbox/dev-logger/dev-logger.php?msg=' + escape(level + ': ' + msg));
      }
    }
    return level + ': ' + msg;
  };
  /**
   * Get instance.
   * @memberOf {Logger}
   * @method getInstance
   * @private
   * @return {Logger}
   */
  function getInstance() {
    if (instance === null) {
      instance = new Logger();
      if (LOG_TO_SERVER) {
        window.setTimeout(function () {
          $.get(YUI_config.app.store_url + '/sandbox/dev-logger/dev-logger.php?cmd=reset');
        }, 1);
      }
    }
    if (window.wf == null) {
      window.wf = {};
    }
    window.wf.Logger = instance;
    return instance;
  }
  /**
   * Get level name.
   * @memberOf {Logger}
   * @method getLevelName
   * @private
   * @param levelNum  
   * @return String level name.
   */
  function getLevelName(levelNum) {
    for (var levelName in instance.level) {
      var level = instance.level[levelName];
      if (level === levelNum) {
        return levelName;
      }
    }
  }
  /**
   * trim.
   * @memberOf {Logger}
   * @method trim
   * @private
   * @param {String} input  
   * @return {String} trimmed text.
   */
  function trim(input) {
    if (typeof input == 'string') {
      return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
    }
    return input;
  }
  return getInstance();
});