define(['underscore', 'backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/percentage-utils', 'column-and-block-layout-editor-path/models/column',
    'column-and-block-layout-editor-path/models/converters/block-converter'
  ],
  /**
   * @exports src/models/columns
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/percentage-utils
   * @requires column-and-block-layout-editor-path/models/column
   * @requires column-and-block-layout-editor-path/models/converters/block-converter
   */
  function (_, Backbone, constants, percentageUtils, Column, BlockConverter) {
    /**
     * The columns.
     */
    var Columns, MAX_COLUMNS;
    MAX_COLUMNS = 2;
    return Columns = ( /**@lends module:src/models/columns~Columns# */ function (superClass) {
      extend(Columns, superClass);
      /**
       * @constructor
       */
      function Columns() {
        return Columns.__super__.constructor.apply(this, arguments);
      }
      Columns.prototype.model = Column;
      /**
       * @param models
       * @param opts
       */
      Columns.prototype.initialize = function (models, opts) {
        this.opts = opts;
        this.layout = this.opts.layout;
        this.contentEditorStateMap = this.opts.contentEditorStateMap;
        return this.on('remove', this._checkIfColumnsShouldBeEventlySplit, this);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.toState = function () {
        return this.invoke('toState');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.getNumBlocks = function () {
        return this.reduce((function (sum, column) {
          return sum + column.getBlocksCollection().length;
        }), 0);
      };
      /**
       * @param columns
       * @param options
       */
      Columns.prototype.setColumns = function (columns, options) {
        return this.set(columns, _.extend(this.opts, options));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.resizeColumns = function () {
        /**
         * The set widths.
         */
        var setWidths, sumOfWidths, widths;
        widths = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        setWidths = this.pluck('columnWidth');
        if (_(widths).isEqual(setWidths)) {
          return;
        }
        if (widths.length !== this.length) {
          throw new Error('Must specify the width of each column');
        }
        sumOfWidths = widths.reduce(function (prev, current) {
          return prev + current;
        });
        if (sumOfWidths !== 1) {
          throw new Error('Widths must add up to 1.00 (100%)');
        }
        this.each(function (model, index) {
          return model.set({
            columnWidth: widths[index]
          });
        });
        this.opts.eventEmitter.trigger(constants.EVENTS.LAYOUT_CHANGED);
        return this.opts.eventEmitter.trigger(constants.EVENTS.STATE_UPDATED);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.evenlySplitColumns = function () {
        /**
         * The rounded widths.
         */
        var roundedWidths;
        roundedWidths = percentageUtils.evenlySplit(this.length);
        return this.each(function (column, index) {
          return column.set({
            columnWidth: roundedWidths[index]
          });
        });
      };
      /**
       * @param model
       * @param delta
       * @return {Boolean}
       */
      Columns.prototype.applyDeltaToColumnWidth = function (model, delta) {
        /**
         * The column width is at max or min.
         */
        var columnWidthIsAtMaxOrMin, index, resizedWidths;
        if (this.length === 1) {
          throw new Error('Cannot change column width in single column layouts');
        }
        index = this.indexOf(model);
        resizedWidths = percentageUtils.adjustValues({
          arrayOfDecimals: this.pluck('columnWidth'),
          addTo: index,
          subtractFrom: index + 1,
          delta: delta
        });
        columnWidthIsAtMaxOrMin = resizedWidths.every(function (width) {
          return width > constants.COLUMN_WIDTH.MAX_DECIMAL || width < constants.COLUMN_WIDTH.MIN_DECIMAL;
        });
        if (!columnWidthIsAtMaxOrMin) {
          return this.resizeColumns.apply(this, resizedWidths);
        }
      };
      /**
       * @param decimal
       */
      Columns.prototype.resizeColumnFromHandle = function (decimal) {
        /**
         * The delta decimal.
         */
        var deltaDecimal, newColumnWidths;
        if (this.length === 1) {
          throw new Error('Cannot change column width in single column layouts');
        }
        deltaDecimal = percentageUtils.remainingDecimal([decimal]);
        newColumnWidths = [deltaDecimal, decimal];
        return this.resizeColumns.apply(this, newColumnWidths);
      };
      /**
       * @param name
       * @param contentJSON
       */
      Columns.prototype.createChildContent = function (name, contentJSON) {
        /**
         * The block.
         */
        var block, column, content;
        column = this.find(function (column) {
          return column.hasBlock(name);
        });
        block = column.blocks.get(name);
        content = block.contents.find(function (content) {
          return content.get('name') === name;
        });
        return content != null ? content.createChild(contentJSON) : void 0;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.getContents = function () {
        return _.flatten(this.invoke('getContents'));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.getContentEditors = function () {
        return _.flatten(this.invoke('getContentEditors'));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.getLayoutInstanceId = function () {
        return this.layout.instanceId;
      };
      /**
       * @param name
       */
      Columns.prototype.findContentModelByName = function (name) {
        /**
         * The content.
         */
        var content, contents;
        contents = this.getContents();
        content = _.find(contents, function (content) {
          return content.getName() === name;
        });
        return content || (function () {
          throw new Error("Could not find content model: " + name);
        })();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.atMaxColumns = function () {
        return this.length >= MAX_COLUMNS;
      };
      /**
       * @param columnIdx
       * @param position
       * @param contentType
       * @param content
       */
      Columns.prototype.reorderBlock = function (columnIdx, position, contentType, content) {
        /**
         * The block JSON.
         */
        var blockJSON, createdState, toColumn;
        toColumn = this.at(columnIdx);
        createdState = this.contentEditorStateMap.createState(content, contentType);
        blockJSON = BlockConverter.convert(createdState, contentType);
        toColumn.addBlock(position, blockJSON);
        return this.layout.removeContent(content.id);
      };
      /**
       * @param model
       * @param collection
       * @param options
       */
      Columns.prototype._checkIfColumnsShouldBeEventlySplit = function (model, collection, options) {
        if (options.evenlySplit) {
          return this.evenlySplitColumns();
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Columns.prototype.getLayoutReadyPromise = function () {
        return this.layout.getReadyPromise();
      };
      return Columns;
    })(Backbone.Collection);
  });