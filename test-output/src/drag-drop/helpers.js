define(['column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/drag-drop/helpers
   * @requires column-and-block-layout-editor-path/constants
   */
  function (constants) {
    return /**@alias module:src/drag-drop/helpers */ {
      /**
       * @param uiEvent
       * @param width
       * @param height
       * @param offset
       * @return {Boolean}
       */
      actionableEvent: function (uiEvent, width, height, offset) {
        /**
         * The point.
         */
        var point, xInRange, yInRange, yOffset, yOffsetCap;
        yOffset = constants.DRAG_DROP.SETTINGS.LAYOUT_PASSTHROUGH_PCT;
        yOffsetCap = constants.DRAG_DROP.SETTINGS.LAYOUT_PASSTHROUGH_CAP;
        point = this.getRelativePoint(uiEvent, offset);
        xInRange = this.within(point.x, width);
        yInRange = this.within(point.y, height, yOffset, yOffsetCap);
        return xInRange && yInRange;
      },
      /**
       * @param position
       * @param dimension
       * @param offset
       * @param offsetCap
       * @return {Boolean}
       */
      within: function (position, dimension, offset, offsetCap) {
        /**
         * The dimension offset.
         */
        var dimensionOffset;
        if (offset == null) {
          offset = 0;
        }
        if (offsetCap == null) {
          offsetCap = null;
        }
        dimensionOffset = dimension * offset;
        if (offsetCap) {
          dimensionOffset = Math.min(dimensionOffset, offsetCap);
        }
        return position >= dimensionOffset && position <= dimension - dimensionOffset;
      },
      /**
       * @param uiEvent
       * @param leftOffset
       */
      getRelativeX: function (uiEvent, leftOffset) {
        return Math.round(uiEvent.pageX - leftOffset);
      },
      /**
       * @param uiEvent
       * @param topOffset
       */
      getRelativeY: function (uiEvent, topOffset) {
        return Math.round(uiEvent.pageY - topOffset);
      },
      /**
       * @param uiEvent
       * @param offset
       */
      getRelativePoint: function (uiEvent, offset) {
        return {
          x: this.getRelativeX(uiEvent, offset.left),
          y: this.getRelativeY(uiEvent, offset.top)
        };
      }
    };
  });