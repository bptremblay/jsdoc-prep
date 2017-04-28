(function() {
  /**
   * @param fn
   * @param me
   * @return {Function}
   */
  var bind = function(fn, me) {
    return function() {
      return fn.apply(me, arguments);
    };
  };

  define(['jquery', 'galileo-lib/modules/events', 'root/engine/services/highlighting-service', 'toolbar/layout-switcher/models/layout', 'toolbar/layout-switcher/models/layout-family',
      'toolbar/layout-switcher/views/switcher-toolbar-view'
    ],
    /**
     * @exports src/lib/toolbar/layout-switcher/layout-switcher-toolbar
     * @requires jquery
     * @requires galileo-lib/modules/events
     * @requires root/engine/services/highlighting-service
     * @requires toolbar/layout-switcher/models/layout
     * @requires toolbar/layout-switcher/models/layout-family
     * @requires toolbar/layout-switcher/views/switcher-toolbar-view
     */
    function($, events, highlightingService, Layout, LayoutFamily, SwitcherToolbarView) {
      var LayoutSwitcherToolbar, selectors;
      selectors = {
        container: 'data-layout-editor-instance-id',
        toolbar: 'data-galileo-ap-component-for'
      };
      return LayoutSwitcherToolbar = (function() {
        /**
         * @private 
         * @param topToolsVisible
         */
        LayoutSwitcherToolbar.prototype._adjustSideTools = function(topToolsVisible) {
          /*
          The .block-tools are positioned with top: -4px; This looks fine when there is no ABL toolbar.
          When the ABL toolbar is present, .block-tools is out of alignment. When ABL toolbar is present,
          .block-tools should be positioned with top: 0; Once all blocks
          have an ABL toolbar, we can remove this condition and adjust the css so they are all consistent.
           */
          return this.$sideTools.css('top', topToolsVisible ? '0' : '-4px');
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._uninitialized = function() {
          return this.switcherToolbarView.$el.parent().length === 0;
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._onContainerHover = function() {
          if (!highlightingService.hoverEffectsDisabled()) {
            return this._showToolbar();
          }
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._onToolbarHover = function() {
          return this._highlightContainer(true);
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._showToolbar = function() {
          this._prependToolbarView();
          this._adjustSideTools(true);
          this.switcherToolbarView.show();
          return this._listenForMouseExit();
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._hideToolbar = function() {
          this.switcherToolbarView.hide();
          this._adjustSideTools(false);
          this._stopListeningForMouseExit();
          return this._highlightContainer(false);
        };
        /**
         * @private 
         * @param show
         */
        LayoutSwitcherToolbar.prototype._highlightContainer = function(show) {
          return highlightingService.toggleHoverEffects(this.$container, show);
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._listenForMouseExit = function() {
          var onMouseMove, over;
          if (this.listeningForMouseExit) {
            return;
          }
          this.listeningForMouseExit = true;
          /**
           * @param selector
           * @param event
           * @return {Boolean}
           */
          over = function(selector, event) {
            var $target;
            $target = $(event.target);
            return $target.is(selector) || $target.parents(selector).length > 0;
          };
          onMouseMove = (function(_this) {
            return function(event) {
              if (!(over(_this.selectors.container, event) || over(_this.selectors.toolbar, event))) {
                return _this._hideToolbar();
              }
            };
          })(this);
          return $('body').on(this.events.mousemove, onMouseMove);
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._stopListeningForMouseExit = function() {
          this.listeningForMouseExit = false;
          return $('body').off(this.events.mousemove);
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._listenForHover = function() {
          this.$container.on(this.events.mouseenter, this._onContainerHover);
          return this.switcherToolbarView.$el.on(this.events.mouseenter, this._onToolbarHover);
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._stopListeningForHover = function() {
          this.$container.off(this.events.mouseenter);
          return this.switcherToolbarView.$el.off(this.events.mouseenter);
        };
        /**
         * @private 
         * @param layouts
         */
        LayoutSwitcherToolbar.prototype._createModel = function(layouts) {
          var layout, layoutFamily;
          layoutFamily = new LayoutFamily();
          layoutFamily.add((function() {
            var i, len, results;
            results = [];
            for (i = 0, len = layouts.length; i < len; i++) {
              layout = layouts[i];
              results.push(new Layout(layout));
            }
            return results;
          })());
          return layoutFamily;
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._prependToolbarView = function() {
          if (this._uninitialized()) {
            this.$container.before(this.switcherToolbarView.el);
            return this._initSideTools();
          }
        };
        /**
         * @private 
         * @return {Object} AssignmentExpression
         */
        LayoutSwitcherToolbar.prototype._initNamespacedEvents = function() {
          this.selectors = {
            container: "[" + selectors.container + "=" + this.layoutEditorInstanceId + "]",
            toolbar: "[" + selectors.toolbar + "=" + this.layoutEditorInstanceId + "]"
          };
          return this.events = {
            mouseenter: "mouseenter.galileo-layout-switcher-" + this.layoutEditorInstanceId,
            mousemove: "mousemove.galileo-layout-switcher-" + this.layoutEditorInstanceId,
            hoverEffectsDisabled: 'galileo.hoverEffectsDisabled'
          };
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._hasLayoutOptionsToDisplay = function() {
          return this.layoutFamily.length > 0;
        };
        /**
         * @private 
         * @param layout
         */
        LayoutSwitcherToolbar.prototype._layoutChanged = function(layout) {
          return this.layoutChangedCb(layout);
        };
        /**
         * @private 
         * @param layoutThumbnail
         */
        LayoutSwitcherToolbar.prototype._createSwitcherToolbarView = function(layoutThumbnail) {
          this.switcherToolbarView = new SwitcherToolbarView({
            layoutFamily: this.layoutFamily,
            thisLayoutThumbnail: layoutThumbnail
          });
          this.switcherToolbarView.on('changed:layout', this._layoutChanged, this);
          this.switcherToolbarView.$el.attr(selectors.toolbar, this.layoutEditorInstanceId);
          return this.switcherToolbarView.render();
        };
        /**
         * @private 
         * @return {Object} AssignmentExpression
         */
        LayoutSwitcherToolbar.prototype._initSideTools = function() {
          return this.$sideTools = this.$container.siblings('.block-tools');
        };
        /**
         * @private 
         */
        LayoutSwitcherToolbar.prototype._handleHoverEffectsDisabledEvent = function() {
          if (!this._uninitialized()) {
            return this._hideToolbar();
          }
        };
        /**
         * @function
         */
        LayoutSwitcherToolbar.prototype.activate = function() {
          if (!this._hasLayoutOptionsToDisplay()) {
            return;
          }
          return this._listenForHover();
        };
        /**
         * @function
         */
        LayoutSwitcherToolbar.prototype.deactivate = function() {
          if (!this._hasLayoutOptionsToDisplay()) {
            return;
          }
          this._stopListeningForHover();
          return this.switcherToolbarView.hide();
        };
        /**
         * @function
         */
        LayoutSwitcherToolbar.prototype.enableLayoutSwitching = function() {
          return this.switcherToolbarView.enable();
        };
        /**
         * @function
         */
        LayoutSwitcherToolbar.prototype.disableLayoutSwitching = function() {
          return this.switcherToolbarView.disable();
        };
        /**
         * @param layoutChangedCb
         */
        LayoutSwitcherToolbar.prototype.setLayoutChangedCb = function(layoutChangedCb) {
          this.layoutChangedCb = layoutChangedCb;
        };
        /**
         * @param thumbnail
         */
        LayoutSwitcherToolbar.prototype.setLayoutThumbnail = function(thumbnail) {
          return this.switcherToolbarView.setCurrentLayoutThumbnail(thumbnail);
        };
        /**
         * @constructor
         * @param layoutEditor
         * @param options
         */
        function LayoutSwitcherToolbar(layoutEditor, options) {
          this._onToolbarHover = bind(this._onToolbarHover, this);
          this._onContainerHover = bind(this._onContainerHover, this);
          this.$container = options.$container;
          this.layoutEditorInstanceId = layoutEditor._getInstanceId();
          this.listeningForMouseExit = false;
          this.setLayoutChangedCb(function() {});
          this._initNamespacedEvents();
          this.layoutFamily = this._createModel(options.layouts);
          this._createSwitcherToolbarView(options.layoutThumbnail);
          events.on(this.events.hoverEffectsDisabled, (function(_this) {
            return function() {
              return _this._handleHoverEffectsDisabledEvent();
            };
          })(this));
        }
        return LayoutSwitcherToolbar;
      })();
    });
}).call(this);
