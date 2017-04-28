/**
 * @param child  
 * @param parent
 */
var extend = function (child, parent) {
    for (let key in parent) {
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
define(['jquery', 'backbone', 'template-engine', 'i18n!galileo-lib/modules/nls/engine', 'text!root/templates/switcher-tools.html', 'galileo-lib/modules/services/usage-tracking',
    'toolbar/layout-switcher/views/switcher-view'
  ],
  /**
   * @exports src/lib/toolbar/layout-switcher/views/switcher-toolbar-view
   * @requires jquery
   * @requires backbone
   * @requires template-engine
   * @requires i18n!galileo-lib/modules/nls/engine
   * @requires text!root/templates/switcher-tools.html
   * @requires galileo-lib/modules/services/usage-tracking
   * @requires toolbar/layout-switcher/views/switcher-view
   * @requires underscore
   */
  function ($, Backbone, Mustache, i18n, template, usageTracking, SwitcherView) {
    let SwitcherToolbarView, usageTrackingActions;
    usageTrackingActions = {
      layoutSelected: 'adjust_block_layout'
    };
    return SwitcherToolbarView = ( /**@lends module:lib/toolbar/layout-switcher/views/switcher-toolbar-view~SwitcherToolbarView# */ function (superClass) {
      extend(SwitcherToolbarView, superClass);
      /**
       * @constructor
       */
      function SwitcherToolbarView() {
        return SwitcherToolbarView.__super__.constructor.apply(this, arguments);
      }
      SwitcherToolbarView.prototype.tagName = 'div';
      SwitcherToolbarView.prototype.className = 'fed-wrapper galileo-ap-editor-component';
      /**
       * @private
       * @private 
       * @param layout  
       * @param action
       */
      SwitcherToolbarView.prototype._layoutSelected = function (layout, action) {
        let thumbnail;
        if (action == null) {
          action = usageTrackingActions.layoutSelected;
        }
        if (!this.enabled) {
          return;
        }
        usageTracking.track(action, {
          layout_name: layout.attributes.layoutName
        });
        thumbnail = this.currentlySelectedLayout.attributes.layoutThumbnail;
        if (!this.currentlySelectedLayout || layout.attributes.layoutThumbnail !== thumbnail) {
          this.currentlySelectedLayout = layout;
          this.switcherView.highlight(this.currentlySelectedLayout);
          return this.trigger('changed:layout', this.currentlySelectedLayout.attributes);
        }
      };
      /**
       * @param options
       */
      SwitcherToolbarView.prototype.initialize = function (options) {
        this.enabled = true;
        this.currentlySelectedLayout = options.layoutFamily.findLayoutFor(options.thisLayoutThumbnail);
        this.switcherView = new SwitcherView({
          collection: options.layoutFamily,
          highlightedLayoutThumbnail: options.thisLayoutThumbnail
        });
        return this.listenTo(this.switcherView, 'selected:layout', this._layoutSelected);
      };
      /**
       * @return {Object} ThisExpression
       */
      SwitcherToolbarView.prototype.render = function () {
        this.$el.html(Mustache.render(template, i18n));
        $('.galileo-ap-switcher', this.$el).html(this.switcherView.render().el);
        return this;
      };
      /**
       * @function
       */
      SwitcherToolbarView.prototype.show = function () {
        return this.$el.show();
      };
      /**
       * @function
       */
      SwitcherToolbarView.prototype.hide = function () {
        return this.$el.hide();
      };
      /**
       * @return {Object} AssignmentExpression
       */
      SwitcherToolbarView.prototype.enable = function () {
        return this.enabled = true;
      };
      /**
       * @return {Object} AssignmentExpression
       */
      SwitcherToolbarView.prototype.disable = function () {
        return this.enabled = false;
      };
      /**
       * @param thumbnail
       */
      SwitcherToolbarView.prototype.setCurrentLayoutThumbnail = function (thumbnail) {
        this.currentlySelectedLayout = this.switcherView.collection.findLayoutFor(thumbnail);
        return this.switcherView.highlight(this.currentlySelectedLayout);
      };
      return SwitcherToolbarView;
    })(Backbone.View);
  });