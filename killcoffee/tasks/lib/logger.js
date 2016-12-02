var out = (function getConsole() {
  return this.console;
}());
var Logger = {
  log: function log() {
  },
  debug: function debug() {
  },
  warn: function warn() {
    out.warn.apply(console, arguments);
  },
  error: function error() {
    out.error.apply(console, arguments);
  }
};
module.exports = Logger;