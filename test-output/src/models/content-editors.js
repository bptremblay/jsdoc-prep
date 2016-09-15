define(['underscore', 'backbone', 'column-and-block-layout-editor-path/models/content-editor'],
  /**
   * @exports src/models/content-editors
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/models/content-editor
   */
  function (_, Backbone, ContentEditor) {
    /**
     * The content editors.
     */
    var ContentEditors;
    return ContentEditors = ( /**@lends module:src/models/content-editors~ContentEditors# */ function (superClass) {
      extend(ContentEditors, superClass);
      /**
       * @constructor
       */
      function ContentEditors() {
        return ContentEditors.__super__.constructor.apply(this, arguments);
      }
      ContentEditors.prototype.model = ContentEditor;
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentEditors.prototype.getEditors = function () {
        return this.invoke('getEditor');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentEditors.prototype.deactivate = function () {
        return this.invoke('deactivate');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentEditors.prototype.getWidthPx = function () {
        return this.block.getWidthPx();
      };
      /**
       * @param models
       * @param opts
       * @return {Object} AssignmentExpression
       */
      ContentEditors.prototype.initialize = function (models, opts) {
        return this.block = opts.block;
      };
      return ContentEditors;
    })(Backbone.Collection);
  });