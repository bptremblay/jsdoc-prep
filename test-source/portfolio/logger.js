/**
 * logger.js
 */
define(['jquery', 'messages'],
    /**
     * @exports logger
     * @requires jquery
     */
    function($, Messages) {
        'use strict';
        /** @alias module:logger */
        var exports = {};

        var VERBOSE = false;

        function log(msg) {
            try {
                if (window.console != null) {
                    window.console.log(msg);
                }
            } catch (e) {
                window.alert(e.message);
            }
        }

        function warn(msg) {
            try {
                if (window.console != null) {
                    window.console.warn(msg);
                }
            } catch (e) {
                window.alert(e.message);
            }
        }

        function error(msg) {
            try {
                if (window.console != null) {
                    window.console.error(msg);
                }
            } catch (e) {
                window.alert(e.message);
            }
        }

        exports.fine = function(msg) {
            if (VERBOSE) {
                log(msg);
            }
        };

        exports.warn = function(msg) {
            warn(msg);
        };

        exports.error = function(msg) {
            error(msg);
        };

        return exports;
    });
