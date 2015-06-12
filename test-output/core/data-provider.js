/**
 * The Class DataProvider. This code is not intended to be a base class as much
 * as template. DataProvider will trigger events based on responses.
 *
 * @author btremblay
 * @version 1.0
 * @updated 25-Apr-2013 3:56:32 PM
 */
define('data-provider', [
  'logger',
  'event',
  'event-dispatch'
], function (
  Logger, Event, EventDispatch) {
  var EVENT_TYPE = 'DAO';
  /**
   * DataProvider
   * .
   * @module DataProvider
   * 
   * @requires logger
   * @requires event
   * @requires event-dispatch
   */
  /**
   * Instantiates a new DataProvider.
   * @class DataProvider
   * @constructor
   * @public
   */
  function DataProvider() {
    this.endpointMap = {};
    this.namespace = '';
  }
  /**
   * Gets the event type for this component.
   * @return {string}
   */
  DataProvider.prototype.getEventType = function () {
    return EVENT_TYPE;
  };
  /**
   * Gets the namespace for this instance of DataProvider.
   * @return {string}
   */
  DataProvider.prototype.getNameSpace = function () {
    return this.namespace;
  };
  /**
   * Initialize the DataProvider. endpointMap follows a format like:
   *  <xmp> {
   *  'putGoodies': {'method':'PUT', 'url':'ajax/stores/goodies', 'type':'json'},
   *  'getMonkeys': {'method':'GET','url':'ajax/stores/monkeys', 'type':'json'},
   *  'getMonkey': {'method':'GET','url':'ajax/stores/monkeys/{monkeyId}', 'type':'json'}
   *  } </xmp>
   * .
   * @param {String} namespace The namespace for this data provider. Used to 
   * @param {Object} endpointMap Key-value pairs of urls mapped to actions.
   */
  DataProvider.prototype.initialize = function (namespace, endpointMap) {
    this.endpointMap = endpointMap;
    this.namespace = namespace;
  };
  /**
   * Executes a DataProvider verb. Note that "verb" is not the same thing as
   *  HTTP Method. This method does not use a callback. The data provider will
   *  fire an event in its namespace.
   * @param {String} verb  
   * @param {Object} parameterMap
   */
  DataProvider.prototype.execute = function (verb, parameterMap) {
    if (this.namespace === '') {
      throw new Error("DataProvider: Can not call execute if not initialized.");
    }
    // get arguments
    // template arguments on endpoint string
    // subscribing to this data provider would look like this:
    //EventDispatch.addEventHandler(myDataProvider.namespace, updateMethod);
    var action = this.endpointMap[verb];
    var url = action.url;
    var method = action.method;
    var type = action.type;
    for (var key in parameterMap) {
      var value = parameterMap[key];
      url = url.split('{' + key + '}').join(encodeURIComponent(value));
    }
    var myself = this;
    $.ajax({
      url: url,
      dataType: type,
      /**
       * Success.
       * @param data
       */
      success: function (data) {
        var event = new Event(myself, verb, data);
        EventDispatch.fireEvent(event);
      },
      /**
       * Error.
       * @param data
       */
      error: function (data) {
        Logger.error("DataProvider: error on " + url);
      }
    });
  };
  return DataProvider;
});