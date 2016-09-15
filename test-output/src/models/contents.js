define(['underscore', 'backbone', 'column-and-block-layout-editor-path/models/content', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/models/contents
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/models/content
   * @requires column-and-block-layout-editor-path/constants
   */
  function (_, Backbone, Content, constants) {
    /**
     * The contents.
     */
    var Contents;
    return Contents = ( /**@lends module:src/models/contents~Contents# */ function (superClass) {
      extend(Contents, superClass);
      /**
       * @constructor
       */
      function Contents() {
        return Contents.__super__.constructor.apply(this, arguments);
      }
      Contents.prototype.model = Content;
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.getContents = function () {
        return _.flatten(this.invoke('getContent'));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.toState = function () {
        return this.invoke('toState');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.getEditors = function () {
        return _.chain(this.invoke('getEditors')).flatten().compact().value();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.deactivate = function () {
        return this.invoke('deactivate');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.getWidthPx = function () {
        return this.block.getWidthPx();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.hasContentLeft = function () {
        return this.block.hasContentLeft();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Contents.prototype.hasContentRight = function () {
        return this.block.hasContentRight();
      };
      /**
       * @param models
       * @param opts
       */
      Contents.prototype.initialize = function (models, opts) {
        this.block = opts.block;
        return this.listenTo(this, 'remove', this._onRemove);
      };
      /**
       * @param content
       * @param collection
       * @param options
       */
      Contents.prototype._onRemove = function (content, collection, options) {
        return content.deactivate(options);
      };
      return Contents;
    })(Backbone.Collection);
  });