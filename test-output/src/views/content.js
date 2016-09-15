define(['jquery', 'backbone', 'template-engine', 'column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/padding/calculator',
    'column-and-block-layout-editor-path/padding/renderer', 'column-and-block-layout-editor-path/padding/parser'
  ],
  /**
   * @exports src/views/content
   * @requires jquery
   * @requires backbone
   * @requires template-engine
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/padding/calculator
   * @requires column-and-block-layout-editor-path/padding/renderer
   * @requires column-and-block-layout-editor-path/padding/parser
   * @requires underscore
   */
  function ($, Backbone, Mustache, constants, PaddingCalculator, PaddingRenderer, PaddingParser) {
    /**
     * The content view.
     */
    var ContentView, SELECTORS;
    SELECTORS = {
      editor: '[data-editor-type]'
    };
    return ContentView = ( /**@lends module:src/views/content~ContentView# */ function (superClass) {
      extend(ContentView, superClass);
      /**
       * @constructor
       */
      function ContentView() {
        this._setContentVspace = bind(this._setContentVspace, this);
        return ContentView.__super__.constructor.apply(this, arguments);
      }
      /**
       * @return {Object} AssignmentExpression
       */
      ContentView.prototype._set$Editor = function () {
        return this.$editor = this.$el.find(SELECTORS.editor).addBack(SELECTORS.editor);
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentView.prototype._renderTemplate = function () {
        return Mustache.render(this.template, this.model.attributes);
      };
      /**
       * @param markup
       */
      ContentView.prototype._calculatePadding = function (markup) {
        /**
         * The padding.
         */
        var padding;
        if (markup == null) {
          markup = this._renderTemplate();
        }
        if (this.parentPadding) {
          return this.parentPadding;
        }
        padding = PaddingParser.parse(markup);
        return PaddingCalculator.calculate({
          padding: padding,
          hasContentLeft: this.model.hasContentLeft(),
          hasContentRight: this.model.hasContentRight()
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentView.prototype._renderPaddedMarkup = function () {
        return PaddingRenderer.render({
          markup: this._renderTemplate(),
          padding: this.padding
        });
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentView.prototype._renderContainer = function () {
        this.setElement(this._renderPaddedMarkup());
        this.editorIsElement = this.$el.is(SELECTORS.editor);
        this.$el.attr(constants.DATA_ATTRS.CONTENT_DECORATOR, this.model.getDecoratorType());
        return this._set$Editor();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentView.prototype._renderEditableElement = function () {
        /**
         * The $editable element.
         */
        var $editableElement;
        $editableElement = this.model.getEditor().renderForEdit();
        this.eventEmitter.trigger(constants.EVENTS.ADD_PLATFORM_ATTRIBUTES, $editableElement, this.model.getEditor());
        this.$editor.replaceWith($editableElement);
        if (this.editorIsElement) {
          this.setElement($editableElement);
        }
        this._set$Editor();
        return this.model.triggerInsertedIntoBlock(this.padding.left + this.padding.right);
      };
      /**
       * @param options
       */
      ContentView.prototype._renderEditor = function (options) {
        return this.model.initializeContentEditor(options).then((function (_this) {
          return function () {
            return _this._renderEditableElement();
          };
        })(this));
      };
      /**
       * @param options
       */
      ContentView.prototype._renderChildContentView = function (options) {
        /**
         * The $nested content.
         */
        var $nestedContent, child;
        child = this.model.getChildContentModel();
        this.childView = new ContentView({
          model: child,
          eventEmitter: this.eventEmitter,
          template: this.decoratorProviderFn(child.getDecoratorType()),
          parentPadding: this.padding
        });
        $nestedContent = this.$(constants.SELECTORS.NEST_CHILD_CONTENT);
        return $nestedContent.append(this.childView.render(options).el);
      };
      /**
       * @return {Object} AssignmentExpression
       */
      ContentView.prototype._removeChildContentView = function () {
        this.childView.remove();
        return this.childView = null;
      };
      /**
       * @param opts
       */
      ContentView.prototype.initialize = function (opts) {
        this.template = opts.template;
        this.eventEmitter = opts.eventEmitter;
        this.decoratorProviderFn = opts.decoratorProviderFn;
        this.parentPadding = opts.parentPadding || null;
        this.listenTo(this.model, constants.EVENTS.CHILD_CREATED, this._renderChildContentView);
        this.listenTo(this.model, constants.EVENTS.CHILD_REMOVED, this._removeChildContentView);
        if (this.model.supportsContentVspace()) {
          return this.listenTo(this.model, 'change:vspace', this._setContentVspace);
        }
      };
      /**
       * @param options
       * @return {Object} ThisExpression
       */
      ContentView.prototype.render = function (options) {
        if (options == null) {
          options = {};
        }
        this.padding = this._calculatePadding();
        this._renderContainer();
        this._renderEditor(options);
        if (this.model.hasChild()) {
          this._renderChildContentView(options);
        }
        if (this.model.supportsContentVspace()) {
          this._setContentVspace();
        }
        return this;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentView.prototype._setContentVspace = function () {
        if (this.model.get('vspace')) {
          return this.$el.addClass(constants.CLASSES.CONTENT_VSPACE);
        } else {
          return this.$el.removeClass(constants.CLASSES.CONTENT_VSPACE);
        }
      };
      return ContentView;
    })(Backbone.View);
  });