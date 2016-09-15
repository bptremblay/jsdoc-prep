define(['galileo-lib/modules/events', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/drag-drop/helpers', 'column-and-block-layout-editor-path/drag-drop/layout',
    'column-and-block-layout-editor-path/drag-drop/insert-marker', 'column-and-block-layout-editor-path/drag-drop/block-model-dispatcher'
  ],
  /**
   * @exports src/drag-drop/api
   * @requires galileo-lib/modules/events
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/drag-drop/helpers
   * @requires column-and-block-layout-editor-path/drag-drop/layout
   * @requires column-and-block-layout-editor-path/drag-drop/insert-marker
   * @requires column-and-block-layout-editor-path/drag-drop/block-model-dispatcher
   */
  function (galileoEvents, constants, helpers, DragDropLayout, InsertionMarker, BlockModelDispatcher) {
    /**
     * The drag drop api.
     */
    var DragDropApi;
    return DragDropApi = ( /**@lends module:src/drag-drop/api~DragDropApi# */ function () {
      /**
       * @constructor
       * @param layoutEditor
       * @param model
       * @param view
       */
      function DragDropApi(layoutEditor, model, view) {
        this.layoutEditor = layoutEditor;
        this.model = model;
        this.view = view;
        this.DragDropLayout = DragDropLayout;
        this.InsertionMarker = InsertionMarker;
        this.BlockModelDispatcher = BlockModelDispatcher;
      }
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropApi.prototype.init = function () {
        this.insertionMarker = new this.InsertionMarker(this.view);
        this.blockModelDispatcher = new this.BlockModelDispatcher(this.layoutEditor);
        return this._initEvents();
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       * @return {Boolean}
       */
      DragDropApi.prototype.acceptsContent = function (content, type, uiEvent) {
        if (type === constants.TYPES.LAYOUT) {
          return false;
        }
        return this._actionableEvent(uiEvent);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      DragDropApi.prototype._initEvents = function () {
        this.layoutEditor.on('drag-drop:dragenter', this._onDragenter, this);
        this.layoutEditor.on('drag-drop:dragover', this._onDragover, this);
        this.layoutEditor.on('drag-drop:dragleave', this._onDragleave, this);
        return this.layoutEditor.on('drag-drop:drop', this._onDrop, this);
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       * @return {Object} AssignmentExpression
       */
      DragDropApi.prototype._onDragenter = function (content, type, uiEvent) {
        return this.dragDropLayout = new this.DragDropLayout(this.view.getDimensions(), {
          type: type,
          content: content,
          instanceId: this.layoutEditor._getInstanceId(),
          atMaxColumns: this.model.atMaxColumns()
        });
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       */
      DragDropApi.prototype._onDragover = function (content, type, uiEvent) {
        /**
         * The drop action.
         */
        var dropAction;
        dropAction = this._getAction(uiEvent);
        return this.insertionMarker.showMarker(dropAction);
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       */
      DragDropApi.prototype._onDrop = function (content, type, uiEvent) {
        /**
         * The drop action.
         */
        var dropAction;
        this.insertionMarker.removeAll();
        dropAction = this._getAction(uiEvent);
        return this.blockModelDispatcher.dispatch(content, type, dropAction);
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       */
      DragDropApi.prototype._onDragleave = function (content, type, uiEvent) {
        return this.insertionMarker.removeAll();
      };
      /**
       * @param uiEvent
       */
      DragDropApi.prototype._getAction = function (uiEvent) {
        /**
         * The x.
         */
        var x, y;
        y = helpers.getRelativeY(uiEvent, this.view.$el.offset().top);
        x = helpers.getRelativeX(uiEvent, this.view.$el.offset().left);
        return this.dragDropLayout.getAction(x, y);
      };
      /**
       * @param uiEvent
       */
      DragDropApi.prototype._actionableEvent = function (uiEvent) {
        /**
         * The height.
         */
        var height, offset, width;
        width = this.view.$el.outerWidth();
        height = this.view.$el.outerHeight();
        offset = this.view.$el.offset();
        return helpers.actionableEvent(uiEvent, width, height, offset);
      };
      return DragDropApi;
    })();
  });