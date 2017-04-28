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

  define(['backbone', 'toolbar/layout-switcher/models/layout'],
    /**
     * @exports src/lib/toolbar/layout-switcher/models/layout-family
     * @requires backbone
     * @requires toolbar/layout-switcher/models/layout
     * @requires underscore
     */
    function(Backbone, Layout) {
      var LayoutFamily;
      return LayoutFamily = (function(superClass) {
        extend(LayoutFamily, superClass);
        /**
         * @constructor
         */
        function LayoutFamily() {
          return LayoutFamily.__super__.constructor.apply(this, arguments);
        }
        LayoutFamily.prototype.model = Layout;
        /**
         * @param thumbnail
         */
        LayoutFamily.prototype.findLayoutFor = function(thumbnail) {
          return this.find(function(layout) {
            return layout.attributes.layoutThumbnail === thumbnail;
          });
        };
        return LayoutFamily;
      })(Backbone.Collection);
    });
}).call(this);
