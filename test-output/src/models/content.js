define(['underscore', 'jquery', 'backbone', 'debug', 'galileo-lib/modules/events', 'galileo-lib/modules/galileo-event', 'galileo-lib/modules/services/descriptors/block/block-descriptor',
    'column-and-block-layout-editor-path/constants', 'galileo-lib/modules/services/editor-lifecycle-service'
  ],
  /**
   * @exports src/models/content
   * @requires underscore
   * @requires jquery
   * @requires backbone
   * @requires debug
   * @requires galileo-lib/modules/events
   * @requires galileo-lib/modules/galileo-event
   * @requires galileo-lib/modules/services/descriptors/block/block-descriptor
   * @requires column-and-block-layout-editor-path/constants
   * @requires galileo-lib/modules/services/editor-lifecycle-service
   */
  function (_, $, Backbone, Debug, galileoEvents, GalileoEvent, BlockDescriptor, constants, lifecycle) {
    /**
     * The content model.
     */
    var ContentModel, debug;
    debug = Debug('ContentModel');
    return ContentModel = ( /**@lends module:src/models/content~ContentModel# */ function (superClass) {
      extend(ContentModel, superClass);
      /**
       * @constructor
       */
      function ContentModel() {
        this._cleanup = bind(this._cleanup, this);
        this.blockDescriptorProviderFn = bind(this.blockDescriptorProviderFn, this);
        this._updateContents = bind(this._updateContents, this);
        return ContentModel.__super__.constructor.apply(this, arguments);
      }
      ContentModel.prototype.idAttribute = 'name';
      ContentModel.prototype.contentEditorStateMap = null;
      ContentModel.prototype.editor = null;
      ContentModel.prototype.editorReady = null;
      /**
       * @param options
       */
      ContentModel.prototype.initializeContentEditor = function (options) {
        if (options == null) {
          options = {};
        }
        return this._createContentEditor(options);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.toState = function () {
        /**
         * The state.
         */
        var state;
        state = this.toJSON();
        if (this.hasChild()) {
          state.child = this.getChildContentModel().toState();
        }
        return state;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._editorState = function () {
        return this.contentEditorStateMap.get(this.get('name')).state;
      };
      /**
       * @param contentJSON
       */
      ContentModel.prototype.createChild = function (contentJSON) {
        this.child = new ContentModel(contentJSON, {
          eventEmitter: this.eventEmitter,
          contentEditorFactory: this.contentEditorFactory,
          contentEditorStateMap: this.contentEditorStateMap,
          collection: this.collection,
          parent: this
        });
        return this.trigger(constants.EVENTS.CHILD_CREATED);
      };
      /**
       * @param options
       * @return {Object} ThisExpression
       */
      ContentModel.prototype.remove = function (options) {
        if (options == null) {
          options = {};
        }
        _(options).defaults({
          evenlySplit: true
        });
        if (this.isChild()) {
          this.parent.removeChild(options);
          return this;
        } else {
          return this.collection.remove(this, options);
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.getName = function () {
        return this.get('name');
      };
      /**
       * @param options
       */
      ContentModel.prototype.removeChild = function (options) {
        if (this.child) {
          this.child.deactivate(options);
          this.child = null;
          this.set({
            child: null
          });
          return this.trigger(constants.EVENTS.CHILD_REMOVED);
        }
      };
      /**
       * @return {Object} UnaryExpression
       */
      ContentModel.prototype.hasChild = function () {
        return !!this.child;
      };
      /**
       * Returns true if is child.
       * @return {Object} boolean
       */
      ContentModel.prototype.isChild = function () {
        return !!this.parent;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.getChildContentModel = function () {
        return this.child;
      };
      /**
       * @param state
       */
      ContentModel.prototype._updateContents = function (state) {
        return this.contentEditorStateMap.set(this.get('name'), {
          name: this.get('name'),
          state: state
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.getStateForBlockDescriptor = function () {
        /**
         * The state.
         */
        var state;
        state = _.extend(this.toJSON(), this.contentEditorStateMap.get(this.get('name')));
        if (this.hasChild()) {
          state.child = this.getChildContentModel().getStateForBlockDescriptor();
        }
        return state;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.blockDescriptorProviderFn = function () {
        /**
         * The block descriptor.
         */
        var blockDescriptor, ref;
        blockDescriptor = new BlockDescriptor(_.extend(this.collection.block.getMetadata(), {
          id: this.get('name'),
          sourceIsChildContent: !!this.parent,
          sourceParentName: (ref = this.parent) != null ? ref.getName() : void 0,
          payload: {
            contents: [this.getStateForBlockDescriptor()]
          }
        }));
        return blockDescriptor.stringify();
      };
      /**
       * @param options
       */
      ContentModel.prototype._createContentEditor = function (options) {
        if (options == null) {
          options = {};
        }
        return this.contentEditorFactory.legacyCreate(this.get('type'), this.get('name'), this._editorState(), this.blockDescriptorProviderFn, this).then((function (_this) {
          return function (editor) {
            /**
             * The actual create.
             */
            var actualCreate, ref, ref1;
            actualCreate = options != null ? options.actualCreate : void 0;
            if (!actualCreate) {
              actualCreate = _this.get('actualCreate');
            }
            if (!actualCreate) {
              actualCreate = (ref = editor.config) != null ? ref.copied : void 0;
            }
            if (!actualCreate) {
              actualCreate = ((options != null ? (ref1 = options.previousAction) != null ? ref1.id : void 0 : void 0) === editor.name) || false;
            }
            debug("Creating editor " + editor.name + ", actualCreate = " + actualCreate);
            return editor.init(actualCreate).then(function () {
              return _this._onEditorInitialized(editor);
            });
          };
        })(this));
      };
      /**
       * @param editor1
       */
      ContentModel.prototype._onEditorInitialized = function (editor1) {
        this.editor = editor1;
        this._setDefaultVspace();
        this.unset('actualCreate', {
          silent: true
        });
        this.editor.on(constants.EVENTS.STATE_REPLACED, this._updateContents);
        this.trigger(constants.EVENTS.CONTENT_EDITOR_CREATED);
        return galileoEvents.on(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._cleanup = function () {
        this.editor = null;
        return galileoEvents.off(galileoEvents.TYPES.EDITOR_REINIT, this._cleanup);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._onEditorStateUpdated = function () {
        return $.when(this.editor.getState()).then(this._updateContents);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.getEditor = function () {
        return this.editor;
      };
      /**
       * @return {array}
       */
      ContentModel.prototype.getEditors = function () {
        if (this.hasChild()) {
          return [this.editor, this.getChildContentModel().getEditor()];
        } else {
          return this.editor;
        }
      };
      /**
       * @return {array}
       */
      ContentModel.prototype.getContent = function () {
        if (this.hasChild()) {
          return [this, this.getChildContentModel()];
        } else {
          return this;
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.whenEditorReady = function () {
        return this.editorReady.promise();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.getWidthPx = function () {
        return this.collection.getWidthPx();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.hasContentLeft = function () {
        return this.collection.hasContentLeft();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.hasContentRight = function () {
        return this.collection.hasContentRight();
      };
      /**
       * @param totalBlockHorizontalPadding
       */
      ContentModel.prototype.triggerInsertedIntoBlock = function (totalBlockHorizontalPadding) {
        /**
         * The event.
         */
        var event, width;
        width = this.getWidthPx() - totalBlockHorizontalPadding;
        if (this.isChild()) {
          if (this.get('childContentJustCreated') === true) {
            event = new GalileoEvent(constants.DOWNSTREAM_EVENTS.INITIALIZE_AS_CHILD, {
              async: true
            });
            this.set('childContentJustCreated', false);
          } else {
            event = new GalileoEvent(constants.DOWNSTREAM_EVENTS.INSERTED_INTO_BLOCK_AS_CHILD, {
              async: true
            });
          }
        } else {
          event = new GalileoEvent(constants.DOWNSTREAM_EVENTS.INSERTED_INTO_BLOCK, {
            async: true
          });
        }
        return this.editor.trigger(event, {
          width: width
        }).then((function (_this) {
          return function () {
            lifecycle.when(lifecycle.EVENTS.INITIALIZATION_COMPLETE).then(function () {
              return _this.eventEmitter.trigger(constants.EVENTS.CONTENT_INSERTED);
            });
            return _this.editorReady.resolve();
          };
        })(this));
      };
      /**
       * @param options
       */
      ContentModel.prototype.deactivate = function (options) {
        /**
         * The actual delete.
         */
        var actualDelete;
        if (options == null) {
          options = {};
        }
        actualDelete = options.actualDelete || false;
        if (options.previousAction != null) {
          if ((options.previousAction != null) && options.previousAction.id === this.editor.name) {
            actualDelete = true;
          }
        }
        return this.eventEmitter.trigger(constants.EVENTS.DEACTIVATE_EDITOR, this.editor, actualDelete);
      };
      /**
       * @return {Boolean}
       */
      ContentModel.prototype.getDecoratorType = function () {
        return this.get('decoratorType') || this.get('type');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype.toggleVspace = function () {
        /**
         * The vspace.
         */
        var vspace;
        vspace = !!this.get('vspace');
        return this.set('vspace', !vspace);
      };
      /**
       * @return {Boolean}
       */
      ContentModel.prototype.supportsContentVspace = function () {
        /**
         * The type supported.
         */
        var typeSupported;
        typeSupported = constants.CONTENT_VSPACE.SUPPORT.indexOf(this.get('type')) !== -1;
        return typeSupported && !this.isChild();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._setVspace = function () {
        if (this.get('vspace') === void 0) {
          return this.set('vspace', true);
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._setDefaultVspace = function () {
        if (this.supportsContentVspace()) {
          return this._setVspace();
        }
      };
      /**
       * @param state
       * @param opts
       */
      ContentModel.prototype.initialize = function (state, opts) {
        this.editorReady = $.Deferred();
        this.eventEmitter = opts.eventEmitter;
        this.contentEditorFactory = opts.contentEditorFactory;
        this.contentEditorStateMap = opts.contentEditorStateMap;
        this.on(constants.EVENTS.EDITOR_STATE_UPDATED, this._onEditorStateUpdated, this);
        this._setChild();
        this.parent = opts.parent;
        return this.listenTo(this, 'change', this._setChild);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentModel.prototype._setChild = function () {
        /**
         * The child.
         */
        var child;
        child = this.get('child');
        if (child) {
          return this.createChild(child);
        } else {
          return this.removeChild();
        }
      };
      return ContentModel;
    })(Backbone.Model);
  });