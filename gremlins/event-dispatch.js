/**
 * The Class EventDispatch. A global event bus. Not necessary to use Backbone
 * but available to solve some difficult problems including shared data,
 * capturing UI events for monitoring usage, and keeping components lonely.
 * 
 * @author btremblay
 * @version 1.0
 * @created 25-Apr-2013 3:45:15 PM
 */

define(
        'event-dispatch',
        [ 'logger', 'jquery', 'underscore', 'backbone' ],
        function(Logger, $, _, Backbone) {

            var _instance = null;

            var registry = {};
            var suspended = false;

            /**
             * Instantiates a new EventDispatch.
             * 
             * @constructor
             * @public
             */

            function EventDispatch() {
                _.extend(registry, Backbone.Events);
                _log('EventDispatch file loading.');
                EventDispatch.prototype.addHandler = _addHandler;
                EventDispatch.prototype.removeHandler = _removeHandler;
                EventDispatch.prototype.triggerEvent = _triggerEvent;
                EventDispatch.prototype.suspend = _suspend;
                EventDispatch.prototype.resume = _resume;

                EventDispatch.prototype.fireEvent = fireEvent;
                EventDispatch.prototype.fireEventRaw = fireEventRaw;
                EventDispatch.prototype.addEventHandler = addEventHandler;
                EventDispatch.prototype.addEventHandlerOnce = addEventHandlerOnce;
                EventDispatch.prototype.removeEventHandler = removeEventHandler;
                _log('EventDispatch file loaded.');
            }

            /**
             * Add handler.
             * 
             * @private
             * @param eventId
             * @param handlerOwner
             * @param handlerFunction
             */
            function _addHandler(eventId, handlerOwner, handlerFunction) {

                var wrapper = function() {
                    try {
                        handlerFunction.apply(handlerOwner, arguments);
                    } catch (ex) {
                        // TODO: more information.
                        Logger.error('EventDispatch: ' + ex.message);
                    }
                };

                registry.on(eventId, wrapper, handlerOwner);
            }

            /**
             * Remove handler.
             * 
             * @private
             * @param eventId
             * @param handlerOwner
             * @param handlerFunction
             */
            function _removeHandler(eventId, handlerOwner, handlerFunction) {
                registry.off(eventId, handlerFunction, handlerOwner);
            }

            /**
             * Trigger event.
             * 
             * @private
             * @param eventId
             * @param data
             */
            function _triggerEvent(eventId, data) {
                if (suspended) {
                    return;
                }
                // Logger.info("EventDispatch.triggerEvent('" + eventId + "')");
                registry.trigger(eventId, data);
            }

            /**
             * Suspend.
             * @description Suspend event processing.
             */
            function _suspend() {
                suspended = true;
            }

            /**
             * Resume.
             * @description Resume event processing.
             */
            function _resume() {
                suspended = false;
            }

            /**
             * @param msg
             */
            function _log(msg) {
                if (window.Logger != null) {
                    window.Logger.info(msg);
                }
            }

            /**
             * @param instance
             * @param name
             * @param method
             * @param args
             * @param defaultResult
             * @return {Object}
             */
            function _attempt(instance, name, method, args, defaultResult) {
                if (suspended) {
                    return;
                }

                if (defaultResult === undefined) {
                    defaultResult = null;
                }

                try {
                    return method.apply(instance, args);
                } catch (ex) {
                    if (window.Logger != null) {
                        // Logger.error("Error: " + ex.message + "\r\n$(" +
                        // instance.selector + ") handling on" + name + "()\r\n"
                        // + printStackTrace({
                        // e : ex
                        // }).join('\n\n'));

                        Logger.error('Error: ' + ex.message + '\r\n$('
                                + instance.selector + ') handling on' + name
                                + '()\r\n');
                    }
                }

                return defaultResult;
            }

            /**
             * Get instance.
             * 
             * @method _getInstance
             * @private
             */

            function _getInstance() {
                if (_instance === null) {
                    _instance = new EventDispatch();
                }
                window.EventDispatch = _instance;
                return _instance;
            }

            // / new, simple API:

            function fireEvent(event) {
                var eventType = event.namespace;
                try {
                    Logger.info("fireEvent: " + eventType);
                    $(window).trigger(eventType, event);
                } catch (err) {
                    // handle the error
                }
            }

            function fireEventRaw(eventType, data) {
                try {
                    Logger.info("fireEventRaw: " + eventType);
                    $(window).trigger(eventType, data);
                } catch (err) {
                    // handle the error
                }
            }

            function addEventHandler(eventType, handler) {
                $(window).on(eventType, handler);
            }

            function addEventHandlerOnce(eventType, handler) {
                $(window).one(eventType, handler);
            }

            function removeEventHandler(eventType, handler) {
                $(window).off(eventType, handler);
            }

            return _getInstance();
        });
