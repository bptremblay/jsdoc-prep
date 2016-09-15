define(['underscore', 'backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/models/block', 'column-and-block-layout-editor-path/models/blocks',
    'column-and-block-layout-editor-path/models/converters/block-converter'
  ],
  /**
   * @exports src/models/column
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/models/block
   * @requires column-and-block-layout-editor-path/models/blocks
   * @requires column-and-block-layout-editor-path/models/converters/block-converter
   */
  function (_, Backbone, constants, Block, Blocks, BlockConverter) {
    /**
     * The column model.
     */
    var ColumnModel;
    return ColumnModel = ( /**@lends module:src/models/column~ColumnModel# */ function (superClass) {
      extend(ColumnModel, superClass);
      /**
       * @constructor
       */
      function ColumnModel() {
        this.getLayoutReadyPromise = bind(this.getLayoutReadyPromise, this);
        return ColumnModel.__super__.constructor.apply(this, arguments);
      }
      ColumnModel.prototype.blocks = [];
      /**
       * @param model
       * @param collection
       * @param options
       */
      ColumnModel.prototype._removeColumnIfBlocksIsEmpty = function (model, collection, options) {
        if (this.blocks.isEmpty()) {
          return this.collection.remove(this, options);
        }
      };
      /**
       * @param blocks
       * @return {Object} NewExpression
       */
      ColumnModel.prototype._createBlockModel = function (blocks) {
        return new Blocks(blocks, this.blockOpts);
      };
      /**
       * @param block
       */
      ColumnModel.prototype._onBlockRemoved = function (block) {
        return block.deactivate();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype._refreshAttributes = function () {
        /**
         * The attributes.
         */
        var attributes;
        attributes = _(this.attributes).clone();
        attributes.blocks = this.blocks.toState();
        return this.set(attributes, {
          silent: true
        });
      };
      /**
       * @param delta
       */
      ColumnModel.prototype.applyDeltaToColumnWidth = function (delta) {
        return this.collection.applyDeltaToColumnWidth(this, delta);
      };
      /**
       * @param firstColumnWidthPercentage
       */
      ColumnModel.prototype.resizeColumnFromHandle = function (firstColumnWidthPercentage) {
        return this.collection.resizeColumnFromHandle(firstColumnWidthPercentage / 100);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.toState = function () {
        /**
         * The state.
         */
        var state;
        state = this.toJSON();
        state.blocks = this.blocks.toState();
        return state;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getBlocksCollection = function () {
        return this.blocks;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getContents = function () {
        return this.blocks.getContents();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getContentEditors = function () {
        return this.blocks.getContentEditors();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getLayoutInstanceId = function () {
        return this.collection.getLayoutInstanceId();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getWidthPct = function () {
        return this.get('columnWidth');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getWidthPx = function () {
        return this.layoutContainerWidth * this.getWidthPct();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getLayoutContainerWidth = function () {
        return this.layoutContainerWidth;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getLayoutReadyPromise = function () {
        return this.collection.getLayoutReadyPromise();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getAttributesForRender = function () {
        /**
         * The attributes.
         */
        var attributes;
        attributes = this.toState();
        attributes.columnWidth = (Math.round(this.getWidthPct() * 100)) + "%";
        return attributes;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.hasContentLeft = function () {
        return this !== this.collection.first();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.hasContentRight = function () {
        return this !== this.collection.last();
      };
      /**
       * @param name
       */
      ColumnModel.prototype.hasBlock = function (name) {
        return this.blocks.get(name) != null;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.hasMultipleBlocks = function () {
        return this.blocks.length > 1;
      };
      /**
       * @param position
       * @param blockJSON
       */
      ColumnModel.prototype.addBlock = function (position, blockJSON) {
        /**
         * The opts.
         */
        var opts;
        opts = _.extend({}, this.blockOpts, {
          at: position
        });
        this.blocks.add(blockJSON, opts);
        return this._refreshAttributes();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnModel.prototype.getColumnIndex = function () {
        return this.collection.indexOf(this);
      };
      /**
       * @param column
       * @param opts
       */
      ColumnModel.prototype.initialize = function (column, opts) {
        this.layoutContainerWidth = opts.layoutContainerWidth;
        this.blockOpts = {
          eventEmitter: opts.eventEmitter,
          contentEditorFactory: opts.contentEditorFactory,
          contentEditorStateMap: opts.contentEditorStateMap,
          column: this
        };
        this.blocks = this._createBlockModel(column.blocks);
        this.listenTo(this.blocks, constants.EVENTS.REMOVE_FROM, this._onBlockRemoved);
        return this.listenTo(this.blocks, 'remove', this._removeColumnIfBlocksIsEmpty, this);
      };
      return ColumnModel;
    })(Backbone.Model);
  });