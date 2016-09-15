define(['underscore', 'backbone', 'galileo-lib/modules/services/descriptors/block/block-descriptor', 'column-and-block-layout-editor-path/models/content',
    'column-and-block-layout-editor-path/models/contents'
  ],
  /**
   * @exports src/models/block
   * @requires underscore
   * @requires backbone
   * @requires galileo-lib/modules/services/descriptors/block/block-descriptor
   * @requires column-and-block-layout-editor-path/models/content
   * @requires column-and-block-layout-editor-path/models/contents
   */
  function (_, Backbone, BlockDescriptor, Content, Contents) {
    /**
     * The block model.
     */
    var BlockModel;
    return BlockModel = ( /**@lends module:src/models/block~BlockModel# */ function (superClass) {
      extend(BlockModel, superClass);
      /**
       * @constructor
       */
      function BlockModel() {
        this.toBlockDescriptor = bind(this.toBlockDescriptor, this);
        return BlockModel.__super__.constructor.apply(this, arguments);
      }
      BlockModel.prototype.contents = [];
      /**
       * @param contents
       * @return {Object} NewExpression
       */
      BlockModel.prototype._createContentModel = function (contents) {
        /**
         * The opts.
         */
        var opts;
        opts = {
          eventEmitter: this.eventEmitter,
          contentEditorFactory: this.contentEditorFactory,
          block: this,
          contentEditorStateMap: this.contentEditorStateMap
        };
        return new Contents(contents, opts);
      };
      /**
       * @param model
       * @param collection
       * @param options
       */
      BlockModel.prototype._removeBlockIfContentsIsEmpty = function (model, collection, options) {
        if (this.contents.isEmpty()) {
          return this.collection.remove(this, options);
        }
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.toState = function () {
        /**
         * The state.
         */
        var state;
        state = this.toJSON();
        state.contents = this.contents.toState();
        return state;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getContentsCollection = function () {
        return this.contents;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getContainedContentTypes = function () {
        return this.contents.pluck('type');
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getContents = function () {
        return this.contents.getContents();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getContentEditors = function () {
        return this.contents.getEditors();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.deactivate = function () {
        return this.contents.deactivate();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getWidthPx = function () {
        return this.collection.getWidthPx();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.hasContentLeft = function () {
        return this.collection.hasContentLeft();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.hasContentRight = function () {
        return this.collection.hasContentRight();
      };
      /**
       * @return {Object} NewExpression
       */
      BlockModel.prototype.toBlockDescriptor = function () {
        return new BlockDescriptor(_.extend(this.getMetadata(), {
          payload: this.getDescriptorContents()
        }));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getMetadata = function () {
        return {
          id: this.get('id'),
          sourceLayoutInstanceId: this.collection.getLayoutInstanceId(),
          sourceIsChildContent: false,
          sourceColumnIndex: this.collection.getColumnIndex(),
          sourceBlockIndex: this.getBlockIndex()
        };
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getDescriptorContents = function () {
        return {
          contents: this.getContentsCollection().invoke('getStateForBlockDescriptor')
        };
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockModel.prototype.getBlockIndex = function () {
        return this.collection.indexOf(this);
      };
      /**
       * @param block
       * @param opts
       */
      BlockModel.prototype.initialize = function (block, opts) {
        this.eventEmitter = opts.eventEmitter;
        this.contentEditorFactory = opts.contentEditorFactory;
        this.contentEditorStateMap = opts.contentEditorStateMap;
        this.contents = this._createContentModel(block.contents);
        return this.listenTo(this.contents, 'remove', this._removeBlockIfContentsIsEmpty, this);
      };
      return BlockModel;
    })(Backbone.Model);
  });