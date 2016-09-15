define(['underscore', 'backbone', 'column-and-block-layout-editor-path/drag-drop/block'],
  /**
   * @exports src/drag-drop/blocks
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/drag-drop/block
   */
  function (_, Backbone, DragDropBlock) {
    /**
     * The drag drop blocks.
     */
    var DragDropBlocks;
    return DragDropBlocks = ( /**@lends module:src/drag-drop/blocks~DragDropBlocks# */ function (superClass) {
      extend(DragDropBlocks, superClass);
      /**
       * @constructor
       */
      function DragDropBlocks() {
        this._buildBlock = bind(this._buildBlock, this);
        return DragDropBlocks.__super__.constructor.apply(this, arguments);
      }
      DragDropBlocks.prototype.model = DragDropBlock;
      /**
       * @param rawBlocks
       * @param options
       */
      DragDropBlocks.prototype.initialize = function (rawBlocks, options) {
        this.column = options.column;
        this.columnWidth = options.columnWidth;
        return _(rawBlocks).each(this._buildBlock);
      };
      /**
       * Returns true if is move.
       * @return {Object} boolean
       */
      DragDropBlocks.prototype.isMove = function () {
        return this.column.isMove();
      };
      /**
       * Returns true if is reorder.
       * @return {Object} boolean
       */
      DragDropBlocks.prototype.isReorder = function () {
        return this.column.isReorder();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlocks.prototype.getSourceColumnIndex = function () {
        return this.column.getSourceColumnIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlocks.prototype.getSourceBlockIndex = function () {
        return this.column.getSourceBlockIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlocks.prototype.sourceIsChild = function () {
        return this.column.sourceIsChild();
      };
      /**
       * @param y
       * @return {Boolean}
       */
      DragDropBlocks.prototype.getStackableBlock = function (y) {
        return this.getBlock(y) || this.last();
      };
      /**
       * @param y
       */
      DragDropBlocks.prototype.getBlock = function (y) {
        return this.find(function (block) {
          return y >= block.get('lowerY') && y <= block.get('upperY');
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlocks.prototype.getColumnId = function () {
        return this.column.id;
      };
      /**
       * @param block
       * @param idx
       * @param blocks
       * @return {Object} AssignmentExpression
       */
      DragDropBlocks.prototype._buildBlock = function (block, idx, blocks) {
        /**
         * The previous.
         */
        var previous, ref;
        previous = ((ref = blocks[idx - 1]) != null ? ref.upperY : void 0) || 0;
        block.id = idx;
        block.width = this.columnWidth;
        block.upperY = previous + block.height;
        return block.lowerY = previous;
      };
      return DragDropBlocks;
    })(Backbone.Collection);
  });