define(['underscore', 'backbone', 'column-and-block-layout-editor-path/drag-drop/column'],
  /**
   * @exports src/drag-drop/columns
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/drag-drop/column
   */
  function (_, Backbone, DragDropColumn) {
    /**
     * The drag drop columns.
     */
    var DragDropColumns;
    return DragDropColumns = ( /**@lends module:src/drag-drop/columns~DragDropColumns# */ function (superClass) {
      extend(DragDropColumns, superClass);
      /**
       * @constructor
       */
      function DragDropColumns() {
        this._buildColumn = bind(this._buildColumn, this);
        return DragDropColumns.__super__.constructor.apply(this, arguments);
      }
      DragDropColumns.prototype.model = DragDropColumn;
      /**
       * @param rawColumns
       * @param options
       */
      DragDropColumns.prototype.initialize = function (rawColumns, options) {
        this.layout = options.layout;
        return _(rawColumns).each(this._buildColumn);
      };
      /**
       * Returns true if is multi column.
       * @return {Object} boolean
       */
      DragDropColumns.prototype.isMultiColumn = function () {
        return this.length > 1;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumns.prototype.atMaxColumns = function () {
        return this.layout.atMaxColumns();
      };
      /**
       * Returns true if is move.
       * @return {Object} boolean
       */
      DragDropColumns.prototype.isMove = function () {
        return this.layout.isMove();
      };
      /**
       * Returns true if is reorder.
       * @return {Object} boolean
       */
      DragDropColumns.prototype.isReorder = function () {
        return this.layout.isReorder();
      };
      /**
       * Returns true if is reorder column.
       * @return {Object} boolean
       */
      DragDropColumns.prototype.isReorderColumn = function () {
        return this.layout.isReorderColumn();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumns.prototype.sourceIsChild = function () {
        return this.layout.sourceIsChild();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumns.prototype.getSourceColumnIndex = function () {
        return this.layout.getSourceColumnIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropColumns.prototype.getSourceBlockIndex = function () {
        return this.layout.getSourceBlockIndex();
      };
      /**
       * @param column
       * @param idx
       * @param columns
       * @return {Object} AssignmentExpression
       */
      DragDropColumns.prototype._buildColumn = function (column, idx, columns) {
        /**
         * The previous.
         */
        var previous, ref;
        previous = ((ref = columns[idx - 1]) != null ? ref.upperX : void 0) || 0;
        column.id = idx;
        column.height = this.layout.getHeight();
        column.width = this.layout.getWidth() * column.widthPct;
        column.upperX = previous + this.layout.getWidth() * column.widthPct;
        return column.lowerX = previous;
      };
      /**
       * @param x
       */
      DragDropColumns.prototype.getColumn = function (x) {
        return this.find(function (column) {
          return x >= column.get('lowerX') && x <= column.get('upperX');
        });
      };
      return DragDropColumns;
    })(Backbone.Collection);
  });