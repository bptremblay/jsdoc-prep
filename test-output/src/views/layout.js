define(['jquery', 'underscore', 'backbone', 'template-engine', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/views/column'],
  /**
   * @exports src/views/layout
   * @requires jquery
   * @requires underscore
   * @requires backbone
   * @requires template-engine
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/views/column
   */
  function ($, _, Backbone, Mustache,
    constants, ColumnView) {
    /**
     * The layout view.
     */
    var LayoutView, SELECTORS;
    SELECTORS = {
      column: '[data-layout-column]'
    };
    return LayoutView = ( /**@lends module:src/views/layout~LayoutView# */ function (superClass) {
      extend(LayoutView, superClass);
      /**
       * @constructor
       */
      function LayoutView() {
        return LayoutView.__super__.constructor.apply(this, arguments);
      }
      LayoutView.prototype.events = {
        'drop': '_cancelDrop'
      };
      LayoutView.prototype.columnViews = [];
      /**
       * @param event
       */
      LayoutView.prototype._cancelDrop = function (event) {
        return event.preventDefault();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutView.prototype._retrieveTemplate = function () {
        this.template = this.prototypeMarkupService.getLayout(this.model.get('protoLayout'));
        if (!this.template) {
          throw new Error("Unable to find prototype layout: " + (this.model.get('protoLayout')));
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutView.prototype._renderLayout = function () {
        /**
         * The $el.
         */
        var $el;
        $el = $(Mustache.render(this.template.markup.layout, this.model.getAttributesForRender()));
        if (this.rendered) {
          this.$el.html($el.html());
        } else {
          this.setElement($el);
          this.rendered = true;
          this.trigger(constants.EVENTS.ELEMENT_CREATED);
        }
        return this.$el.attr(constants.DATA_ATTRS.PROTO_LAYOUT, this.model.get('protoLayout'));
      };
      /**
       * @param columnElement
       * @param column
       * @param options
       */
      LayoutView.prototype._renderColumn = function (columnElement, column, options) {
        /**
         * The column view.
         */
        var columnView;
        if (options == null) {
          options = {};
        }
        columnView = new ColumnView({
          model: column,
          el: columnElement,
          eventEmitter: this.eventEmitter,
          prototypeMarkupService: this.prototypeMarkupService,
          blockTemplate: this.template.markup.block
        });
        columnView.render(options);
        return columnView;
      };
      /**
       * @param options
       * @return {Object} AssignmentExpression
       */
      LayoutView.prototype._renderColumns = function (options) {
        /**
         * The $columns.
         */
        var $columns;
        $columns = this.$el.find(SELECTORS.column);
        return this.columnViews = this.model.getColumns().map((function (_this) {
          return function (column, idx) {
            return _this._renderColumn($columns.get(idx), column, options);
          };
        })(this));
      };
      /**
       * @param options
       */
      LayoutView.prototype._onModelChanged = function (options) {
        if (!this.template) {
          this._retrieveTemplate();
        }
        this._cleanUp(options);
        return this.render(options);
      };
      /**
       * @param opts
       */
      LayoutView.prototype.initialize = function (opts) {
        this.rendered = false;
        this.template = null;
        this.eventEmitter = opts.eventEmitter;
        this.prototypeMarkupService = opts.prototypeMarkupService;
        return this.listenTo(this.eventEmitter, constants.EVENTS.LAYOUT_CHANGED, this._onModelChanged);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutView.prototype.getRenderedElement = function () {
        if (this.model.isLayoutIncluded()) {
          return this.$el;
        } else {
          return $('<div/>');
        }
      };
      /**
       * @param options
       * @return {Object} ThisExpression
       */
      LayoutView.prototype.render = function (options) {
        this._renderLayout(options);
        this._renderColumns(options);
        return this;
      };
      /**
       * @param options
       */
      LayoutView.prototype._cleanUp = function (options) {
        return _(this.columnViews).invoke('remove', options);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutView.prototype.getDimensions = function () {
        return {
          width: this.$el.width(),
          height: this.$el.height(),
          offset: this.$el.offset(),
          columns: _(this.columnViews).invoke('getDimensions')
        };
      };
      return LayoutView;
    })(Backbone.View);
  });