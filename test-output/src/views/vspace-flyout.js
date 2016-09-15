define(['jquery', 'underscore', 'backbone', 'template-engine', 'column-and-block-layout-editor-path/constants', 'text!column-and-block-layout-editor-path/templates/vspace-flyout.html',
    'css!column-and-block-layout-editor-path/css/flyout.css', 'i18n!column-and-block-layout-editor-path/nls/column-and-block-layout-editor', 'galileo-lib/modules/services/usage-tracking'
  ],
  /**
   * @exports src/views/vspace-flyout
   * @requires jquery
   * @requires underscore
   * @requires backbone
   * @requires template-engine
   * @requires column-and-block-layout-editor-path/constants
   * @requires text!column-and-block-layout-editor-path/templates/vspace-flyout.html
   * @requires css!column-and-block-layout-editor-path/css/flyout.css
   * @requires i18n!column-and-block-layout-editor-path/nls/column-and-block-layout-editor
   * @requires galileo-lib/modules/services/usage-tracking
   */
  function ($, _, Backbone, Mustache, constants, template, css, i18n, usageTracking) {
    /**
     * The sELECTORS.
     */
    var SELECTORS, VspaceFlyoutView;
    SELECTORS = {
      galileo: '#galileo',
      checkbox: '#checkbox-vspace',
      doneButton: '.vspace-done'
    };
    VspaceFlyoutView = ( /**@lends module:src/views/vspace-flyout~=# */ function (superClass) {
      /**
       * The obj.
       */
      var obj;
      extend(VspaceFlyoutView, superClass);
      /**
       * @constructor
       */
      function VspaceFlyoutView() {
        this._toggleVspace = bind(this._toggleVspace, this);
        this._dismissFlyout = bind(this._dismissFlyout, this);
        this.hideFlyout = bind(this.hideFlyout, this);
        this.showFlyout = bind(this.showFlyout, this);
        return VspaceFlyoutView.__super__.constructor.apply(this, arguments);
      }
      /**
       * @param params
       */
      VspaceFlyoutView.prototype.initialize = function (params) {
        this.layoutEditor = (params != null ? params.layoutEditor : void 0) || null;
        this.contentModel = (params != null ? params.contentModel : void 0) || null;
        return this.render();
      };
      VspaceFlyoutView.prototype.events = (
        obj = {},
        obj["click " + SELECTORS.doneButton] = 'hideFlyout',
        obj["change " + SELECTORS.checkbox] = '_toggleVspace',
        obj
      );
      /**
       * @return {Object} ThisExpression
       */
      VspaceFlyoutView.prototype.render = function () {
        /**
         * The ref.
         */
        var ref, vspace;
        vspace = ((ref = this.contentModel) != null ? ref.get('vspace') : void 0) || false;
        this.$el.html(Mustache.render(template, {
          i18n: i18n,
          hasVspace: vspace
        }));
        this._appendToDOM();
        this.hideFlyout();
        return this;
      };
      /**
       * @param event
       */
      VspaceFlyoutView.prototype.showFlyout = function (event) {
        this.$el.show().width(200).position({
          my: 'left top',
          at: 'right top',
          of: event,
          collision: 'fit'
        });
        return $('body').on('mousedown.vspace', (function (_this) {
          return function (event) {
            return _this._dismissFlyout(event);
          };
        })(this));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      VspaceFlyoutView.prototype.hideFlyout = function () {
        $('body').off('mousedown.vspace');
        return this.$el.hide();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      VspaceFlyoutView.prototype._appendToDOM = function () {
        if ($(SELECTORS.galileo).length && !$.contains($(SELECTORS.galileo)[0], this.el)) {
          $(SELECTORS.galileo).append(this.$el);
          return this.delegateEvents();
        }
      };
      /**
       * @param event
       */
      VspaceFlyoutView.prototype._eventTargetIsFlyout = function (event) {
        return $.contains(this.el, event.target);
      };
      /**
       * @param event
       */
      VspaceFlyoutView.prototype._dismissFlyout = function (event) {
        if (!this._eventTargetIsFlyout(event)) {
          return this.hideFlyout();
        }
      };
      /**
       * @param event
       */
      VspaceFlyoutView.prototype._toggleVspace = function (event) {
        /**
         * The checked.
         */
        var checked;
        checked = this.$el.find(SELECTORS.checkbox).prop('checked');
        this._trackUsage('g_right_click>image>padding_toggle', checked);
        return this.layoutEditor.trigger(constants.EVENTS.TOGGLE_CONTENT_VSPACE, this.contentModel);
      };
      /**
       * @param identifier
       * @param value
       */
      VspaceFlyoutView.prototype._trackUsage = function (identifier, value) {
        /**
         * The context.
         */
        var context, detail;
        detail = value === true ? 'on' : 'off';
        context = {
          actionIdentifier: identifier,
          blockTitle: 'g_Image',
          blockDetail: detail
        };
        return usageTracking.track('editor_action', context);
      };
      return VspaceFlyoutView;
    })(Backbone.View);
    return new VspaceFlyoutView();
  });