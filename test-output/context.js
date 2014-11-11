/**
 * @module fluffy/context
 * @requires fluffy/declare
 * @requires fluffy/is
 */
define(function(require) {
  var is = require('./is'),
    Context = require('./declare')( /** @lends module:fluffy/context# */ {
      /**
       * @constructs module:fluffy/context
       * @augments {null}
       *
       * @constructor
       */
      constructor: function Context() {
        /**
         * The parent context.
         * @member {Context} module:context#parent
         */
        /**
         * The first child context.
         * @member {Context} module:context#firstChild
         */
        /**
         * The last child context.
         * @member {Context} module:context#lastChild
         */
        /**
         * The next sibling context.
         * @member {Context} module:context#nextSibling
         */
        /**
         * The previous sibling context.
         * @member {Context} module:context#prevSibling
         */
        this.parent = this.firstChild = this.lastChild = this.nextSibling = this.prevSibling = null;
        /**
         * The context itself.
         * @member {Context} module:context#this
         */
        /**
         * The context itself.
         * @member {Context} module:context#root
         */
        this['this'] = this.root = this;
      },
      /**
       * @function
       * @param {Boolean} [isolate] Whether or not to isolate the child context from the parent context.
       * @return {Context} The child context.
       */
      newChild: function(isolate) {
        var child;
        is.undefined(isolate) && (isolate = false);
        // Create a copy of the parent context
        if (isolate) {
          child = new Context();
          child.root = this.root;
          // Share the parent context
        } else {
          if (!is['function'](this.ChildContext)) {
            /**
             * Creates a new instance of class ChildContext.
             * @constructor
             */
            this.ChildContext = function ChildContext() {
              this.nextSibling = this.firstChild = this.lastChild = null;
            };
          }
          // Properties set on the parent will show up in descendents
          this.ChildContext.prototype = this;
          child = new this.ChildContext();
        }
        child['this'] = child;
        child.parent = this;
        child.prevSibling = this.lastChild;
        if (this.firstChild) {
          this.lastChild.nextSibling = child;
          this.lastChild = child;
        } else {
          this.firstChild = this.lastChild = child;
        }
        return child;
      }
    });
  return Context;
});