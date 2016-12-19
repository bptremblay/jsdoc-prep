var out = (function getConsole() {
  return this.console;
}());
var Logger = {
  log: function log() {
  out.log.apply(console, arguments);
  },
  debug: function debug() {
  out.log.apply(console, arguments);
  },
  warn: function warn() {
    out.warn.apply(console, arguments);
  },
  error: function error() {
    out.error.apply(console, arguments);
  }
};
module.exports = Logger;
