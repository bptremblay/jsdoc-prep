define(['jquery', 'underscore', 'backbone', 'text!column-and-block-layout-editor-path/templates/column-resize-handle.html', 'column-and-block-layout-editor-path/percentage-utils',
    'column-and-block-layout-editor-path/column-resize-manager', 'column-and-block-layout-editor-path/constants'
  ],
  /**
   * @exports src/views/column-resize-handle
   * @requires jquery
   * @requires underscore
   * @requires backbone
   * @requires text!column-and-block-layout-editor-path/templates/column-resize-handle.html
   * @requires column-and-block-layout-editor-path/percentage-utils
   * @requires column-and-block-layout-editor-path/column-resize-manager
   * @requires column-and-block-layout-editor-path/constants
   */
  function ($, _, Backbone, template, percentageUtils, columnResizeManager, constants) {
    /**
     * The column resize handle.
     */
    var ColumnResizeHandle;
    return ColumnResizeHandle = ( /**@lends module:src/views/column-resize-handle~ColumnResizeHandle# */ function (superClass) {
      extend(ColumnResizeHandle, superClass);
      /**
       * @constructor
       */
      function ColumnResizeHandle() {
        this._onColumnResize = bind(this._onColumnResize, this);
        return ColumnResizeHandle.__super__.constructor.apply(this, arguments);
      }
      ColumnResizeHandle.prototype.events = {
        mousedown: '_startResizingColumn'
      };
      /**
       * @return {Object} AssignmentExpression
       */
      ColumnResizeHandle.prototype.initialize = function () {
        return this.layoutContainerWidth = this.model.getLayoutContainerWidth();
      };
      /**
       * @param event
       */
      ColumnResizeHandle.prototype._startResizingColumn = function (event) {
        event.preventDefault();
        if (columnResizeManager.isResizing()) {
          return;
        }
        this.$el.find('.grabber').addClass('is-resizing');
        return columnResizeManager.startResizing(event.clientX, this._onColumnResize, this._finishResizingColumn, this.model.getLayoutReadyPromise);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnResizeHandle.prototype._finishResizingColumn = function () {
        return $('.grabber.is-resizing').removeClass('is-resizing');
      };
      /**
       * @param deltaInPixels
       */
      ColumnResizeHandle.prototype._onColumnResize = function (deltaInPixels) {
        /**
         * The calculated delta.
         */
        var calculatedDelta, deltaInDecimal, numberOfSteps;
        deltaInDecimal = percentageUtils.truncateDecimal(deltaInPixels / this.layoutContainerWidth);
        if (Math.abs(deltaInDecimal) >= constants.COLUMN_WIDTH.INTERVAL) {
          numberOfSteps = Math.floor(deltaInDecimal / constants.COLUMN_WIDTH.INTERVAL);
          calculatedDelta = constants.COLUMN_WIDTH.INTERVAL * numberOfSteps;
          return this.model.applyDeltaToColumnWidth(percentageUtils.truncateDecimal(calculatedDelta));
        } else {
          return false;
        }
      };
      /**
       * @return {Object} ThisExpression
       */
      ColumnResizeHandle.prototype.render = function () {
        this.$el.html(template);
        if (columnResizeManager.isResizing()) {
          this.$el.find('.grabber').addClass('is-resizing');
        }
        return this;
      };
      return ColumnResizeHandle;
    })(Backbone.View);
  });