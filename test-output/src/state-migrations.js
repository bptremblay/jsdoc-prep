define(['jquery', 'column-and-block-layout-editor-path/percentage-utils'],
  /**
   * @exports src/state-migrations
   * @requires jquery
   * @requires column-and-block-layout-editor-path/percentage-utils
   */
  function ($, percentageUtils) {
    /**
     * The migration1xx 120.
     */
    var migration1xx_120, migration200_201, migration201_210;
    migration1xx_120 = {
      fromVersion: function () {
        return {
          major: 1,
          minor: '*',
          patch: '*'
        };
      },
      toVersion: function () {
        return {
          major: 1,
          minor: '2',
          patch: '0'
        };
      },
      migrate: function (state) {
        /**
         * The $content.
         */
        var $content;
        $content = $(state.defaultContent);
        $content.find('td:has(> img[src$="/letters/images/1101116784221/S.gif"][width=17])').attr('data-layout-spacer', 'true');
        state.defaultContent = $content.prop('outerHTML');
        return state;
      }
    };
    migration200_201 = {
      fromVersion: function () {
        return {
          major: 2,
          minor: 0,
          patch: 0
        };
      },
      toVersion: function () {
        return {
          major: 2,
          minor: 0,
          patch: 1
        };
      },
      migrate: function (state) {
        state.stash = [];
        return state;
      }
    };
    migration201_210 = {
      /**
       * @todo Add some jsDoc comments here!
       */
      fromVersion: function () {
        return {
          major: 2,
          minor: 0,
          patch: 1
        };
      },
      /**
       * @todo Add some jsDoc comments here!
       */
      toVersion: function () {
        return {
          major: 2,
          minor: 1,
          patch: 0
        };
      },
      /**
       * @param state
       * @return {Object} AssignmentExpression
       */
      migrate: function (state) {
        /**
         * The columns.
         */
        var columns, roundedWidths;
        columns = state.columns;
        roundedWidths = percentageUtils.evenlySplit(columns.length);
        columns.forEach(function (column, index) {
          return column.columnWidth = roundedWidths[index];
        });
        return state;
      }
    };
    return [migration1xx_120, migration200_201, migration201_210];
  });