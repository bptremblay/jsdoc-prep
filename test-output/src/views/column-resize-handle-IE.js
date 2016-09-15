define(['jquery', 'backbone', 'text!column-and-block-layout-editor-path/templates/column-resize-handle.html', 'column-and-block-layout-editor-path/percentage-utils',
    'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/column-resize-manager'
  ],
  /**
   * @exports src/views/column-resize-handle-IE
   * @requires jquery
   * @requires backbone
   * @requires text!column-and-block-layout-editor-path/templates/column-resize-handle.html
   * @requires column-and-block-layout-editor-path/percentage-utils
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/column-resize-manager
   * @requires underscore
   */
  function ($, Backbone, template, percentageUtils, constants, columnResizeManager) {
    /**
     * The column resize handle IE.
     */
    var ColumnResizeHandleIE;
    return ColumnResizeHandleIE = ( /**@lends module:src/views/column-resize-handle-IE~ColumnResizeHandleIE# */ function (superClass) {
      extend(ColumnResizeHandleIE, superClass);
      /**
       * @constructor
       */
      function ColumnResizeHandleIE() {
        this._dragHandle = bind(this._dragHandle, this);
        this._finishResizingColumn = bind(this._finishResizingColumn, this);
        return ColumnResizeHandleIE.__super__.constructor.apply(this, arguments);
      }
      ColumnResizeHandleIE.prototype.events = {
        mousedown: '_startResizingColumn'
      };
      /**
       * @return {Object} AssignmentExpression
       */
      ColumnResizeHandleIE.prototype.initialize = function () {
        return this.layoutContainerWidth = this.model.getLayoutContainerWidth();
      };
      /**
       * @param event
       */
      ColumnResizeHandleIE.prototype._startResizingColumn = function (event) {
        event.preventDefault();
        if (columnResizeManager.isResizing()) {
          return;
        }
        this.$el.find('.grabber').addClass('is-resizing');
        return columnResizeManager.startResizing(event.clientX, this._dragHandle, this._finishResizingColumn, this.model.getLayoutReadyPromise);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnResizeHandleIE.prototype._finishResizingColumn = function () {
        return this.model.resizeColumnFromHandle(this._getColumnPercentage());
      };
      /**
       * @param deltaInPixels
       */
      ColumnResizeHandleIE.prototype._dragHandle = function (deltaInPixels) {
        /**
         * The column width is at max or min.
         */
        var columnWidthIsAtMaxOrMin, deltaInDecimal, newColumnPercentage;
        deltaInDecimal = percentageUtils.truncateDecimal(deltaInPixels / this.layoutContainerWidth);
        if (Math.abs(deltaInDecimal) >= constants.COLUMN_WIDTH.INTERVAL) {
          newColumnPercentage = this._calculateNewColumnPercentage(deltaInDecimal);
          columnWidthIsAtMaxOrMin = newColumnPercentage > constants.COLUMN_WIDTH.MAX_PERCENT || newColumnPercentage < constants.COLUMN_WIDTH.MIN_PERCENT;
          if (!columnWidthIsAtMaxOrMin) {
            return this._setColumnPercentage(newColumnPercentage + "%");
          }
        } else {
          return false;
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnResizeHandleIE.prototype._getColumnPercentage = function () {
        /**
         * The resize bar.
         */
        var resizeBar;
        resizeBar = this.$el.find('.column-resize-bar').get(0);
        return parseInt(resizeBar.style.marginRight, 10);
      };
      /**
       * @param newPercentage
       */
      ColumnResizeHandleIE.prototype._setColumnPercentage = function (newPercentage) {
        return this.$el.find('.column-resize-bar').css('margin-right', newPercentage);
      };
      /**
       * @param deltaInDecimal
       */
      ColumnResizeHandleIE.prototype._calculateNewColumnPercentage = function (deltaInDecimal) {
        /**
         * The calculated delta.
         */
        var calculatedDelta, currentColumnPercentage, newColumnPercentage, numberOfSteps;
        numberOfSteps = Math.floor(deltaInDecimal / constants.COLUMN_WIDTH.INTERVAL);
        calculatedDelta = constants.COLUMN_WIDTH.INTERVAL * numberOfSteps;
        currentColumnPercentage = this._getColumnPercentage();
        newColumnPercentage = currentColumnPercentage - (calculatedDelta * 100);
        return newColumnPercentage;
      };
      /**
       * @return {Object} ThisExpression
       */
      ColumnResizeHandleIE.prototype.render = function () {
        this.$el.html(template);
        this._setColumnPercentage((100 - Math.round(this.model.getWidthPct() * 100)) + "%");
        return this;
      };
      return ColumnResizeHandleIE;
    })(Backbone.View);
  });