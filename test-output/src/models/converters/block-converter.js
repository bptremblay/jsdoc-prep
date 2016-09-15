define(['column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/models/converters/block-descriptor-to-block',
    'column-and-block-layout-editor-path/models/converters/content-to-block'
  ],
  /**
   * @exports src/models/converters/block-converter
   * @requires column-and-block-layout-editor-path/constants
   * @requires column-and-block-layout-editor-path/models/converters/block-descriptor-to-block
   * @requires column-and-block-layout-editor-path/models/converters/content-to-block
   */
  function (constants, BlockDescriptorToBlock, ContentToBlock) {
    /**
     * The block converter.
     */
    var BlockConverter;
    return BlockConverter = ( /**@lends module:src/models/converters/block-converter~BlockConverter# */ function () {
      /**
       * @constructor
       */
      function BlockConverter() {}
      /**
       * @param content
       * @param contentType
       * @param actualCreate
       */
      BlockConverter.convert = function (content, contentType, actualCreate) {
        if (actualCreate == null) {
          actualCreate = false;
        }
        if (contentType === constants.TYPES.BLOCK) {
          return BlockDescriptorToBlock.convert(content, actualCreate);
        } else {
          return ContentToBlock.convert(content, contentType, actualCreate);
        }
      };
      return BlockConverter;
    })();
  });