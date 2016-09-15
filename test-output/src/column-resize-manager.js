define(['jquery', 'galileo-lib/modules/events', 'galileo-lib/modules/services/usage-tracking'],
  /**
   * @exports src/column-resize-manager
   * @requires jquery
   * @requires galileo-lib/modules/events
   * @requires galileo-lib/modules/services/usage-tracking
   */
  function ($, galileoEvents, usageTracking) {
    /**
     * The column resize manager.
     */
    var ColumnResizeManager;
    ColumnResizeManager = ( /**@lends module:src/column-resize-manager~=# */ function () {
      /**
       * @constructor
       */
      function ColumnResizeManager() {
        this._mutex = false;
      }
      /**
       * @param _lastXValue
       * @param resizeFunction
       * @param resetFunction
       * @param _donePromise
       */
      ColumnResizeManager.prototype.startResizing = function (_lastXValue, resizeFunction, resetFunction, _donePromise) {
        this._lastXValue = _lastXValue;
        this._donePromise = _donePromise;
        this._mutex = true;
        galileoEvents.trigger('global-state-update:start');
        return this._setupMousemove(resizeFunction, resetFunction);
      };
      /**
       * Returns true if is resizing.
       * @return {Object} boolean
       */
      ColumnResizeManager.prototype.isResizing = function () {
        return !!this._mutex;
      };
      /**
       * @param resizeFunction
       * @param resetFunction
       * @return {Function}
       */
      ColumnResizeManager.prototype._setupMousemove = function (resizeFunction, resetFunction) {
        $(document).on('mousemove.gl-column-resize', (function (_this) {
          return function (event) {
            /**
             * The delta in pixels.
             */
            var deltaInPixels, resized;
            deltaInPixels = event.clientX - _this._lastXValue;
            resized = resizeFunction.call(resizeFunction, deltaInPixels);
            if (resized) {
              return _this._lastXValue = event.clientX;
            }
          };
        })(this));
        return $(document).one('mouseup.gl-column-resize', (function (_this) {
          return function () {
            return _this._reset(resetFunction);
          };
        })(this));
      };
      /**
       * @param resetFunction
       */
      ColumnResizeManager.prototype._reset = function (resetFunction) {
        this._mutex = false;
        resetFunction.call(resetFunction);
        $(document).off('mousemove.gl-column-resize');
        usageTracking.track('editor_action', {
          actionIdentifier: 'g_block_action>main>colresize'
        });
        return this._donePromise().then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
      };
      return ColumnResizeManager;
    })();
    return new ColumnResizeManager();
  });