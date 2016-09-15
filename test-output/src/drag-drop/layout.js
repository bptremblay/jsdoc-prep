define(['underscore', 'backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/drag-drop/columns'],
  /**
   * @exports src/drag-drop/layout
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/drag-drop/columns
   */
  function (_, Backbone, constants, DragDropColumns) {
    /**
     * The drag drop layout.
     */
    var DragDropLayout;
    return DragDropLayout = ( /**@lends module:src/drag-drop/layout~DragDropLayout# */ function (superClass) {
      extend(DragDropLayout, superClass);
      /**
       * @constructor
       */
      function DragDropLayout() {
        return DragDropLayout.__super__.constructor.apply(this, arguments);
      }
      /**
       * @param attributes
       * @param options
       */
      DragDropLayout.prototype.initialize = function (attributes, options) {
        this.instanceId = options.instanceId;
        this.type = options.type;
        this.content = options.content;
        this.maxColumns = options.atMaxColumns;
        this.columns = new DragDropColumns(attributes.columns, {
          layout: this
        });
        return this.set({
          columns: null
        });
      };
      /**
       * Returns true if is move.
       * @return {Object} boolean
       */
      DragDropLayout.prototype.isMove = function () {
        return this.type === constants.TYPES.BLOCK;
      };
      /**
       * Returns true if is reorder.
       * @return {Object} boolean
       */
      DragDropLayout.prototype.isReorder = function () {
        return this.isMove() && this.sourceIsDestination() && !this.sourceIsChild();
      };
      /**
       * Returns true if is reorder column.
       * @return {Object} boolean
       */
      DragDropLayout.prototype.isReorderColumn = function () {
        return this.isReorder() && this.sourceIsMovableColumn();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.sourceIsMovableColumn = function () {
        return this.columns.at(this.content.sourceColumnIndex).blocks.length === 1;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.sourceIsDestination = function () {
        return this.content.sourceLayoutInstanceId === this.instanceId;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.sourceIsChild = function () {
        return this.content.sourceIsChildContent;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.getSourceColumnIndex = function () {
        return this.content.sourceColumnIndex;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.getSourceBlockIndex = function () {
        return this.content.sourceBlockIndex;
      };
      /**
       * @return {Object} UnaryExpression
       */
      DragDropLayout.prototype.atMaxColumns = function () {
        return !!this.maxColumns;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.getWidth = function () {
        return this.get('width');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropLayout.prototype.getHeight = function () {
        return this.get('height');
      };
      /**
       * @param x
       * @param y
       */
      DragDropLayout.prototype.getAction = function (x, y) {
        /**
         * The column.
         */
        var column;
        column = this.columns.getColumn(x);
        return column.getAction(x, y);
      };
      return DragDropLayout;
    })(Backbone.Model);
  });