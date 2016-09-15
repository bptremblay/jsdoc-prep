define(['underscore', 'backbone', 'galileo-lib/modules/services/descriptors/block/block-descriptor', 'utils', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/models/content-editor-state-map
   * @requires underscore
   * @requires backbone
   * @requires galileo-lib/modules/services/descriptors/block/block-descriptor
   * @requires utils
   * @requires column-and-block-layout-editor-path/constants
   */
  function (_, Backbone, BlockDescriptor,
    utils, constants) {
    /**
     * The content editor state map.
     */
    var ContentEditorStateMap;
    return ContentEditorStateMap = ( /**@lends module:src/models/content-editor-state-map~ContentEditorStateMap# */ function (superClass) {
      extend(ContentEditorStateMap, superClass);
      /**
       * @constructor
       */
      function ContentEditorStateMap() {
        return ContentEditorStateMap.__super__.constructor.apply(this, arguments);
      }
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentEditorStateMap.prototype.getContents = function () {
        return _(this.attributes).clone();
      };
      /**
       * @param contents
       */
      ContentEditorStateMap.prototype.setContents = function (contents) {
        return this.set(_(contents).omit(this.keys()));
      };
      /**
       * @param blockDescriptor
       */
      ContentEditorStateMap.prototype._createStateFromBlockDescriptor = function (blockDescriptor) {
        /**
         * The contents.
         */
        var contents, newBlockDescriptor;
        contents = blockDescriptor.payload.contents.map(this._createStateFromContentEditorState, this);
        newBlockDescriptor = new BlockDescriptor(_.extend(blockDescriptor.toJSON(), {
          id: contents[0].name,
          payload: {
            contents: contents
          }
        }));
        return newBlockDescriptor;
      };
      /**
       * @param ceState
       */
      ContentEditorStateMap.prototype._createStateFromContentEditorState = function (ceState) {
        while (this.has(ceState.name)) {
          ceState = this._randomizeContentEditorStateName(ceState);
        }
        this.set(ceState.name, ceState);
        if (ceState.child) {
          ceState.child = this._createStateFromContentEditorState(ceState.child);
        }
        return ceState;
      };
      /**
       * @param state
       * @param contentType
       */
      ContentEditorStateMap.prototype.createState = function (state, contentType) {
        if (contentType === constants.TYPES.BLOCK) {
          return this._createStateFromBlockDescriptor(state);
        } else {
          return this._createStateFromContentEditorState(state);
        }
      };
      /**
       * @param content
       */
      ContentEditorStateMap.prototype._randomizeContentEditorStateName = function (content) {
        /**
         * The prefix.
         */
        var prefix, randomizedContent;
        randomizedContent = _(content).clone();
        prefix = utils.instanceId.stripTimestamp(randomizedContent.name);
        randomizedContent.name = utils.instanceId.next(prefix);
        return randomizedContent;
      };
      /**
       * @param contentEditors
       */
      ContentEditorStateMap.prototype.refresh = function (contentEditors) {
        /**
         * The deferred states.
         */
        var deferredStates;
        deferredStates = _(contentEditors).map(function (editor) {
          /**
           * The on state ready.
           */
          var onStateReady, state;
          state = editor.getState();
          /**
           * @param editor
           * @param state
           */
          onStateReady = function (editor, state) {
            return {
              name: editor._getName(),
              state: state
            };
          };
          return $.when(state).then(onStateReady.bind(this, editor));
        });
        return $.when.apply(this, deferredStates).then((function (_this) {
          return function () {
            /**
             * The i.
             */
            var i, len, result;
            for (i = 0, len = arguments.length; i < len; i++) {
              result = arguments[i];
              _this.set(result.name, result);
            }
            return void 0;
          };
        })(this));
      };
      return ContentEditorStateMap;
    })(Backbone.Model);
  });