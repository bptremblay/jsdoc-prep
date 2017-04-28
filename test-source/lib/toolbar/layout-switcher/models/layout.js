(function() {
  /**
   * @param child
   * @param parent
   */
  var extend = function(child, parent) {
      for (var key in parent) {
        if (hasProp.call(parent, key)) child[key] = parent[key];
      }
      /**
       * @function
       */
      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    hasProp = {}.hasOwnProperty;

  define(['backbone'],
    /**
     * @exports src/lib/toolbar/layout-switcher/models/layout
     * @requires backbone
     * @requires backbone
     * @requires underscore
     */
    function(Backbone) {
      var Layout;
      return Layout = (function(superClass) {
        extend(Layout, superClass);
        /**
         * @constructor
         */
        function Layout() {
          return Layout.__super__.constructor.apply(this, arguments);
        }
        return Layout;
      })(Backbone.Model);
    });
}).call(this);
