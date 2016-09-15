define(['jquery', 'column-and-block-layout-editor-path/constants'],
  /**
   * @exports src/padding/parser
   * @requires jquery
   * @requires column-and-block-layout-editor-path/constants
   */
  function ($, constants) {
    /**
     * The padding parser.
     */
    var PaddingParser;
    return PaddingParser = ( /**@lends module:src/padding/parser~PaddingParser# */ function () {
      /**
       * @constructor
       * @param markup
       */
      function PaddingParser(markup) {
        this.$paddingElement = $(markup).find(constants.SELECTORS.PADDING_ELEMENT).addBack(constants.SELECTORS.PADDING_ELEMENT);
      }
      PaddingParser.parse = function (renderedMarkup) {
        return new PaddingParser(renderedMarkup).parse();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      PaddingParser.prototype.parse = function () {
        return {
          left: this._readCss('padding-left'),
          right: this._readCss('padding-right')
        };
      };
      /**
       * @param attribute
       */
      PaddingParser.prototype._readCss = function (attribute) {
        return this._parsePx(this.$paddingElement.css(attribute));
      };
      /**
       * @param pxString
       * @return {Boolean}
       */
      PaddingParser.prototype._parsePx = function (pxString) {
        return parseInt(pxString, 10) || 0;
      };
      return PaddingParser;
    })();
  });