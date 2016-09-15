define(['backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/drag-drop/helpers', 'column-and-block-layout-editor-path/drag-drop/blocks'],
  /**
   * @exports src/drag-drop/column
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/drag-drop/helpers
   * @requires column-and-block-layout-editor-path/drag-drop/blocks
   * @requires underscore
   */
  function (
    Backbone, constants, helpers, DragDropBlocks) {
    /**
     * The drag drop column.
     */
    var DragDropColumn;
    return DragDropColumn = ( /**@lends module:src/drag-drop/column~DragDropColumn# */ function (superClass) {
      extend(DragDropColumn, superClass);
      /**
       * @constructor
       */
      function DragDropColumn() {
        return DragDropColumn.__super__.constructor.apply(this, arguments);
      }
      DragDropColumn.prototype.ACTIONS = constants.DRAG_DROP.ACTIONS;
      DragDropColumn.prototype.DIRECTIONS = constants.DRAG_DROP.DIRECTIONS;
      DragDropColumn.prototype.SETTINGS = constants.DRAG_DROP.SETTINGS;
      DragDropColumn.prototype.defaults = {
        id: null,
        widthPct: null,
        width: null,
        height: null,
        lowerX: null,
        upperX: null
      };
      /**
       * @param attributes
       * @param options
       */
      DragDropColumn.prototype.initialize = function (attributes, options) {
        this.blocks = new DragDropBlocks(attributes.blocks, {
          column: this,
          columnWidth: this.get('width')
        });
        return this.set({
          blocks: null
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumn.prototype.getSourceColumnIndex = function () {
        return this.collection.getSourceColumnIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumn.prototype.getSourceBlockIndex = function () {
        return this.collection.getSourceBlockIndex();
      };
      /**
       * Returns true if is move.
       * @return {Object} boolean
       */
      DragDropColumn.prototype.isMove = function () {
        return this.collection.isMove();
      };
      /**
       * Returns true if is reorder.
       * @return {Object} boolean
       */
      DragDropColumn.prototype.isReorder = function () {
        return this.collection.isReorder();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumn.prototype.sourceIsChild = function () {
        return this.collection.sourceIsChild();
      };
      /**
       * @param x
       * @param y
       */
      DragDropColumn.prototype.getAction = function (x, y) {
        /**
         * The should stack.
         */
        var shouldStack;
        shouldStack = helpers.within(this.getColX(x), this.get('width'), this._getXOffset(x));
        if (this.isStackable() && shouldStack) {
          return this._getBlockAction(x, y);
        } else {
          return this._getColumnAction(x);
        }
      };
      /**
       * @param layoutXCoordinate
       */
      DragDropColumn.prototype.getColX = function (layoutXCoordinate) {
        return layoutXCoordinate - this.get('lowerX');
      };
      /**
       * Returns true if is stackable.
       * @return {Object} boolean
       */
      DragDropColumn.prototype.isStackable = function () {
        return this.collection.isMultiColumn() || this.blocks.length > 1;
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._getColumnIndexForX = function (x) {
        /**
         * The index modifier.
         */
        var indexModifier;
        indexModifier = Math.max(this._getColumnIndexModifierForX(x), 0);
        return this.id + indexModifier;
      };
      /**
       * @param x
       * @return {Object} UnaryExpression
       */
      DragDropColumn.prototype._getColumnIndexModifierForX = function (x) {
        /**
         * The direction.
         */
        var direction;
        direction = this._getDirection(x);
        switch (false) {
        case !(direction === this.DIRECTIONS.LEFT && this._willChangeLayout()):
          return -1;
        case !(direction === this.DIRECTIONS.RIGHT && this._willChangeLayout()):
          return 1;
        default:
          return 0;
        }
      };
      /**
       * @return {Boolean}
       */
      DragDropColumn.prototype._sourceContentInDifferentLayoutPosition = function () {
        /**
         * The different column.
         */
        var differentColumn, oneColumnManyBlocks;
        differentColumn = this.getSourceColumnIndex() !== this.id;
        oneColumnManyBlocks = this.collection.length === 1 && this.blocks.length > 1;
        return differentColumn || oneColumnManyBlocks || this.collection.sourceIsChild();
      };
      /**
       * @return {Boolean}
       */
      DragDropColumn.prototype._willChangeLayout = function () {
        return !this.collection.isReorder() || this._sourceContentInDifferentLayoutPosition();
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._sourceColumnIsDestinationColumn = function (x) {
        return this.id + this._getColumnIndexModifierForX(x) === this.getSourceColumnIndex();
      };
      /**
       * @param x
       * @return {Boolean}
       */
      DragDropColumn.prototype._columnIsReorderable = function (x) {
        return this.collection.isReorderColumn() && !this._sourceColumnIsDestinationColumn(x);
      };
      /**
       * @param x
       * @return {Boolean}
       */
      DragDropColumn.prototype._shouldReorderColumn = function (x) {
        return this.collection.isReorder() && !this._sourceColumnIsDestinationColumn(x);
      };
      /**
       * @param x
       * @return {Boolean}
       */
      DragDropColumn.prototype._shouldDoNothing = function (x) {
        return this.collection.isReorder() && this._sourceColumnIsDestinationColumn(x);
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._getXOffset = function (x) {
        if (this._columnIsReorderable(x) || !this.collection.atMaxColumns()) {
          return this.SETTINGS.STACKING_PASSTHROUGH_PCT;
        } else {
          return 0;
        }
      };
      /**
       * @param x
       * @param y
       */
      DragDropColumn.prototype._getBlockAction = function (x, y) {
        /**
         * The block.
         */
        var block;
        block = this.blocks.getStackableBlock(y);
        return block.getAction(x, y);
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._getColumnAction = function (x) {
        return {
          action: this._getActionIdentifier(x),
          columnId: this._getColumnIndexForX(x),
          markerColumnId: this.id,
          markerDirection: this._getDirection(x)
        };
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._getDirection = function (x) {
        if (this.getColX(x) < this.get('width') / 2) {
          return this.DIRECTIONS.LEFT;
        } else {
          return this.DIRECTIONS.RIGHT;
        }
      };
      /**
       * @param x
       */
      DragDropColumn.prototype._getActionIdentifier = function (x) {
        switch (false) {
        case !this._shouldDoNothing(x):
          return this.ACTIONS.NULL;
        case !this._shouldReorderColumn(x):
          return this.ACTIONS.REORDER_COLUMN;
        case !this.isMove():
          return this.ACTIONS.MOVE_COLUMN;
        default:
          return this.ACTIONS.INSERT_COLUMN;
        }
      };
      return DragDropColumn;
    })(Backbone.Model);
  });