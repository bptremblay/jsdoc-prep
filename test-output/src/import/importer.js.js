define(['underscore', 'jquery', 'column-and-block-layout-editor-path/models/column', 'column-and-block-layout-editor-path/import/parser'],
  /**
   * @exports src/import/importer
   * @requires underscore
   * @requires jquery
   * @requires column-and-block-layout-editor-path/models/column
   * @requires column-and-block-layout-editor-path/import/parser
   */
  function (_, $, Column, Parser) {
    /**
     * The importer.
     */
    var Importer;
    Importer = ( /**@lends module:src/import/importer~=# */ function () {
      /**
       * @constructor
       */
      function Importer() {}
      /**
       * @param $el
       */
      Importer.prototype._getBlocks = function ($el) {
        return $el.find('[data-editor-type]').map(function (idx, el) {
          $el = $(el);
          return {
            $el: $el,
            type: $el.data('editor-type'),
            name: $el.data('editor-name')
          };
        }).get();
      };
      /**
       * @param contentStates
       * @param contentEditorResolvers
       */
      Importer.prototype._buildContentStates = function (contentStates, contentEditorResolvers) {
        /**
         * The content state.
         */
        var contentState, contents, editorDeferred, i, j, len;
        contents = {};
        for (i = j = 0, len = contentStates.length; j < len; i = ++j) {
          contentState = contentStates[i];
          editorDeferred = contentEditorResolvers[i];
          contents[editorDeferred.editorName] = {
            name: editorDeferred.editorName,
            state: contentState
          };
        }
        return contents;
      };
      /**
       * @param $container
       * @param contentEditors
       */
      Importer.prototype._getContentEditorResolvers = function ($container, contentEditors) {
        return _.map(this._getBlocks($container), function (block) {
          /**
           * The content editor.
           */
          var ContentEditor, editorDeferred;
          ContentEditor = contentEditors[block.type];
          if (!ContentEditor) {
            throw new Error("No content editor found for type " + block.type);
          }
          editorDeferred = ContentEditor["import"](block.$el.prop('outerHTML'));
          editorDeferred.editorName = block.name;
          editorDeferred.editorType = block.type;
          return editorDeferred;
        });
      };
      /**
       * @param markup
       * @param contentEditors
       * @param actualCreate
       * @return {Function}
       */
      Importer.prototype["import"] = function (markup, contentEditors, actualCreate) {
        /**
         * The $markup.
         */
        var $markup, contentEditorResolvers, deferredImport, layout, markupParser;
        $markup = $(markup);
        markupParser = new Parser($markup, actualCreate);
        layout = {
          state: markupParser.toState(),
          contents: {}
        };
        deferredImport = $.Deferred();
        contentEditorResolvers = this._getContentEditorResolvers($markup, contentEditors);
        $.when.apply(this, contentEditorResolvers).done((function (_this) {
          return function () {
            layout.contents = _this._buildContentStates(arguments, contentEditorResolvers);
            return deferredImport.resolve(layout);
          };
        })(this)).fail(function () {
          return deferredImport.reject();
        });
        return deferredImport.promise();
      };
      return Importer;
    })();
    return new Importer();
  });