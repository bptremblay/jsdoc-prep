define(['underscore', 'backbone', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/models/block'],
  /**
   * @exports src/models/blocks
   * @requires underscore
   * @requires backbone
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/models/block
   */
  function (_, Backbone, constants, Block) {
    /**
     * The blocks.
     */
    var Blocks;
    return Blocks = ( /**@lends module:src/models/blocks~Blocks# */ function (superClass) {
      extend(Blocks, superClass);
      /**
       * @constructor
       */
      function Blocks() {
        return Blocks.__super__.constructor.apply(this, arguments);
      }
      Blocks.prototype.model = Block;
      /**
       * @param block
       */
      Blocks.prototype._onAdd = function (block) {
        return this.trigger(constants.EVENTS.ADD_AT, block, this.indexOf(block));
      };
      /**
       * @param block
       * @param collection
       * @param options
       */
      Blocks.prototype._onRemove = function (block, collection, options) {
        return this.trigger(constants.EVENTS.REMOVE_FROM, block, options.index);
      };
      /**
       * @param models
       * @param blockOpts
       */
      Blocks.prototype.initialize = function (models, blockOpts) {
        this.column = blockOpts.column;
        this.listenTo(this, 'add', this._onAdd);
        return this.listenTo(this, 'remove', this._onRemove);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.toState = function () {
        return this.invoke('toState');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.getWidthPx = function () {
        return this.column.getWidthPx();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.hasContentLeft = function () {
        return this.column.hasContentLeft();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.hasContentRight = function () {
        return this.column.hasContentRight();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.getLayoutInstanceId = function () {
        return this.column.getLayoutInstanceId();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.getContents = function () {
        return _.flatten(this.invoke('getContents'));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.getColumnIndex = function () {
        return this.column.getColumnIndex();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      Blocks.prototype.getContentEditors = function () {
        return _.flatten(this.invoke('getContentEditors'));
      };
      return Blocks;
    })(Backbone.Collection);
  });