define(['backbone', 'column-and-block-layout-editor-path/constants', 'constants', 'plugins/drag', 'css!column-and-block-layout-editor-path/css/cable'],
  /**
   * @exports src/views/move-handle
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires constants
   * @requires plugins/drag
   * @requires css!column-and-block-layout-editor-path/css/cable
   * @requires underscore
   */
  function (Backbone, constants, engineConstants) {
    /**
     * The move handle.
     */
    var MoveHandle;
    return MoveHandle = ( /**@lends module:src/views/move-handle~MoveHandle# */ function (superClass) {
      extend(MoveHandle, superClass);
      /**
       * @constructor
       */
      function MoveHandle() {
        this._toggleHover = bind(this._toggleHover, this);
        return MoveHandle.__super__.constructor.apply(this, arguments);
      }
      MoveHandle.prototype.tagName = 'a';
      MoveHandle.prototype.attributes = {
        href: '#',
        draggable: true,
        "class": 'gl-block-move-handle'
      };
      MoveHandle.prototype.events = {
        click: '_preventDefault',
        mouseenter: '_toggleHover',
        mouseleave: '_toggleHover'
      };
      /**
       * @return {Function}
       */
      MoveHandle.prototype.render = function () {
        this.$el.attr(constants.DATA_ATTRS.REMOVE_ON_PUBLISH, true);
        this.$el.attr(engineConstants.editor.standardAttrs.dragDrop.passthrough, true);
        this.$el.drag({
          type: constants.TYPES.BLOCK,
          data: (function (_this) {
            return function () {
              return _this.model.toBlockDescriptor().stringify();
            };
          })(this),
          start: (function (_this) {
            return function (event) {
              /**
               * The base.
               */
              var base, offset, uiEvent, xOffset, yOffset;
              uiEvent = event.originalEvent;
              offset = $(event.target).offset();
              xOffset = uiEvent.pageX - offset.left;
              yOffset = uiEvent.pageY - offset.top;
              return typeof (base = uiEvent.dataTransfer).setDragImage === "function" ? base.setDragImage(_this.$el.parent().get(0), xOffset, yOffset) : void 0;
            };
          })(this)
        });
        return this;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      MoveHandle.prototype._toggleHover = function () {
        return this.$el.toggleClass('hover');
      };
      /**
       * @param event
       */
      MoveHandle.prototype._preventDefault = function (event) {
        return event.preventDefault();
      };
      return MoveHandle;
    })(Backbone.View);
  });