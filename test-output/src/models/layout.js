define(['jquery', 'underscore', 'backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/percentage-utils',
    'column-and-block-layout-editor-path/models/column', 'column-and-block-layout-editor-path/models/columns', 'column-and-block-layout-editor-path/models/content-editor-state-map',
    'column-and-block-layout-editor-path/models/converters/block-converter', 'column-and-block-layout-editor-path/models/converters/content-converter',
    'galileo-lib/modules/services/activation-service'
  ],
  /**
   * @exports src/models/layout
   * @requires jquery
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/percentage-utils
   * @requires column-and-block-layout-editor-path/models/column
   * @requires column-and-block-layout-editor-path/models/columns
   * @requires column-and-block-layout-editor-path/models/content-editor-state-map
   * @requires column-and-block-layout-editor-path/models/converters/block-converter
   * @requires column-and-block-layout-editor-path/models/converters/content-converter
   * @requires galileo-lib/modules/services/activation-service
   */
  function ($, _, Backbone, constants, percentageUtils, Column, Columns, ContentEditorStateMap, BlockConverter, ContentConverter, activationService) {
    /**
     * The layout model.
     */
    var LayoutModel;
    return LayoutModel = ( /**@lends module:src/models/layout~LayoutModel# */ function (superClass) {
      extend(LayoutModel, superClass);
      /**
       * @constructor
       */
      function LayoutModel() {
        return LayoutModel.__super__.constructor.apply(this, arguments);
      }
      LayoutModel.prototype.defaults = {
        multicolumn: false,
        columnWidth: '100%'
      };
      /**
       * @param layoutState
       * @param options
       */
      LayoutModel.prototype.setLayoutState = function (layoutState, options) {
        if (options == null) {
          options = {};
        }
        this.set(layoutState, {
          setState: true
        });
        return this.eventEmitter.trigger(constants.EVENTS.LAYOUT_CHANGED, options);
      };
      /**
       * @param content
       * @return {Boolean}
       */
      LayoutModel.prototype._layoutWillDeleteIfContentIsRemoved = function (content) {
        /**
         * The content is not AChild.
         */
        var contentIsNotAChild, layoutContainsOneBlock;
        layoutContainsOneBlock = this.columns.getNumBlocks() === 1;
        contentIsNotAChild = !content.isChild();
        return layoutContainsOneBlock && contentIsNotAChild;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._numColumns = function () {
        return this.get('columns').length;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._initColumnWidth = function () {
        return this.set('columnWidth', (100 / this.columns.length) + "%", {
          silent: true
        });
      };
      /**
       * @param column
       * @param columns
       * @param options
       */
      LayoutModel.prototype._refreshColumnsAndTriggerChanged = function (column, columns, options) {
        this._refreshAttributes();
        if (!options.setState) {
          return this.eventEmitter.trigger(constants.EVENTS.LAYOUT_CHANGED);
        }
      };
      /**
       * @param blockJSON
       */
      LayoutModel.prototype._createColumnJson = function (blockJSON) {
        /**
         * The column.
         */
        var column, ref;
        column = _((ref = this.columns.at(0)) != null ? ref.attributes : void 0).clone() || {};
        column.blocks = [blockJSON];
        return column;
      };
      /**
       * @param columns
       * @param position
       */
      LayoutModel.prototype._removeColumnFrom = function (columns, position) {
        columns.splice(position, 1);
        return columns;
      };
      /**
       * @param columns
       * @param sourceIndex
       * @param destinationIndex
       */
      LayoutModel.prototype._reorderColumn = function (columns, sourceIndex, destinationIndex) {
        /**
         * The column.
         */
        var column;
        this._refreshAttributes();
        column = columns[sourceIndex];
        columns.splice(destinationIndex, 0, _(column).clone());
        return _(columns).without(column);
      };
      /**
       * @param position
       */
      LayoutModel.prototype._removeColumn = function (position) {
        this._refreshAttributes();
        return this.set('columns', this._removeColumnFrom(_(this.get('columns')).clone(), position));
      };
      /**
       * @param columns
       * @param position
       * @param blockJSON
       * @return {Object} AssignmentExpression
       */
      LayoutModel.prototype._insertColumnAt = function (columns, position, blockJSON) {
        /**
         * The new column.
         */
        var newColumn, roundedWidths, widths;
        widths = _(columns).pluck('columnWidth');
        newColumn = this._createColumnJson(blockJSON);
        columns.splice(position, 0, newColumn);
        if (percentageUtils.reducesToOne(widths)) {
          roundedWidths = percentageUtils.evenlySplit(columns.length);
          columns.forEach(function (column, index) {
            return column.columnWidth = roundedWidths[index];
          });
        } else {
          newColumn.columnWidth = percentageUtils.remainingDecimal(widths);
        }
        return columns;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._createColumnModel = function () {
        this.columns = new Columns(this.get('columns'), this.columnOpts);
        this.listenTo(this.columns, 'column-empty', this._onColumnEmpty);
        this.listenTo(this.columns, 'remove', this._refreshColumnsAndTriggerChanged, this);
        this.set('multicolumn', this.columns.length > 1, {
          silent: true
        });
        return this._initColumnWidth();
      };
      /**
       * @param options
       */
      LayoutModel.prototype._handledChangedEvent = function (options) {
        if (this._numColumns() !== this.columns.length || this.columns.length === 0) {
          return this._createColumnModel();
        } else {
          return this.columns.setColumns(this.get('columns'), options);
        }
      };
      /**
       * @param model
       * @param options
       */
      LayoutModel.prototype._onChanged = function (model, options) {
        this._handledChangedEvent(options);
        if (!options.setState) {
          return this.eventEmitter.trigger(constants.EVENTS.LAYOUT_CHANGED);
        }
      };
      /**
       * @param column
       */
      LayoutModel.prototype._onColumnEmpty = function (column) {
        return this._removeColumn(this.columns.indexOf(column));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._refreshAttributes = function () {
        /**
         * The attributes.
         */
        var attributes;
        attributes = _(this.attributes).clone();
        attributes.columns = this.columns.toState();
        return this.set(attributes, {
          silent: true
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._refreshContentEditorStateMap = function () {
        return this._whenAllContentEditorsReady().then((function (_this) {
          return function () {
            return _this.contentEditorStateMap.refresh(_this.getContentEditors());
          };
        })(this));
      };
      /**
       * @param action
       */
      LayoutModel.prototype._triggerStateUpdated = function (action) {
        if (action == null) {
          action = {};
        }
        return this.eventEmitter.trigger(constants.EVENTS.STATE_UPDATED, true, action);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype._whenAllContentEditorsReady = function () {
        return $.when.apply(this, _(this.getContents()).invoke('whenEditorReady'));
      };
      /**
       * @param state
       * @param opts
       */
      LayoutModel.prototype.initialize = function (state, opts) {
        this.contentEditorStateMap = new ContentEditorStateMap();
        this.columns = new Columns([], {
          layout: this,
          contentEditorStateMap: this.contentEditorStateMap
        });
        this.instanceId = opts.instanceId;
        this.eventEmitter = opts.eventEmitter;
        this.containerWidth = opts.containerWidth;
        this.valueService = opts.valueService;
        this.columnOpts = {
          eventEmitter: this.eventEmitter,
          contentEditorFactory: opts.contentEditorFactory,
          contentEditorStateMap: this.contentEditorStateMap,
          layoutContainerWidth: this.containerWidth,
          layout: this
        };
        this.synthesizedAttrs = _(this.defaults).keys();
        this.listenTo(this, 'change', this._onChanged);
        return this.eventEmitter.on(constants.EVENTS.CONTENT_INSERTED, this._refreshAttributes, this);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getContentStates = function () {
        return this._refreshContentEditorStateMap().then((function (_this) {
          return function () {
            return _this.contentEditorStateMap.getContents();
          };
        })(this));
      };
      /**
       * @param contents
       */
      LayoutModel.prototype.setContentStates = function (contents) {
        return this.contentEditorStateMap.setContents(contents);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getContents = function () {
        return this.columns.getContents();
      };
      /**
       * @param editorName
       */
      LayoutModel.prototype.getContentByName = function (editorName) {
        return this.columns.findContentModelByName(editorName);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getContentEditors = function () {
        return this.columns.getContentEditors();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getColumns = function () {
        return this.columns;
      };
      /**
       * @param position
       * @param contentType
       * @param content
       * @param actualCreate
       */
      LayoutModel.prototype.addColumn = function (position, contentType, content, actualCreate) {
        /**
         * The block JSON.
         */
        var blockJSON, createdState;
        if (actualCreate == null) {
          actualCreate = false;
        }
        createdState = this.contentEditorStateMap.createState(content, contentType);
        blockJSON = BlockConverter.convert(createdState, contentType, actualCreate);
        this.set('columns', this._insertColumnAt(_(this.get('columns')).clone(), position, blockJSON));
        this._triggerStateUpdated();
        return this._whenAllContentEditorsReady();
      };
      /**
       * @param columnIdx
       * @param position
       * @param contentType
       * @param content
       * @param actualCreate
       */
      LayoutModel.prototype.addBlock = function (columnIdx, position, contentType, content, actualCreate) {
        /**
         * The block JSON.
         */
        var blockJSON, createdState;
        if (actualCreate == null) {
          actualCreate = false;
        }
        createdState = this.contentEditorStateMap.createState(content, contentType);
        blockJSON = BlockConverter.convert(createdState, contentType, actualCreate);
        this.columns.at(columnIdx).addBlock(position, blockJSON);
        this._refreshAttributes();
        this._triggerStateUpdated();
        return this._whenAllContentEditorsReady();
      };
      /**
       * @param blockName
       * @param contentType
       * @param contentEditorState
       * @param decoratorType
       * @param newContent
       */
      LayoutModel.prototype.addChildContentToBlock = function (blockName, contentType, contentEditorState, decoratorType, newContent) {
        /**
         * The content JSON.
         */
        var contentJSON, createdState;
        if (newContent == null) {
          newContent = true;
        }
        createdState = this.contentEditorStateMap.createState(contentEditorState, contentType);
        contentJSON = ContentConverter.convert(createdState, contentType, decoratorType);
        contentJSON.childContentJustCreated = newContent;
        contentJSON.actualCreate = newContent;
        this.columns.createChildContent(blockName, contentJSON);
        this._refreshAttributes();
        this._triggerStateUpdated({
          action: 'create',
          id: contentEditorState.name
        });
        return this._whenAllContentEditorsReady();
      };
      /**
       * @param position
       * @param contentType
       * @param content
       */
      LayoutModel.prototype.reorderColumn = function (position, contentType, content) {
        /**
         * The first column has single block.
         */
        var firstColumnHasSingleBlock, singleBlockDoesNotHaveChildContent, thereIsOnlyOneColumn;
        thereIsOnlyOneColumn = this.columns.length === 1;
        firstColumnHasSingleBlock = !this.columns.first().hasMultipleBlocks();
        singleBlockDoesNotHaveChildContent = this.columns.getContents().length === 1;
        if (thereIsOnlyOneColumn && firstColumnHasSingleBlock && singleBlockDoesNotHaveChildContent) {
          return $.Deferred().resolve().promise();
        }
        this.removeContent(content.id, {
          evenlySplit: false
        });
        return $.when(this.addColumn(position, contentType, content)).then((function (_this) {
          return function () {
            _this._refreshAttributes();
            _this._triggerStateUpdated();
            return _this._whenAllContentEditorsReady();
          };
        })(this));
      };
      /**
       * @param columnIdx
       * @param position
       * @param contentType
       * @param content
       */
      LayoutModel.prototype.reorderBlock = function (columnIdx, position, contentType, content) {
        this.columns.reorderBlock(columnIdx, position, contentType, content);
        this._refreshAttributes();
        this._triggerStateUpdated();
        return this._whenAllContentEditorsReady();
      };
      /**
       * @param editorName
       */
      LayoutModel.prototype.contentContainsChild = function (editorName) {
        /**
         * The content.
         */
        var content;
        content = this.getContentByName(editorName);
        return content.hasChild();
      };
      /**
       * @param name
       * @param options
       */
      LayoutModel.prototype.removeContent = function (name, options) {
        /**
         * The content.
         */
        var content;
        if (options == null) {
          options = {};
        }
        _(options).defaults({
          evenlySplit: true,
          actualDelete: false
        });
        content = this.getContentByName(name);
        if (this._layoutWillDeleteIfContentIsRemoved(content)) {
          return this.eventEmitter.trigger(constants.EVENTS.LAYOUT_EMPTY, options.actualDelete);
        } else {
          content.remove(options);
          activationService.deactivateLayout();
          this._refreshAttributes();
          return this._triggerStateUpdated({
            action: 'delete',
            id: name
          });
        }
      };
      /**
       * @param content
       */
      LayoutModel.prototype.toggleContentVspace = function (content) {
        content.toggleVspace();
        this._refreshAttributes();
        return this._triggerStateUpdated();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.toState = function () {
        /**
         * The state.
         */
        var state;
        state = _(this.toJSON()).omit(this.synthesizedAttrs);
        state.columns = this.columns.toState();
        return state;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getAttributesForRender = function () {
        /**
         * The state.
         */
        var state;
        state = this.toJSON();
        state.columns = this.columns.invoke('getAttributesForRender');
        return state;
      };
      /**
       * Returns true if is layout included.
       * @return {Object} boolean
       */
      LayoutModel.prototype.isLayoutIncluded = function () {
        /**
         * The included.
         */
        var included;
        included = this.get('included');
        if (!included) {
          return true;
        }
        return this.valueService.isTruish(included);
      };
      /**
       * @return {Object} ConditionalExpression
       */
      LayoutModel.prototype.atMaxColumns = function () {
        /**
         * The ref.
         */
        var ref;
        return (ref = this.columns) != null ? ref.atMaxColumns() : void 0;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      LayoutModel.prototype.getReadyPromise = function () {
        return this._whenAllContentEditorsReady();
      };
      return LayoutModel;
    })(Backbone.Model);
  });