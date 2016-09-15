define(['underscore', 'galileo-lib/modules/managers/error-manager'],
  /**
   * @exports src/state-validator
   * @requires underscore
   * @requires galileo-lib/modules/managers/error-manager
   */
  function (_, errorManager) {
    /**
     * The state validator.
     */
    var StateValidator;
    StateValidator = ( /**@lends module:src/state-validator~=# */ function () {
      /**
       * @constructor
       */
      function StateValidator() {}
      StateValidator.prototype.ALIASES = {
        PROTO_LAYOUTS: [
          ['feature', 'border']
        ]
      };
      /**
       * @param name
       */
      StateValidator.prototype._getProtoLayoutAliases = function (name) {
        return _(this.ALIASES.PROTO_LAYOUTS).find(function (aliases) {
          return _(aliases).contains(name);
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      StateValidator.prototype._bootstrap = function () {
        return {
          columns: [],
          name: 'Bootstrap-Block-0000000000000',
          type: 'email-block',
          protoLayout: 'singlerow'
        };
      };
      /**
       * @param s
       */
      StateValidator.prototype._validateObject = function (s) {
        return _(s).isObject();
      };
      /**
       * @param s
       */
      StateValidator.prototype._validateKeys = function (s) {
        /**
         * The required attributes.
         */
        var requiredAttributes;
        requiredAttributes = ['columns', 'name', 'type', 'protoLayout'];
        return requiredAttributes.every(function (attr) {
          return _.has(s, attr);
        });
      };
      /**
       * @param s
       */
      StateValidator.prototype._validateColumns = function (s) {
        return _(s.columns).isArray();
      };
      /**
       * @param state
       */
      StateValidator.prototype.filteredState = function (state) {
        /**
         * The key.
         */
        var key;
        for (key in state) {
          if (key !== '_galileo') {
            delete state[key];
          }
        }
        return _.extend(state, this._bootstrap());
      };
      /**
       * @param prototypeMarkupService
       * @param state
       */
      StateValidator.prototype.updatePrototypeLayoutAlias = function (prototypeMarkupService, state) {
        /**
         * The aliases.
         */
        var aliases;
        aliases = this._getProtoLayoutAliases(state.protoLayout);
        if (aliases == null) {
          return;
        }
        return state.protoLayout = prototypeMarkupService.getCurrentPrototypeLayoutAlias(aliases);
      };
      /**
       * Returns true if is valid.
       * @param state
       * @return {Object} boolean
       */
      StateValidator.prototype.isValid = function (state) {
        return this._validateObject(state) && this._validateKeys(state) && this._validateColumns(state);
      };
      /*
      Iterate over layout editor state, and make sure there is corresponding content editor state for each block.
      If there is not, remove that content from the layout editor state. Trim the blocks / columns if they
      become empty after this operation. Put the trimmed content in a "stash" in the layout editor state,
      just incase we can restore it again later.
       */
      /**
       * @param state
       * @param presentation
       */
      StateValidator.prototype.removeBlocksWithNoMatchingState = function (state, presentation) {
        /**
         * The blocks counter.
         */
        var blocksCounter, column, columnCounter, contentCounter, contentSpliced, i, len, missingState, recalculatedColumnWidth, ref, removedBlocks, thisBlock, thisColumn, thisContent;
        removedBlocks = [];
        columnCounter = state.columns.length;
        while (columnCounter--) {
          thisColumn = state.columns[columnCounter];
          blocksCounter = thisColumn.blocks.length;
          while (blocksCounter--) {
            thisBlock = thisColumn.blocks[blocksCounter];
            contentCounter = thisBlock.contents.length;
            while (contentCounter--) {
              thisContent = thisBlock.contents[contentCounter];
              missingState = !presentation.contents[thisContent.name];
              if (missingState) {
                contentSpliced = thisBlock.contents.splice(contentCounter, 1);
                removedBlocks.push({
                  content: contentSpliced[0],
                  contentIndex: contentCounter,
                  blockIndex: blocksCounter,
                  columnIndex: columnCounter
                });
                errorManager.error('Missing editor state for CABLE layout block. Removing block.', {
                  showErrorMessage: false
                });
              }
            }
            if (!thisBlock.contents.length) {
              thisColumn.blocks.splice(blocksCounter, 1);
            }
          }
          if (!thisColumn.blocks.length) {
            state.columns.splice(columnCounter, 1);
          }
        }
        recalculatedColumnWidth = 100 / state.columns.length;
        ref = state.columns;
        for (i = 0, len = ref.length; i < len; i++) {
          column = ref[i];
          column.width = recalculatedColumnWidth + "%";
        }
        if (removedBlocks.length) {
          return state.stash.push(removedBlocks);
        }
      };
      return StateValidator;
    })();
    return new StateValidator;
  });