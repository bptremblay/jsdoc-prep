define(['column-and-block-layout-editor-path/constants', 'backbone'],
  /**
   * @exports src/drag-drop/block
   * @requires column-and-block-layout-editor-path/constants
   * @requires backbone
   * @requires underscore
   */
  function (constants, Backbone) {
    /**
     * The drag drop block.
     */
    var DragDropBlock;
    return DragDropBlock = ( /**@lends module:src/drag-drop/block~DragDropBlock# */ function (superClass) {
      extend(DragDropBlock, superClass);
      /**
       * @constructor
       */
      function DragDropBlock() {
        return DragDropBlock.__super__.constructor.apply(this, arguments);
      }
      DragDropBlock.prototype.ACTIONS = constants.DRAG_DROP.ACTIONS;
      DragDropBlock.prototype.DIRECTIONS = constants.DRAG_DROP.DIRECTIONS;
      DragDropBlock.prototype.SETTINGS = constants.DRAG_DROP.SETTINGS;
      DragDropBlock.prototype.defaults = {
        id: null,
        height: null,
        width: null,
        lowerY: null,
        upperY: null
      };
      /**
       * Returns true if is move.
       * @return {Object} boolean
       */
      DragDropBlock.prototype.isMove = function () {
        return this.collection.isMove();
      };
      /**
       * Returns true if is reorder.
       * @return {Object} boolean
       */
      DragDropBlock.prototype.isReorder = function () {
        return this.collection.isReorder();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlock.prototype.getSourceColumnIndex = function () {
        return this.collection.getSourceColumnIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropBlock.prototype.getSourceBlockIndex = function () {
        return this.collection.getSourceBlockIndex();
      };
      /**
       * @param x
       * @param y
       */
      DragDropBlock.prototype.getAction = function (x, y) {
        return {
          action: this._getActionIdentifier(y),
          columnId: this.collection.getColumnId(),
          blockId: this._getBlockIndexForY(y),
          markerColumnId: this.collection.getColumnId(),
          markerBlockId: this.id,
          markerDirection: this._getDirection(y)
        };
      };
      /**
       * @param y
       */
      DragDropBlock.prototype._getBlockIndexForY = function (y) {
        /**
         * The index modifier.
         */
        var indexModifier;
        indexModifier = Math.max(this._getBlockIndexModifierForY(y), 0);
        return this.id + indexModifier;
      };
      /**
       * @param y
       * @return {Object} UnaryExpression
       */
      DragDropBlock.prototype._getBlockIndexModifierForY = function (y) {
        /**
         * The direction.
         */
        var direction;
        direction = this._getDirection(y);
        switch (false) {
        case !(direction === this.DIRECTIONS.ABOVE && this._willChangeLayout()):
          return -1;
        case !(direction === this.DIRECTIONS.BELOW && this._willChangeLayout()):
          return 1;
        default:
          return 0;
        }
      };
      /**
       * @return {Boolean}
       */
      DragDropBlock.prototype._sourceContentInDifferentLayoutPosition = function () {
        /**
         * The different block.
         */
        var differentBlock, differentColumn;
        differentColumn = this.getSourceColumnIndex() !== this.collection.getColumnId();
        differentBlock = this.getSourceBlockIndex() !== this.id;
        return differentColumn || differentBlock || this.collection.sourceIsChild();
      };
      /**
       * @return {Boolean}
       */
      DragDropBlock.prototype._willChangeLayout = function () {
        return !this.isReorder() || this._sourceContentInDifferentLayoutPosition();
      };
      /**
       * @param y
       */
      DragDropBlock.prototype._getDirection = function (y) {
        /**
         * The col y.
         */
        var colY;
        colY = y - this.get('lowerY');
        if (colY < this.get('height') / 2) {
          return this.DIRECTIONS.ABOVE;
        } else {
          return this.DIRECTIONS.BELOW;
        }
      };
      /**
       * @param y
       */
      DragDropBlock.prototype._getActionIdentifier = function (y) {
        switch (false) {
        case !this._shouldDoNothing(y):
          return this.ACTIONS.NULL;
        case !this.isReorder():
          return this.ACTIONS.REORDER_BLOCK;
        case !this.isMove():
          return this.ACTIONS.MOVE_BLOCK;
        default:
          return this.ACTIONS.INSERT_BLOCK;
        }
      };
      /**
       * @param y
       * @return {Boolean}
       */
      DragDropBlock.prototype._shouldDoNothing = function (y) {
        /**
         * The same block.
         */
        var sameBlock, sameColumn;
        sameColumn = this.getSourceColumnIndex() === this.collection.getColumnId();
        sameBlock = this._sourceBlockIsDestinationBlock(y);
        return this.collection.isReorder() && sameColumn && sameBlock;
      };
      /**
       * @param y
       */
      DragDropBlock.prototype._sourceBlockIsDestinationBlock = function (y) {
        return this.id + this._getBlockIndexModifierForY(y) === this.getSourceBlockIndex();
      };
      return DragDropBlock;
    })(Backbone.Model);
  });