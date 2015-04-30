define('event', [  ], function() {

  
  /**
   * @constructor
   * @class Event
   * 
   * @param {Object} eventSource
   * @param {string} verb
   * @param {Object} data
   */
  function Event(eventSource, verb, data) {
    this.namespace = eventSource.getNameSpace();
    this.eventType = eventSource.getEventType();
    this.verb = verb;
    this.data = data;
  }

  /**
   * @return {string}
   */
  Event.prototype.toString = function() {
    return JSON.stringify({
      namespace : this.namespace,
      verb : this.verb,
      data : this.data
    });
  };
  return Event;
});
