define(['column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/drag-drop/block-model-dispatcher
   * @requires column-and-block-layout-editor-path/constants
   */
  function (constants) {
    /**
     * The block model dispatcher.
     */
    var BlockModelDispatcher;
    return BlockModelDispatcher = ( /**@lends module:src/drag-drop/block-model-dispatcher~BlockModelDispatcher# */ function () {
      /**
       * @constructor
       * @param eventEmitter
       */
      function BlockModelDispatcher(eventEmitter) {
        this.eventEmitter = eventEmitter;
      }
      /**
       * @param content
       * @param type
       * @param dropAction
       */
      BlockModelDispatcher.prototype.dispatch = function (content, type, dropAction) {
        /**
         * The action.
         */
        var action;
        action = dropAction.action;
        switch (action) {
        case constants.DRAG_DROP.ACTIONS.INSERT_COLUMN:
          return this.eventEmitter.trigger(constants.EVENTS.INSERT_COLUMN, dropAction.columnId, content, type);
        case constants.DRAG_DROP.ACTIONS.INSERT_BLOCK:
          return this.eventEmitter.trigger(constants.EVENTS.INSERT_BLOCK, dropAction.columnId, dropAction.blockId, content, type);
        case constants.DRAG_DROP.ACTIONS.MOVE_COLUMN:
          return this.eventEmitter.trigger(constants.EVENTS.MOVE_COLUMN, dropAction.columnId, content, type);
        case constants.DRAG_DROP.ACTIONS.MOVE_BLOCK:
          return this.eventEmitter.trigger(constants.EVENTS.MOVE_BLOCK, dropAction.columnId, dropAction.blockId, content, type);
        case constants.DRAG_DROP.ACTIONS.REORDER_COLUMN:
          return this.eventEmitter.trigger(constants.EVENTS.REORDER_COLUMN, dropAction.columnId, content, type);
        case constants.DRAG_DROP.ACTIONS.REORDER_BLOCK:
          return this.eventEmitter.trigger(constants.EVENTS.REORDER_BLOCK, dropAction.columnId, dropAction.blockId, content, type);
        }
      };
      return BlockModelDispatcher;
    })();
  });