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

  define(['backbone', 'toolbar/layout-switcher/views/layout-view'],
    /**
     * @exports src/lib/toolbar/layout-switcher/views/switcher-view
     * @requires backbone
     * @requires toolbar/layout-switcher/views/layout-view
     * @requires underscore
     */
    function(Backbone, LayoutView) {
      var SwitcherView;
      return SwitcherView = (function(superClass) {
        extend(SwitcherView, superClass);
        /**
         * @constructor
         */
        function SwitcherView() {
          return SwitcherView.__super__.constructor.apply(this, arguments);
        }
        SwitcherView.prototype.tagName = 'ul';
        SwitcherView.prototype.className = 'block-layout-list u-listStyleNone u-marginFlush u-paddingFlush';
        /**
         * @private 
         * @param thumbnail
         */
        SwitcherView.prototype._findLayout = function(thumbnail) {
          return this.collection.find(function(layout) {
            return layout.attributes.layoutThumbnail === thumbnail;
          });
        };
        /**
         * @private 
         * @param layout
         */
        SwitcherView.prototype._layoutSelected = function(layout) {
          return this.trigger('selected:layout', layout);
        };
        /**
         * @private 
         * @param layout
         */
        SwitcherView.prototype._addLayoutOption = function(layout) {
          var layoutView;
          layoutView = new LayoutView({
            model: layout
          });
          this.listenTo(layoutView, 'selected', this._layoutSelected);
          this.$el.append(layoutView.render().el);
          if (layout.attributes.layoutThumbnail === this.initiallyHighlightedLayoutThumbnail) {
            this.highlightedLayout = layout;
            return layoutView.highlight();
          }
        };
        /**
         * @param options
         * @return {Object} AssignmentExpression
         */
        SwitcherView.prototype.initialize = function(options) {
          this.initiallyHighlightedLayoutThumbnail = options.highlightedLayoutThumbnail;
          return this.highlightedLayout = this._findLayout(this.initiallyHighlightedLayoutThumbnail);
        };
        /**
         * @return {Object} ThisExpression
         */
        SwitcherView.prototype.render = function() {
          this.collection.each(this._addLayoutOption, this);
          this.listenTo(this.collection, 'add', this._addLayoutOption);
          return this;
        };
        /**
         * @param layout
         */
        SwitcherView.prototype.highlight = function(layout) {
          if (this.highlightedLayout) {
            this.highlightedLayout.trigger('unhighlight');
            if (layout) {
              this.highlightedLayout = this._findLayout(layout.attributes.layoutThumbnail);
            }
            return this.highlightedLayout.trigger('highlight');
          }
        };
        return SwitcherView;
      })(Backbone.View);
    });
}).call(this);
