/**
 * js_test_resources/js/messages.js<br />
 */
define(['jquery', 'logger'],
    /**
     * @exports messages
     * @requires jquery
     */
    function($, Logger) {
        'use strict';
        /** @alias module:messages */
        var exports = {};
        var listeners = {};
        /**
         * Notify.
         *
         * @param what
         * @param data
         */
        exports.notify = function(what, data) {
            var audience = listeners[what];
            if (audience != null) {
                for (var i = 0; i < audience.length; i++) {
                    var observation = audience[i];
                    var listener = observation.listener;
                    Logger.fine("notify: " + observation.what);
                    listener.update(observation, data);
                }
            } else {
                Logger.warn('notify had no listener named ' + what);
            }
        };
        /**
         * Observe.
         *
         * @param what
         * @param who
         * @param listener
         */
        exports.observe = function(what, who, listener) {
            if (listeners[what] == null) {
                listeners[what] = [];
            }
            var observation = {
                what: what,
                who: who,
                listener: listener
            };
            listeners[what].push(observation);
        };
        return exports;
    });
