define(['column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/import/parser
   * @requires column-and-block-layout-editor-path/constants
   */
  function (constants) {
    /**
     * The aTTRS.
     */
    var ATTRS, Parser, childContentEditorExclusionFilter, columnChildExclusionFilter, columnExclusionFilter, contentChildExclusionFilter;
    ATTRS = {
      layout: {
        name: 'data-layout-name',
        type: 'data-layout-type',
        dataType: 'data-layout-data-type',
        included: 'data-layout-included',
        protoLayout: 'data-gl-proto-layout',
        formattingElement: 'data-gl-format-element'
      },
      column: {
        identifier: 'data-layout-column'
      },
      block: {
        identifier: 'data-gl-layout-block'
      },
      contentEditor: {
        identifier: 'data-editor-type',
        name: 'data-editor-name',
        type: 'data-editor-type',
        contentDecorator: 'data-gl-content-decorator'
      },
      childContentEditor: {
        identifier: 'data-gl-nest-child-content'
      },
      formatting: {
        width: 'width',
        align: 'align',
        valign: 'valign',
        style: 'style',
        "class": 'class',
        backgroundColor: 'background-color'
      }
    };
    /**
     * @todo Add some jsDoc comments here!
     */
    contentChildExclusionFilter = function () {
      return $(this).parents("[" + ATTRS.contentEditor.identifier + "]").length === 0;
    };
    /**
     * @todo Add some jsDoc comments here!
     */
    childContentEditorExclusionFilter = function () {
      return $(this).parents("[" + ATTRS.childContentEditor.identifier + "]").length === 0;
    };
    /**
     * @todo Add some jsDoc comments here!
     */
    columnChildExclusionFilter = function () {
      return $(this).parents("[" + ATTRS.column.identifier + "]").length === 0;
    };
    /**
     * @return {Boolean}
     */
    columnExclusionFilter = function () {
      /**
       * The $this.
       */
      var $this;
      $this = $(this);
      return !$this.is("[" + ATTRS.column.identifier + "]") && $this.parents("[" + ATTRS.column.identifier + "]").length === 0;
    };
    return Parser = ( /**@lends module:src/import/parser~Parser# */ function () {
      /**
       * @constructor
       * @param $markup1
       * @param actualCreate
       */
      function Parser($markup1, actualCreate) {
        this.$markup = $markup1;
        this.actualCreate = actualCreate != null ? actualCreate : false;
      }
      /**
       * @param $content
       */
      Parser.prototype._determine$ContentDecoratorElement = function ($content) {
        /**
         * The $el.
         */
        var $el, untilSelector;
        if ($content.parents("[" + ATTRS.childContentEditor.identifier + "]").length) {
          untilSelector = "[" + ATTRS.childContentEditor.identifier + "]";
        } else if ($content.parents("[" + ATTRS.block.identifier + "]").length) {
          untilSelector = "[" + ATTRS.block.identifier + "]";
        } else {
          untilSelector = "[" + ATTRS.column.identifier + "]";
        }
        $el = $content.parentsUntil(untilSelector).last();
        if ($el.length === 0) {
          return $content;
        } else {
          return $el;
        }
      };
      /**
       * @param $markup
       * @param substate
       * @param filter
       */
      Parser.prototype._parseFormattingAttrs = function ($markup, substate, filter) {
        /**
         * The $formatting elements.
         */
        var $formattingElements;
        $formattingElements = $("[" + ATTRS.layout.formattingElement + "]", $markup).addBack("[" + ATTRS.layout.formattingElement + "]");
        if (filter) {
          $formattingElements = $formattingElements.filter(filter);
        }
        return $formattingElements.each(function () {
          /**
           * The $this.
           */
          var $this, attr, baseName, ref, suffix, value;
          $this = $(this);
          suffix = $this.attr(ATTRS.layout.formattingElement);
          ref = ATTRS.formatting;
          for (baseName in ref) {
            attr = ref[baseName];
            value = $this.attr(attr);
            if (value) {
              substate["" + baseName + suffix] = value;
            }
          }
          return true;
        });
      };
      /**
       * @param $content
       */
      Parser.prototype._parseContent = function ($content) {
        /**
         * The $child content.
         */
        var $childContent, $contentDecoratorElement, content;
        content = {
          name: $content.attr(ATTRS.contentEditor.name),
          type: $content.attr(ATTRS.contentEditor.type),
          actualCreate: this.actualCreate
        };
        $contentDecoratorElement = this._determine$ContentDecoratorElement($content);
        if ($contentDecoratorElement.hasClass(constants.CLASSES.CONTENT_VSPACE)) {
          content.vspace = true;
          $contentDecoratorElement.removeClass(constants.CLASSES.CONTENT_VSPACE);
        }
        $childContent = $contentDecoratorElement.find('[data-gl-nest-child-content] [data-editor-type]');
        if ($childContent.length) {
          content.child = this._parseChildContent($childContent);
        }
        this._parseFormattingAttrs(this._determine$ContentDecoratorElement($content), content, childContentEditorExclusionFilter);
        return content;
      };
      /**
       * @param $content
       */
      Parser.prototype._parseChildContent = function ($content) {
        /**
         * The $child content.
         */
        var $childContent, $contentDecoratorElement, childContent;
        childContent = {
          name: $content.attr(ATTRS.contentEditor.name),
          type: $content.attr(ATTRS.contentEditor.type),
          decoratorType: $content.attr(ATTRS.contentEditor.contentDecorator)
        };
        $contentDecoratorElement = this._determine$ContentDecoratorElement($content);
        $childContent = $contentDecoratorElement.find('[data-gl-nest-child-content] [data-editor-type]');
        this._parseFormattingAttrs(this._determine$ContentDecoratorElement($content), childContent, contentChildExclusionFilter);
        return childContent;
      };
      /**
       * @param $block
       */
      Parser.prototype._parseContents = function ($block) {
        /**
         * The selector.
         */
        var selector;
        selector = "[" + ATTRS.contentEditor.identifier + "]";
        return $block.find(selector).addBack(selector).map((function (_this) {
          return function (idx, el) {
            if (!($(el).parents('[data-gl-nest-child-content]').length > 0)) {
              return _this._parseContent($(el));
            }
          };
        })(this)).get();
      };
      /**
       * @param $block
       */
      Parser.prototype._parseBlock = function ($block) {
        /**
         * The contents.
         */
        var contents;
        contents = this._parseContents($block);
        return {
          id: contents[0].name,
          contents: contents
        };
      };
      /**
       * @param $column
       */
      Parser.prototype._parseBlocks = function ($column) {
        /**
         * The block selector.
         */
        var blockSelector, contentEditorSelector, selector;
        blockSelector = "[" + ATTRS.block.identifier + "]";
        contentEditorSelector = "[" + ATTRS.contentEditor.identifier + "]";
        selector = contentEditorSelector;
        if ($column.find(blockSelector).length !== 0) {
          selector = blockSelector;
        }
        return $(selector, $column).map((function (_this) {
          return function (idx, el) {
            if (!($(el).parents('[data-gl-nest-child-content]').length > 0)) {
              return _this._parseBlock($(el));
            }
          };
        })(this)).get();
      };
      /**
       * @param $column
       * @param columnCount
       */
      Parser.prototype._parseColumn = function ($column, columnCount) {
        /**
         * The column.
         */
        var column, defaultPercentage;
        defaultPercentage = 1 / columnCount;
        column = {};
        this._parseFormattingAttrs($column, column, columnChildExclusionFilter);
        column.columnWidth = this._parseColumnWidth($column, defaultPercentage);
        column.blocks = this._parseBlocks($column);
        return column;
      };
      /**
       * @param $column
       * @param defaultPercentage
       * @return {Boolean}
       */
      Parser.prototype._parseColumnWidth = function ($column, defaultPercentage) {
        /**
         * The number read from column.
         */
        var numberReadFromColumn, specifiedPercentage;
        numberReadFromColumn = parseInt($column.attr(ATTRS.column.identifier), 10);
        specifiedPercentage = numberReadFromColumn / 100;
        return specifiedPercentage || defaultPercentage;
      };
      /**
       * @param $markup
       */
      Parser.prototype._parseColumns = function ($markup) {
        /**
         * The $columns.
         */
        var $columns;
        $columns = $("[" + ATTRS.column.identifier + "]", $markup);
        return $columns.map((function (_this) {
          return function (idx, el) {
            return _this._parseColumn($(el), $columns.length);
          };
        })(this)).get();
      };
      /**
       * @param $markup
       * @param state
       * @return {Object} AssignmentExpression
       */
      Parser.prototype._parseAttrs = function ($markup, state) {
        state.name = $markup.attr(ATTRS.layout.name);
        state.type = $markup.attr(ATTRS.layout.type);
        state.dataType = $markup.attr(ATTRS.layout.dataType);
        state.included = $markup.attr(ATTRS.layout.included || null);
        return state.protoLayout = $markup.attr(ATTRS.layout.protoLayout);
      };
      /**
       * @return {Object} AssignmentExpression
       */
      Parser.prototype._parse = function () {
        this._parseAttrs(this.$markup, this.state);
        this._parseFormattingAttrs(this.$markup, this.state, columnExclusionFilter);
        return this.state.columns = this._parseColumns(this.$markup);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Parser.prototype.toState = function () {
        this.state = {
          columns: []
        };
        this._parse();
        return this.state;
      };
      return Parser;
    })();
  });