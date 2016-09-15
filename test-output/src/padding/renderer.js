define(['jquery', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/padding/renderer
   * @requires jquery
   * @requires column-and-block-layout-editor-path/constants
   */
  function ($, constants) {
    /**
     * The padding renderer.
     */
    var PaddingRenderer;
    return PaddingRenderer = ( /**@lends module:src/padding/renderer~PaddingRenderer# */ function () {
      /**
       * @constructor
       * @param config
       */
      function PaddingRenderer(config) {
        this.markup = config.markup;
        this.padding = config.padding;
      }
      PaddingRenderer.render = function (config) {
        if (config == null) {
          config = {};
        }
        return new PaddingRenderer(config).render();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PaddingRenderer.prototype.render = function () {
        /**
         * The $markup.
         */
        var $markup, $paddingElement;
        $markup = $(this.markup);
        $paddingElement = this._getPaddingElement($markup);
        $paddingElement.css('padding-left', this.padding.left);
        $paddingElement.css('padding-right', this.padding.right);
        return $markup.prop('outerHTML');
      };
      /**
       * @param $markup
       */
      PaddingRenderer.prototype._getPaddingElement = function ($markup) {
        return $markup.find(constants.SELECTORS.PADDING_ELEMENT).addBack(constants.SELECTORS.PADDING_ELEMENT);
      };
      return PaddingRenderer;
    })();
  });