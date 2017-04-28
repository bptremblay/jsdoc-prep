var out = (function getConsole() {
    return this.console;
}());
var gruntInstance = null;
var verbose = false;
var Logger = {
    log: function log() {
        if (verbose) {
            if (gruntInstance) {
                gruntInstance.log.writeln.apply(gruntInstance, arguments);
            } else {
                out.log.apply(console, arguments);
            }
        }
    },
    debug: function debug() {
        if (gruntInstance) {
            gruntInstance.log.writeln.apply(gruntInstance, arguments);
        } else {
            out.log.apply(console, arguments);
        }
    },
    warn: function warn() {
        out.warn.apply(console, arguments);
    },
    error: function error() {
        out.error.apply(console, arguments);
    },
    setGrunt: function (theGrunt) {
        gruntInstance = theGrunt;
    },
    setVerbose: function (enable) {
        verbose = enable;
    }
};
module.exports = Logger;
