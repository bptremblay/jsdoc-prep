define(['jquery', 'backbone', 'galileo-lib/modules/services/document-feature-service', 'column-and-block-layout-editor-path/views/content', 'column-and-block-layout-editor-path/views/move-handle'],
  /**
   * @exports src/views/block
   * @requires jquery
   * @requires backbone
   * @requires galileo-lib/modules/services/document-feature-service
   * @requires column-and-block-layout-editor-path/views/content
   * @requires column-and-block-layout-editor-path/views/move-handle
   * @requires underscore
   */
  function ($, Backbone, documentFeatureService, ContentView, MoveHandleView) {
    /**
     * The block view.
     */
    var BlockView;
    return BlockView = ( /**@lends module:src/views/block~BlockView# */ function (superClass) {
      /**
       * The aTTRS.
       */
      var ATTRS;
      extend(BlockView, superClass);
      /**
       * @constructor
       */
      function BlockView() {
        return BlockView.__super__.constructor.apply(this, arguments);
      }
      ATTRS = {
        id: 'data-gl-layout-block'
      };
      BlockView.prototype.className = 'gl-layout-block';
      BlockView.prototype.contentViews = [];
      /**
       * @param type
       */
      BlockView.prototype._getContentDecoratorTemplate = function (type) {
        /**
         * The content decorator.
         */
        var contentDecorator;
        contentDecorator = this.contentDecorators[type];
        if (contentDecorator == null) {
          contentDecorator = this.prototypeMarkupService.getContentDecorator(type);
          this.contentDecorators[type] = contentDecorator;
        }
        return contentDecorator.markup;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockView.prototype._renderId = function () {
        return this.$el.attr(ATTRS.id, this.model.id);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockView.prototype._documentSupportsMove = function () {
        return documentFeatureService.supported(documentFeatureService.FEATURES.MOVE_BLOCK);
      };
      /**
       * @param content
       * @param options
       */
      BlockView.prototype._renderContent = function (content, options) {
        /**
         * The content view.
         */
        var contentView;
        contentView = new ContentView({
          model: content,
          eventEmitter: this.eventEmitter,
          template: this._getContentDecoratorTemplate(content.get('type')),
          decoratorProviderFn: this._getContentDecoratorTemplate.bind(this)
        });
        this.$el.append(contentView.render(options).el);
        return contentView;
      };
      /**
       * @param options
       * @return {Object} AssignmentExpression
       */
      BlockView.prototype._renderContents = function (options) {
        return this.contentViews = this.model.getContentsCollection().map((function (_this) {
          return function (content) {
            return _this._renderContent(content, options);
          };
        })(this));
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockView.prototype._renderMoveHandle = function () {
        this.moveHandleView = new MoveHandleView({
          model: this.model
        });
        return this.$el.prepend(this.moveHandleView.render().el);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockView.prototype._renderContainedContentTypes = function () {
        return this.model.getContainedContentTypes().forEach((function (_this) {
          return function (type) {
            return _this.$el.addClass("gl-contains-" + type);
          };
        })(this));
      };
      /**
       * @param opts
       * @return {Object} AssignmentExpression
       */
      BlockView.prototype.initialize = function (opts) {
        this.eventEmitter = opts.eventEmitter;
        this.prototypeMarkupService = opts.prototypeMarkupService;
        return this.contentDecorators = opts.contentDecorators;
      };
      /**
       * @param options
       * @return {Object} ThisExpression
       */
      BlockView.prototype.render = function (options) {
        if (options == null) {
          options = {};
        }
        this._renderId();
        this._renderContents(options);
        this._renderContainedContentTypes();
        if (this._documentSupportsMove()) {
          this._renderMoveHandle();
        }
        return this;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockView.prototype.getDimensions = function () {
        return {
          height: this.$el.height()
        };
      };
      return BlockView;
    })(Backbone.View);
  });