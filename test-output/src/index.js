define(['underscore', 'underscore.string', 'jquery', 'backbone', 'galileo-lib/modules/events', 'galileo-lib/modules/galileo-event', 'galileo-lib/modules/services/value-service',
    'galileo-lib/modules/services/style-service', 'galileo-lib/modules/services/content-service', 'galileo-lib/modules/services/instantiation-service',
    'galileo-lib/modules/services/prototype-markup-service', 'galileo-lib/modules/services/operator', 'galileo-lib/modules/services/document-feature-service',
    'galileo-lib/modules/managers/error-manager', 'column-and-block-layout-editor-path/state-validator', 'column-and-block-layout-editor-path/constants',
    'column-and-block-layout-editor-path/import/importer', 'column-and-block-layout-editor-path/abstract-layout-generator', 'column-and-block-layout-editor-path/models/layout',
    'column-and-block-layout-editor-path/views/layout', 'column-and-block-layout-editor-path/views/import', 'column-and-block-layout-editor-path/views/publish',
    'column-and-block-layout-editor-path/views/vspace-flyout', 'column-and-block-layout-editor-path/state-migrations', 'column-and-block-layout-editor-path/template-state-migrations',
    'column-and-block-layout-editor-path/drag-drop/api', 'i18n!column-and-block-layout-editor-path/nls/column-and-block-layout-editor'
  ],
  /**
   * @exports src/index
   * @requires underscore
   * @requires underscore.string
   * @requires jquery
   * @requires backbone
   * @requires galileo-lib/modules/events
   * @requires galileo-lib/modules/galileo-event
   * @requires galileo-lib/modules/services/value-service
   * @requires galileo-lib/modules/services/style-service
   * @requires galileo-lib/modules/services/content-service
   * @requires galileo-lib/modules/services/instantiation-service
   * @requires galileo-lib/modules/services/prototype-markup-service
   * @requires galileo-lib/modules/services/operator
   * @requires galileo-lib/modules/services/document-feature-service
   * @requires galileo-lib/modules/managers/error-manager
   * @requires column-and-block-layout-editor-path/state-validator
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/import/importer
   * @requires column-and-block-layout-editor-path/abstract-layout-generator
   * @requires column-and-block-layout-editor-path/models/layout
   * @requires column-and-block-layout-editor-path/views/layout
   * @requires column-and-block-layout-editor-path/views/import
   * @requires column-and-block-layout-editor-path/views/publish
   * @requires column-and-block-layout-editor-path/views/vspace-flyout
   * @requires column-and-block-layout-editor-path/state-migrations
   * @requires column-and-block-layout-editor-path/template-state-migrations
   * @requires column-and-block-layout-editor-path/drag-drop/api
   * @requires i18n!column-and-block-layout-editor-path/nls/column-and-block-layout-editor
   */
  function (_, s, $, Backbone, galileoEvents, GalileoEvent, valueService, styleService, contentService, instantiationService, prototypeMarkupService, operator, documentFeatureService,
    errorManager, stateValidator, constants, importer, AbstractLayoutGenerator, Model, EditView, ImportView, PublishView, vspaceFlyoutView, migrations, templateStateMigrations, DragDropApi, i18n) {
    /**
     * The column and block layout editor.
     */
    var ColumnAndBlockLayoutEditor;
    return ColumnAndBlockLayoutEditor = ( /**@lends module:src/index~ColumnAndBlockLayoutEditor# */ function () {
      /**
       * @constructor
       * @param documentEditor
       * @param config
       */
      function ColumnAndBlockLayoutEditor(documentEditor, config) {
        this.documentEditor = documentEditor;
        this.config = config;
        this.contentEditorFactory = instantiationService.createContentEditorFactory(this);
        this.dynamicContentFactory = contentService.getDynamicContentFactory();
      }
      ColumnAndBlockLayoutEditor.abstractLayoutGenerator = new AbstractLayoutGenerator(prototypeMarkupService);
      /**
       * @param markup
       * @param contentEditors
       * @param actualCreate
       */
      ColumnAndBlockLayoutEditor["import"] = function (markup, contentEditors, actualCreate) {
        return importer["import"](markup, contentEditors, actualCreate);
      };
      /**
       * Returns true if is abstract layout generator.
       * @param documentFeatures
       * @return {Object} boolean
       */
      ColumnAndBlockLayoutEditor.isAbstractLayoutGenerator = function (documentFeatures) {
        return this.abstractLayoutGenerator.isDocumentSupported(documentFeatures);
      };
      /**
       * @param medium
       * @param contentType
       * @param name
       */
      ColumnAndBlockLayoutEditor.getAbstractLayoutMarkup = function (medium, contentType, name) {
        return this.abstractLayoutGenerator.createAbstractLayoutMarkup(name, contentType);
      };
      /**
       * @param layoutMarkup
       * @param contentMarkup
       * @param contentName
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.insertContentMarkup = function (layoutMarkup, contentMarkup, contentName, contentType) {
        return this.abstractLayoutGenerator.insertContentMarkup(layoutMarkup, contentName, contentType, contentMarkup);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.getTemplateStateMigrations = function () {
        return templateStateMigrations["default"];
      };
      /**
       * @param state
       * @param options
       */
      ColumnAndBlockLayoutEditor.prepareState = function (state, options) {
        if (options.actualCreate != null) {
          return state.state.columns.forEach(function (column) {
            return column.blocks.forEach(function (block) {
              return block.contents.forEach(function (content) {
                return content.actualCreate = options.actualCreate;
              });
            });
          });
        }
      };
      /**
       * @param content
       * @param type
       * @param uiEvent
       */
      ColumnAndBlockLayoutEditor.prototype.acceptsContent = function (content, type, uiEvent) {
        return this.dragDropApi.acceptsContent(content, type, uiEvent);
      };
      /**
       * @param actualCreate
       */
      ColumnAndBlockLayoutEditor.prototype.initialize = function (actualCreate) {
        this._initEvents();
        this._initModel();
        this._initViews();
        return this._initDragDrop();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype._initDragDrop = function () {
        this.dragDropApi = new DragDropApi(this, this.model, this.editView);
        return this.dragDropApi.init();
      };
      /**
       * @return {Object} AssignmentExpression
       */
      ColumnAndBlockLayoutEditor.prototype._initModel = function () {
        return this.model = new Model({}, {
          instanceId: this._getInstanceId(),
          eventEmitter: this,
          valueService: valueService,
          contentEditorFactory: this.contentEditorFactory,
          containerWidth: this.config.layoutContainerWidth
        });
      };
      /**
       * @return {Object} AssignmentExpression
       */
      ColumnAndBlockLayoutEditor.prototype._initViews = function () {
        this.editView = new EditView({
          model: this.model,
          prototypeMarkupService: prototypeMarkupService,
          eventEmitter: this
        });
        this.importView = new ImportView({
          model: this.model,
          editView: this.editView
        });
        return this.publishView = new PublishView({
          model: this.model,
          editView: this.editView
        });
      };
      /**
       * @return {Function}
       */
      ColumnAndBlockLayoutEditor.prototype._initEvents = function () {
        /**
         * The ref.
         */
        var ref, ref1, ref2, ref3, ref4;
        this.on(constants.EVENTS.INSERT_COLUMN, this._insertColumn, this);
        this.on(constants.EVENTS.INSERT_BLOCK, this._insertBlock, this);
        this.on(constants.EVENTS.MOVE_COLUMN, this._moveColumn, this);
        this.on(constants.EVENTS.MOVE_BLOCK, this._moveBlock, this);
        this.on(constants.EVENTS.REORDER_COLUMN, this._reorderColumn, this);
        this.on(constants.EVENTS.REORDER_BLOCK, this._reorderBlock, this);
        this.on(constants.EVENTS.STATE_UPDATED, (ref = this.config) != null ? (ref1 = ref.eventHandlers) != null ? (ref2 = ref1.stateUpdated) != null ? ref2.bind(this, this) : void 0 : void 0 :
          void 0);
        this.on(constants.EVENTS.LAYOUT_EMPTY, (function (_this) {
          return function (actualDelete) {
            return galileoEvents.trigger(constants.EVENTS.REMOVE_LAYOUT, _this.instanceId, null, null, actualDelete);
          };
        })(this));
        this.on(constants.EVENTS.DEACTIVATE_EDITOR, this.config.eventHandlers.deactivateEditor);
        this.on(constants.EVENTS.ADD_PLATFORM_ATTRIBUTES, this.addPlatformAttributes);
        this.on(constants.EVENTS.TRACK_USAGE, (ref3 = this.config) != null ? (ref4 = ref3.eventHandlers) != null ? ref4.trackUsage.bind(this, 'editor_action') : void 0 : void 0);
        this.on(constants.EVENTS.REMOVE_BLOCK, this._removeContent, this);
        this.on(constants.EVENTS.INSERT_DESCRIPTOR, this._insertDescriptor, this);
        this.on(constants.EVENTS.INSERT_CHILD_CONTENT, this._insertChildContent, this);
        this.on(constants.EVENTS.INSERT_CHILD_BLOCK, this._insertChildBlock, this);
        this.on(constants.EVENTS.TOGGLE_CONTENT_VSPACE, this._toggleContentVspace, this);
        galileoEvents.on(constants.EVENTS.REMOVE_BLOCK, this._legacyRemoveContent, this);
        galileoEvents.on(constants.EVENTS.MOVE_BLOCK, this._moveBlock, this);
        return galileoEvents.on(galileoEvents.TYPES.EDITOR_REINIT, this._resetEvents, this);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype._resetEvents = function () {
        galileoEvents.off(constants.EVENTS.REMOVE_BLOCK, this._legacyRemoveContent);
        galileoEvents.off(constants.EVENTS.MOVE_BLOCK, this._moveBlock);
        return galileoEvents.off(galileoEvents.TYPES.EDITOR_REINIT, this._resetEvents);
      };
      /**
       * @param position
       * @param contentDescriptor
       * @param contentType
       * @return {Function}
       */
      ColumnAndBlockLayoutEditor.prototype._insertColumn = function (position, contentDescriptor, contentType) {
        this.dynamicContentFactory.createImportedMarkup(contentType, contentDescriptor).then((function (_this) {
          return function (contentEditorState) {
            /**
             * The actual create.
             */
            var actualCreate;
            galileoEvents.trigger('global-state-update:start');
            actualCreate = true;
            return _this.model.addColumn(position, contentType, contentEditorState, actualCreate).then(function () {
              return galileoEvents.trigger('global-state-update:end', {
                action: 'create',
                id: contentEditorState.name
              });
            });
          };
        })(this));
        return this._triggerTrackInsert(contentType);
      };
      /**
       * @param columnIdx
       * @param position
       * @param contentDescriptor
       * @param contentType
       * @return {Function}
       */
      ColumnAndBlockLayoutEditor.prototype._insertBlock = function (columnIdx, position, contentDescriptor, contentType) {
        this.dynamicContentFactory.createImportedMarkup(contentType, contentDescriptor).then((function (_this) {
          return function (contentEditorState) {
            galileoEvents.trigger('global-state-update:start');
            return _this.model.addBlock(columnIdx, position, contentType, contentEditorState, true).then(function () {
              return galileoEvents.trigger('global-state-update:end', {
                action: 'create',
                id: contentEditorState.name
              });
            });
          };
        })(this));
        return this._triggerTrackInsert(contentType);
      };
      /**
       * @param blockName
       * @param descriptor
       * @param contentType
       * @param decoratorType
       * @return {Function}
       */
      ColumnAndBlockLayoutEditor.prototype._insertChildContent = function (blockName, descriptor, contentType, decoratorType) {
        this.dynamicContentFactory.createImportedMarkup(contentType, descriptor).then((function (_this) {
          return function (contentEditorState) {
            galileoEvents.trigger('global-state-update:start');
            return _this.model.addChildContentToBlock(blockName, contentType, contentEditorState, decoratorType).then(function () {
              return galileoEvents.trigger('global-state-update:end', {
                action: 'create',
                id: contentEditorState.name
              });
            });
          };
        })(this));
        return this._triggerTrackInsertChildContent(contentType);
      };
      /**
       * @param blockName
       * @param descriptor
       * @param contentType
       * @param decoratorType
       */
      ColumnAndBlockLayoutEditor.prototype._insertChildBlock = function (blockName, descriptor, contentType, decoratorType) {
        /**
         * The new content.
         */
        var newContent;
        newContent = false;
        galileoEvents.trigger('global-state-update:start');
        operator.dispatch(descriptor.sourceLayoutInstanceId, constants.EVENTS.REMOVE_BLOCK, descriptor.id);
        this.model.addChildContentToBlock(blockName, contentType, descriptor, decoratorType, newContent).then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
        return this._triggerTrackInsertChildBlock(descriptor.payload.containedContentTypes);
      };
      /**
       * @param content
       */
      ColumnAndBlockLayoutEditor.prototype._toggleContentVspace = function (content) {
        return this.model.toggleContentVspace(content);
      };
      /**
       * @param actionIdentifier
       * @param blockDetail
       * @param blockTitle
       */
      ColumnAndBlockLayoutEditor.prototype._triggerTrack = function (actionIdentifier, blockDetail, blockTitle) {
        return this.trigger(constants.EVENTS.TRACK_USAGE, {
          actionIdentifier: "g_block_action>content>" + actionIdentifier,
          blockDetail: "g_" + blockDetail,
          blockTitle: "" + blockTitle
        });
      };
      /**
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._triggerTrackInsert = function (contentType) {
        return this._triggerTrack("insert " + contentType, 'dragNdrop', "g_" + (s.capitalize(contentType)));
      };
      /**
       * @param contentTypes
       */
      ColumnAndBlockLayoutEditor.prototype._triggerTrackMove = function (contentTypes) {
        if (contentTypes == null) {
          contentTypes = [];
        }
        return this._triggerTrack('move', 'dragNdrop', this._stringifyContentTypes(contentTypes));
      };
      /**
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._triggerTrackInsertChildContent = function (contentType) {
        return this._triggerTrack("insert " + contentType, 'dragNdrop, g_textWrap', "g_" + (s.capitalize(contentType)));
      };
      /**
       * @param contentTypes
       */
      ColumnAndBlockLayoutEditor.prototype._triggerTrackInsertChildBlock = function (contentTypes) {
        if (contentTypes == null) {
          contentTypes = [];
        }
        return this._triggerTrack('move', 'dragNdrop, g_textWrap', this._stringifyContentTypes(contentTypes));
      };
      /**
       * @param contentTypes
       */
      ColumnAndBlockLayoutEditor.prototype._stringifyContentTypes = function (contentTypes) {
        if (contentTypes == null) {
          contentTypes = [];
        }
        return contentTypes.sort().map(function (contentType) {
          return "g_" + (s.capitalize(contentType));
        }).join(', ');
      };
      /**
       * @param event
       * @param descriptor
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._insertDescriptor = function (event, descriptor, contentType) {
        return this.model.addColumn(0, contentType, descriptor).then(function () {
          return event.resolve();
        });
      };
      /**
       * @param instanceId
       * @param contentName
       */
      ColumnAndBlockLayoutEditor.prototype._legacyRemoveContent = function (instanceId, contentName) {
        if (instanceId !== this.instanceId) {
          return;
        }
        return this.model.removeContent(contentName, {
          actualDelete: true
        });
      };
      /**
       * @param contentName
       */
      ColumnAndBlockLayoutEditor.prototype._removeContent = function (contentName) {
        return this.model.removeContent(contentName);
      };
      /**
       * @param position
       * @param blockDescriptor
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._moveColumn = function (position, blockDescriptor, contentType) {
        galileoEvents.trigger('global-state-update:start');
        operator.dispatch(blockDescriptor.sourceLayoutInstanceId, constants.EVENTS.REMOVE_BLOCK, blockDescriptor.id);
        this.model.addColumn(position, contentType, blockDescriptor).then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
        return this._triggerTrackMove(blockDescriptor.payload.containedContentTypes);
      };
      /**
       * @param columnIdx
       * @param position
       * @param blockDescriptor
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._moveBlock = function (columnIdx, position, blockDescriptor, contentType) {
        galileoEvents.trigger('global-state-update:start');
        operator.dispatch(blockDescriptor.sourceLayoutInstanceId, constants.EVENTS.REMOVE_BLOCK, blockDescriptor.id);
        this.model.addBlock(columnIdx, position, contentType, blockDescriptor).then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
        return this._triggerTrackMove(blockDescriptor.payload.containedContentTypes);
      };
      /**
       * @param position
       * @param blockDescriptor
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._reorderColumn = function (position, blockDescriptor, contentType) {
        galileoEvents.trigger('global-state-update:start');
        this.model.reorderColumn(position, contentType, blockDescriptor).then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
        return this._triggerTrackMove(blockDescriptor.payload.containedContentTypes);
      };
      /**
       * @param columnIdx
       * @param position
       * @param blockDescriptor
       * @param contentType
       */
      ColumnAndBlockLayoutEditor.prototype._reorderBlock = function (columnIdx, position, blockDescriptor, contentType) {
        galileoEvents.trigger('global-state-update:start');
        this.model.reorderBlock(columnIdx, position, contentType, blockDescriptor).then(function () {
          return galileoEvents.trigger('global-state-update:end');
        });
        return this._triggerTrackMove(blockDescriptor.payload.containedContentTypes);
      };
      /**
       * @param actualDelete
       */
      ColumnAndBlockLayoutEditor.prototype._deactivateAllEditors = function (actualDelete) {
        /**
         * The content editor.
         */
        var contentEditor, i, len, ref, results;
        if (actualDelete == null) {
          actualDelete = false;
        }
        ref = this.model.getContentEditors();
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          contentEditor = ref[i];
          results.push(this.trigger(constants.EVENTS.DEACTIVATE_EDITOR, contentEditor, actualDelete));
        }
        return results;
      };
      /**
       * @param contentDescriptor
       * @return {array}
       */
      ColumnAndBlockLayoutEditor.prototype.getColumnWidths = function (contentDescriptor) {
        return [100];
      };
      /**
       * @param state
       * @param presentation
       * @param options
       */
      ColumnAndBlockLayoutEditor.prototype.setState = function (state, presentation, options) {
        this.removeLayout = false;
        if (!stateValidator.isValid(state)) {
          this.removeLayout = true;
        }
        if (this.removeLayout) {
          state = stateValidator.filteredState(state);
          this.on('initialized', function () {
            errorManager.error(i18n.remove_error, {
              showErrorMessage: false
            });
            return _.defer((function (_this) {
              return function () {
                return galileoEvents.trigger('remove-layout', _this.instanceId);
              };
            })(this));
          });
        }
        stateValidator.removeBlocksWithNoMatchingState(state, presentation);
        stateValidator.updatePrototypeLayoutAlias(prototypeMarkupService, state);
        this.model.setContentStates(presentation.contents);
        this.model.setLayoutState(state, options);
        return void 0;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getState = function () {
        return this.model.getContentStates().then((function (_this) {
          return function (contents) {
            return {
              state: $.extend({}, _this.createState(), _this.model.toState()),
              presentation: {
                contents: contents
              }
            };
          };
        })(this));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getStateVersion = function () {
        return {
          major: 2,
          minor: 1,
          patch: 0
        };
      };
      /**
       * @param state
       */
      ColumnAndBlockLayoutEditor.getVersionFromState = function (state) {
        /**
         * The state has column width.
         */
        var stateHasColumnWidth;
        stateHasColumnWidth = _.find(state.columns, function (column) {
          return _.has(column, 'columnWidth');
        });
        if (!stateHasColumnWidth) {
          return {
            major: 2,
            minor: 0,
            patch: 1
          };
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.renderForEdit = function () {
        this.config.copied = false;
        return this.editView.getRenderedElement();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.renderForPublish = function () {
        return this.publishView.render();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.renderForImport = function () {
        return this.importView.render();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getDefaultColorStyle = function () {
        /**
         * The style.
         */
        var style;
        style = 'background-color';
        if (styleService.$determineElementsUsingStyle(style, this.editView.$el, this).length) {
          return style;
        } else {
          return void 0;
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getDefaultColorId = function () {
        return this.documentEditor.getDefaultColorId();
      };
      /**
       * @param styles
       * @param initial
       */
      ColumnAndBlockLayoutEditor.prototype.setStyles = function (styles, initial) {};
      /**
       * @return {Object} ConditionalExpression
       */
      ColumnAndBlockLayoutEditor.prototype.activate = function () {
        /**
         * The base.
         */
        var base;
        return typeof (base = this.documentEditor).layoutEditorActivated === "function" ? base.layoutEditorActivated(this) : void 0;
      };
      /**
       * @param deactivateChildren
       * @param actualDelete
       * @return {Object} ConditionalExpression
       */
      ColumnAndBlockLayoutEditor.prototype.deactivate = function (deactivateChildren, actualDelete) {
        /**
         * The base.
         */
        var base;
        if (deactivateChildren == null) {
          deactivateChildren = true;
        }
        if (actualDelete == null) {
          actualDelete = false;
        }
        if (deactivateChildren) {
          this._deactivateAllEditors(actualDelete);
        }
        return typeof (base = this.documentEditor).layoutEditorDeactivated === "function" ? base.layoutEditorDeactivated(this) : void 0;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getChildEditors = function () {
        return this.model.getContentEditors();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getStateMigrations = function () {
        return migrations;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype._documentSupportsTextWrapping = function () {
        return documentFeatureService.supported(documentFeatureService.FEATURES.TEXT_WRAPPING);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype._documentSupportsContentVspace = function () {
        return documentFeatureService.supported(documentFeatureService.FEATURES.CONTENT_VSPACE);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ColumnAndBlockLayoutEditor.prototype.getFeatureSupport = function () {
        return {
          textWrapping: this._documentSupportsTextWrapping(),
          contentVspace: this._documentSupportsContentVspace()
        };
      };
      /**
       * @param event
       * @param content
       */
      ColumnAndBlockLayoutEditor.prototype._showContentVspaceFlyout = function (event, content) {
        vspaceFlyoutView.initialize({
          contentModel: content,
          layoutEditor: this
        });
        return vspaceFlyoutView.showFlyout(event);
      };
      /**
       * @param event
       */
      ColumnAndBlockLayoutEditor.prototype._getContentModelAtClick = function (event) {
        /**
         * The $closest editor.
         */
        var $closestEditor, $target, content;
        content = null;
        $target = $(event.target);
        $closestEditor = $target.closest('[data-editor-name]');
        if ($closestEditor.length) {
          content = this.model.getContentByName($closestEditor.attr('data-editor-name'));
        }
        return content;
      };
      /**
       * @param event
       * @param menuConfig
       * @return {Function}
       */
      ColumnAndBlockLayoutEditor.prototype.registerMenuActions = function (event, menuConfig) {
        /**
         * The content.
         */
        var content;
        content = this._getContentModelAtClick(event);
        if (this._documentSupportsContentVspace() && (content != null ? content.supportsContentVspace() : void 0)) {
          menuConfig[i18n.vspace] = (function (_this) {
            return function () {
              return _this._showContentVspaceFlyout(event, content);
            };
          })(this);
        }
        return menuConfig;
      };
      return ColumnAndBlockLayoutEditor;
    })();
  });