define(['column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/models/converters/content-to-content-json',
    'column-and-block-layout-editor-path/models/converters/block-descriptor-to-content-json'
  ],
  /**
   * @exports src/models/converters/content-converter
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/models/converters/content-to-content-json
   * @requires column-and-block-layout-editor-path/models/converters/block-descriptor-to-content-json
   */
  function (constants, ContentToContentJson, BlockDescriptorToContentJson) {
    /**
     * The content converter.
     */
    var ContentConverter;
    return ContentConverter = ( /**@lends module:src/models/converters/content-converter~ContentConverter# */ function () {
      /**
       * @constructor
       */
      function ContentConverter() {}
      /**
       * @param content
       * @param contentType
       * @param decoratorType
       */
      ContentConverter.convert = function (content, contentType, decoratorType) {
        if (content.type === constants.TYPES.BLOCK) {
          return BlockDescriptorToContentJson.convert(content, decoratorType);
        } else {
          return ContentToContentJson.convert(content, contentType, decoratorType);
        }
      };
      return ContentConverter;
    })();
  });