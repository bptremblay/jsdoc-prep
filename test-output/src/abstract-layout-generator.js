define(['jquery', 'template-engine', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/abstract-layout-generator
   * @requires jquery
   * @requires template-engine
   * @requires column-and-block-layout-editor-path/constants
   */
  function ($, Mustache, constants) {
    /**
     * The abstract layout generator.
     */
    var AbstractLayoutGenerator;
    return AbstractLayoutGenerator = ( /**@lends module:src/abstract-layout-generator~AbstractLayoutGenerator# */ function () {
      /**
       * @constructor
       * @param prototypeMarkupService
       */
      function AbstractLayoutGenerator(prototypeMarkupService) {
        this.prototypeMarkupService = prototypeMarkupService;
      }
      /**
       * @param $protoLayout
       * @param contentType
       * @return {Boolean}
       */
      AbstractLayoutGenerator.prototype._getContentDecoratorName = function ($protoLayout, contentType) {
        /**
         * The content decorators for layout.
         */
        var contentDecoratorsForLayout;
        contentDecoratorsForLayout = this.prototypeMarkupService.getContentDecoratorsByContentType($protoLayout);
        return contentDecoratorsForLayout[contentType] || contentType;
      };
      /**
       * @param contentType
       */
      AbstractLayoutGenerator.prototype._getProtoLayoutFor = function (contentType) {
        return this.prototypeMarkupService.getAbstractLayoutForContentType(contentType);
      };
      /**
       * @param name
       * @param contentType
       */
      AbstractLayoutGenerator.prototype._createProtoLayoutModel = function (name, contentType) {
        return {
          name: name,
          type: 'email-block',
          style: 'padding: 0px 0px 0px 0px;',
          columns: this._createProtoColumnModel(contentType)
        };
      };
      /**
       * @param contentType
       * @return {array}
       */
      AbstractLayoutGenerator.prototype._createProtoColumnModel = function (contentType) {
        if (contentType === constants.TYPES.BLOCK) {
          return [];
        } else {
          return [{
            blocks: [{
              id: '',
              contents: []
            }]
          }];
        }
      };
      /**
       * @param name
       */
      AbstractLayoutGenerator.prototype._createContentDecoratorModel = function (name) {
        return {
          name: name
        };
      };
      /**
       * @param protoLayout
       */
      AbstractLayoutGenerator.prototype._createLayoutAttibutes = function (protoLayout) {
        /**
         * The attrs.
         */
        var attrs;
        attrs = {};
        attrs[constants.DATA_ATTRS.PROTO_LAYOUT] = protoLayout;
        return attrs;
      };
      /**
       * @param $layout
       * @param attrs
       */
      AbstractLayoutGenerator.prototype._addLayoutAttributes = function ($layout, attrs) {
        return $layout.attr(attrs);
      };
      /**
       * @param markup
       * @param model
       */
      AbstractLayoutGenerator.prototype._render = function (markup, model) {
        return Mustache.render(markup, model);
      };
      /**
       * Returns true if is document supported.
       * @param documentFeatures
       * @return {Object} boolean
       */
      AbstractLayoutGenerator.prototype.isDocumentSupported = function (documentFeatures) {
        return documentFeatures.supported(documentFeatures.FEATURES.COLUMN_AND_BLOCK);
      };
      /**
       * @param name
       * @param contentType
       */
      AbstractLayoutGenerator.prototype.createAbstractLayoutMarkup = function (name, contentType) {
        /**
         * The $markup.
         */
        var $markup, protoLayout;
        protoLayout = this._getProtoLayoutFor(contentType);
        $markup = $(this._render(protoLayout.markup, this._createProtoLayoutModel(name, contentType)));
        this._addLayoutAttributes($markup, this._createLayoutAttibutes(protoLayout.name));
        return $markup.prop('outerHTML');
      };
      /**
       * @param layoutMarkup
       * @param contentName
       * @param contentType
       * @param contentMarkup
       */
      AbstractLayoutGenerator.prototype.insertContentMarkup = function (layoutMarkup, contentName, contentType, contentMarkup) {
        /**
         * The $content.
         */
        var $content, $layout, contentDecorator;
        $layout = $(layoutMarkup);
        contentDecorator = this.prototypeMarkupService.getContentDecorator(this._getContentDecoratorName($layout, contentType));
        $content = $('<div/>').append(this._render(contentDecorator.markup, this._createContentDecoratorModel(contentName)));
        $content.find(constants.SELECTORS.CONTENT).replaceWith(contentMarkup);
        return $layout.find(constants.SELECTORS.BLOCKS).append($content.html()).end().prop('outerHTML');
      };
      return AbstractLayoutGenerator;
    })();
  });