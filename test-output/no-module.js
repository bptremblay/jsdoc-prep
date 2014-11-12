/**
 * js_test_resources/fronum.js
 *
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */
// one-line comment at top
/* jshint eqnull: true, boss: true */
/**
 * Creates a new instance of class Fronum.
 * @constructor
 */
function Fronum() {
  /**
   * Chew bakka.
   * @return {Function}
   */
  this.chewBakka = function() {
    /**
     * Creates a new instance of class DonutView.
     * @constructor
     */
    return function DonutView() {
      return Fronum.prototype;
    };
  };
  /*
   * This function is stupid.
   */
  /**
   * The function is stupid but the comment is a valid doclet.
   * @todo Please describe the return type of this method.
   * @return {Object} ??
   */
  this["stupidFunction"] = function() {
    // some stupid line comment
    var output = 100;
    output++;
    return output;
  };
  /**
   * @private
   * @param a
   * @param {Banana}
   * @param {Boolean}
   * @return {String}
   */
  var privateFunction = function(a, b, c) {
    // build the super return value
    return 'hodag zero';
  };
}
// try to confuse the parser with some comment
/**
 * @param toothache
 * @param tomato
 * @todo Please describe the return type of this method.
 * @return {Object} ??
 */
Fronum.prototype.worldPuzzle = function(toothache, tomato) {
  var x = 0;
  return x - 100;
};
/**
 * Creates a new instance of class SecondClass.
 * @constructor
 */
function SecondClass() {}
/**
 * Fix the world.
 * @param toothache
 * @param tomato
 * @todo Please describe the return type of this method.
 * @return {Object} ??
 */
SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
  return /** @lends module:blue/component# */ {
    /**
     * @constructs module:blue/component
     * @constructor
     * @param {PlainObject} options
     */
    constructor: function Component(cfgModel, options) {
      if (!is.plainObject(this.spec)) {
        throw new TypeError('Component spec is undefined');
      }
      // Check for name
      if (!is.string(this.spec.name)) {
        throw new TypeError('Invalid Component name "' + this.spec.name + '"');
      }
      this.name = camelCase(this.spec.name);
      if (cfgModel && !(cfgModel instanceof observable.Property)) {
        options = cfgModel;
        cfgModel = undefined;
      }
      this.id = '<#' + this.name + 'Component:' + (++uuid) + '>';
      this.settings = merge({}, defaults, options || {});
      // this.model = cfgModel || observable.Model( this.settings.model || {} );
      this.model = cfgModel || (this.settings.model instanceof observable.Property ? this.settings.model : observable.Model(this.settings.model || {}));
      this.queue = [];
      this.output = new EventChannel({
        eventTarget: this
      });
      this.output.start();
      this.__enabled = false;
      // Collect events while disabled
      this.output['export']()
      // Only collect if disabled
      .filter(function(event) {
        return !this.__enabled;
      }.bind(this))
      // Push events to queue
      .scan(this.queue, function(queue, event) {
        // console.info( 'adding event to queue:', event );
        queue.push(event);
        return queue;
      })
        .onValue(function() {});
      // Object.defineProperty( this, 'enabled', {
      //  get: function(){
      //      return is.defined( this.input );
      //  },
      //  // set: function( input ){
      //  //  this.enable( input );
      //  // },
      //  enumerable: true,
      //  configurable: true
      // } );
      // Create Actions
      is.plainObject(this.spec.actions) && Object.keys(this.spec.actions).forEach(this.createAction, this);
      // Create States
      is.plainObject(this.spec.states) && Object.keys(this.spec.states).forEach(this.createState, this);
      // Create Data
      is.plainObject(this.spec.data) && Object.keys(this.spec.data).forEach(this.createData, this);
      // TODO: how to set autoStart when enabling requires "input" parameter
      // this.settings.autoStart && ( this.__enabled = true );
      // if ( this.__enabled ){
      //  console.info( 'auto-starting component' );
      //  this.enable( new EventChannel() );
      // }
      is['function'](this.init) && this.init();
      this.output.emit('init', {});
    },
    foo: 100
  };
};