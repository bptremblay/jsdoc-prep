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

  define(['jquery', 'backbone', 'template-engine', 'text!root/templates/layout.html'],
    /**
     * @exports src/lib/toolbar/layout-switcher/views/layout-view
     * @requires jquery
     * @requires backbone
     * @requires template-engine
     * @requires text!root/templates/layout.html
     * @requires underscore
     */
    function($, Backbone, Mustache, template) {
      var LayoutView;
      return LayoutView = (function(superClass) {
        extend(LayoutView, superClass);
        /**
         * @constructor
         */
        function LayoutView() {
          return LayoutView.__super__.constructor.apply(this, arguments);
        }
        LayoutView.prototype.tagName = 'li';
        LayoutView.prototype.className = 'u-inlineBlock';
        LayoutView.prototype.events = {
          'click a': '_select'
        };
        /**
         * @private 
         * @param e
         * @return {Boolean}
         */
        LayoutView.prototype._select = function(e) {
          e.preventDefault();
          this.trigger('selected', this.model);
          return false;
        };
        /**
         * @function
         */
        LayoutView.prototype.initialize = function() {
          this.listenTo(this.model, 'remove', this.remove);
          this.listenTo(this.model, 'highlight', this.highlight);
          return this.listenTo(this.model, 'unhighlight', this.unhighlight);
        };
        /**
         * @return {Object} ThisExpression
         */
        LayoutView.prototype.render = function() {
          this.$el.html(Mustache.render(template, this.model.toJSON()));
          return this;
        };
        /**
         * @function
         */
        LayoutView.prototype.highlight = function() {
          return $('a', this.$el).addClass('active');
        };
        /**
         * @function
         */
        LayoutView.prototype.unhighlight = function() {
          return $('a', this.$el).removeClass('active');
        };
        return LayoutView;
      })(Backbone.View);
    });
}).call(this);
