define(['underscore', 'jquery', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/drag-drop/insert-marker
   * @requires underscore
   * @requires jquery
   * @requires column-and-block-layout-editor-path/constants
   */
  function (_, $, constants) {
    /**
     * The block actions.
     */
    var BLOCK_ACTIONS, CABLE_INSERTION_MARKER_CLASS, COLUMN_ACTIONS, InsertionMarker;
    CABLE_INSERTION_MARKER_CLASS = 'insert-column-marker';
    COLUMN_ACTIONS = [constants.DRAG_DROP.ACTIONS.INSERT_COLUMN, constants.DRAG_DROP.ACTIONS.MOVE_COLUMN, constants.DRAG_DROP.ACTIONS.REORDER_COLUMN];
    BLOCK_ACTIONS = [constants.DRAG_DROP.ACTIONS.INSERT_BLOCK, constants.DRAG_DROP.ACTIONS.MOVE_BLOCK, constants.DRAG_DROP.ACTIONS.REORDER_BLOCK];
    return InsertionMarker = ( /**@lends module:src/drag-drop/insert-marker~InsertionMarker# */ function () {
      /**
       * @constructor
       * @param view
       */
      function InsertionMarker(view) {
        this.view = view;
        this.previousAction = null;
      }
      /**
       * @param dropAction
       */
      InsertionMarker.prototype.showMarker = function (dropAction) {
        /**
         * The action.
         */
        var action;
        if (this._repeatAction(dropAction)) {
          return;
        }
        this.removeAll();
        action = dropAction.action;
        switch (false) {
        case indexOf.call(COLUMN_ACTIONS, action) < 0:
          this._insertColumnMarker(dropAction);
          break;
        case indexOf.call(BLOCK_ACTIONS, action) < 0:
          this._insertBlockMarker(dropAction);
        }
        return this.previousAction = dropAction;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      InsertionMarker.prototype.removeAll = function () {
        this.previousAction = null;
        return this.view.$("." + CABLE_INSERTION_MARKER_CLASS).remove();
      };
      /**
       * @param dropAction
       */
      InsertionMarker.prototype._insertColumnMarker = function (dropAction) {
        /**
         * The $insertion marker.
         */
        var $insertionMarker, column;
        $insertionMarker = $("<div class='" + CABLE_INSERTION_MARKER_CLASS + "'>");
        column = this.view.$(constants.SELECTORS.COLUMNS).get(dropAction.markerColumnId);
        return $insertionMarker.addClass("insert-" + dropAction.markerDirection).appendTo(column);
      };
      /**
       * @param dropAction
       */
      InsertionMarker.prototype._insertBlockMarker = function (dropAction) {
        /**
         * The $insertion marker.
         */
        var $insertionMarker, block, column;
        $insertionMarker = $("<div class='" + CABLE_INSERTION_MARKER_CLASS + "'>");
        column = this.view.$(constants.SELECTORS.COLUMNS).get(dropAction.markerColumnId);
        block = $(column).find(constants.SELECTORS.BLOCKS).get(dropAction.markerBlockId);
        return $insertionMarker.addClass("insert-" + dropAction.markerDirection).appendTo(block);
      };
      /**
       * @param dropAction
       * @return {Boolean}
       */
      InsertionMarker.prototype._repeatAction = function (dropAction) {
        return _(this.previousAction).isObject() && _.isEqual(this.previousAction, dropAction);
      };
      return InsertionMarker;
    })();
  });