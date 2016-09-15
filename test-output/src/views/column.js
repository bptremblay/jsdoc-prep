define(['underscore', 'jquery', 'backbone', 'template-engine', 'column-and-block-layout-editor-path/views/block', 'column-and-block-layout-editor-path/constants',
    'column-and-block-layout-editor-path/views/column-resize-handle', 'column-and-block-layout-editor-path/views/column-resize-handle-IE'
  ],
  /**
   * @exports src/views/column
   * @requires underscore
   * @requires jquery
   * @requires backbone
   * @requires template-engine
   * @requires column-and-block-layout-editor-path/views/block
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/views/column-resize-handle
   * @requires column-and-block-layout-editor-path/views/column-resize-handle-IE
   */
  function (_, $, Backbone, Mustache, BlockView, constants, ColumnResizeHandleView, ColumnResizeHandleViewIE) {
    /**
     * The aTTRS.
     */
    var ATTRS, ColumnView, SELECTORS;
    ATTRS = {
      block: 'data-gl-layout-block'
    };
    SELECTORS = {
      blocks: "[" + ATTRS.block + "]",
      /**
       * @param id
       */
      block: function (id) {
        return "[" + ATTRS.block + "=" + id + "]";
      }
    };
    return ColumnView = ( /**@lends module:src/views/column~ColumnView# */ function (superClass) {
      extend(ColumnView, superClass);
      /**
       * @constructor
       */
      function ColumnView() {
        this._mouseOut = bind(this._mouseOut, this);
        this._mouseOver = bind(this._mouseOver, this);
        return ColumnView.__super__.constructor.apply(this, arguments);
      }
      ColumnView.prototype.blockViews = [];
      ColumnView.prototype.events = {
        'mouseover': '_mouseOver',
        'mouseout': '_mouseOut'
      };
      /**
       * @param e
       */
      ColumnView.prototype._mouseOver = function (e) {
        return this.blockViews.forEach(function (view) {
          return view.model.getContentEditors().forEach(function (editor) {
            return editor.trigger(constants.EVENTS.COLUMN_MOUSEOVER);
          });
        });
      };
      /**
       * @param e
       */
      ColumnView.prototype._mouseOut = function (e) {
        return this.blockViews.forEach(function (view) {
          return view.model.getContentEditors().forEach(function (editor) {
            return editor.trigger(constants.EVENTS.COLUMN_MOUSEOUT);
          });
        });
      };
      /**
       * @param block
       * @param idx
       */
      ColumnView.prototype._addBlock = function (block, idx) {
        /**
         * The $block.
         */
        var $block;
        $block = $(Mustache.render(this.blockTemplate, {}));
        if (idx === this.blockViews.length) {
          this.$el.append($block);
        } else {
          this.$el.find(SELECTORS.blocks).eq(idx).before($block);
        }
        return this.blockViews.splice(idx, 0, this._renderBlock($block, block));
      };
      /**
       * @param block
       * @param idx
       */
      ColumnView.prototype._removeBlock = function (block, idx) {
        this.$el.find(SELECTORS.block(block.id)).remove();
        return this.blockViews.splice(idx, 1);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnView.prototype._initEvents = function () {
        /**
         * The blocks.
         */
        var blocks;
        blocks = this.model.getBlocksCollection();
        this.listenTo(blocks, 'add-at', this._addBlock);
        return this.listenTo(blocks, constants.EVENTS.REMOVE_FROM, this._removeBlock);
      };
      /**
       * @param blockElement
       * @param block
       * @param options
       */
      ColumnView.prototype._renderBlock = function (blockElement, block, options) {
        /**
         * The block view.
         */
        var blockView;
        if (options == null) {
          options = {};
        }
        blockView = new BlockView({
          model: block,
          el: blockElement,
          eventEmitter: this.eventEmitter,
          prototypeMarkupService: this.prototypeMarkupService,
          contentDecorators: this.prototypeMarkupService.getContentDecoratorsByContentType(this.$el)
        });
        blockView.render(options);
        return blockView;
      };
      /**
       * @param options
       * @return {Object} AssignmentExpression
       */
      ColumnView.prototype._renderBlocks = function (options) {
        /**
         * The $blocks.
         */
        var $blocks;
        $blocks = this.$el.find(SELECTORS.blocks);
        return this.blockViews = this.model.getBlocksCollection().map((function (_this) {
          return function (block, idx) {
            return _this._renderBlock($blocks.get(idx), block, options);
          };
        })(this));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnView.prototype._addColumnPositionClass = function () {
        if (this.model.hasContentRight()) {
          return this.$el.addClass(constants.CLASSES.COLUMN_LEFT);
        } else if (this.model.hasContentLeft()) {
          return this.$el.addClass(constants.CLASSES.COLUMN_RIGHT);
        } else {
          return this.$el.addClass(constants.CLASSES.COLUMN_DEFAULT);
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnView.prototype._renderResizeColumnHandle = function () {
        /**
         * The resize handle.
         */
        var resizeHandle;
        if (this._browserIsIE11()) {
          resizeHandle = ColumnResizeHandleViewIE;
        } else {
          resizeHandle = ColumnResizeHandleView;
        }
        this.columnResizeHandleView = new resizeHandle({
          model: this.model
        });
        return this.$el.prepend(this.columnResizeHandleView.render().el);
      };
      /**
       * @return {Boolean}
       */
      ColumnView.prototype._browserIsIE11 = function () {
        return $.ua.browser.name === 'IE' && $.ua.browser.major === '11';
      };
      /**
       * @param opts
       */
      ColumnView.prototype.initialize = function (opts) {
        this.eventEmitter = opts.eventEmitter;
        this.prototypeMarkupService = opts.prototypeMarkupService;
        this.blockTemplate = opts.blockTemplate;
        return this._initEvents();
      };
      /**
       * @param options
       * @return {Object} ThisExpression
       */
      ColumnView.prototype.render = function (options) {
        this._renderBlocks(options);
        if (this.model.hasContentRight()) {
          this._renderResizeColumnHandle();
        }
        if (!this._browserIsIE11()) {
          this.$el.css({
            position: 'relative'
          });
        }
        this._addColumnPositionClass();
        return this;
      };
      /**
       * @param options
       */
      ColumnView.prototype.remove = function (options) {
        if (this.columnResizeHandleView) {
          this.columnResizeHandleView.remove();
        }
        _.chain(this.model.getContents()).flatten().invoke('deactivate', options);
        return ColumnView.__super__.remove.apply(this, arguments);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnView.prototype.getDimensions = function () {
        return {
          widthPct: this.model.getWidthPct(),
          blocks: _(this.blockViews).invoke('getDimensions')
        };
      };
      return ColumnView;
    })(Backbone.View);
  });