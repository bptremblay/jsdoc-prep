define(['column-and-block-layout-editor-path/models/converters/content-to-content-json'],
  /**
   * @exports src/models/converters/block-descriptor-to-content-json
   * @requires column-and-block-layout-editor-path/models/converters/content-to-content-json
   */
  function (ContentToContentJson) {
    /**
     * The block descriptor to content.
     */
    var BlockDescriptorToContent;
    return BlockDescriptorToContent = ( /**@lends module:src/models/converters/block-descriptor-to-content-json~BlockDescriptorToContent# */ function () {
      /**
       * @constructor
       * @param descriptor1
       * @param decoratorType1
       */
      function BlockDescriptorToContent(descriptor1, decoratorType1) {
        this.descriptor = descriptor1;
        this.decoratorType = decoratorType1;
        if (this.descriptor.payload.contents.length > 1) {
          throw new Error('Cannot convert a block descriptor containing more than one content editor to a single content editor without losing data.');
        }
      }
      BlockDescriptorToContent.convert = function (descriptor, decoratorType) {
        return new BlockDescriptorToContent(descriptor, decoratorType).convert();
      };
      /**
       * @return {Object} AssignmentExpression
       */
      BlockDescriptorToContent.prototype.convert = function () {
        /**
         * The content JSON.
         */
        var contentJSON, firstContent;
        firstContent = this.descriptor.payload.contents[0];
        return contentJSON = ContentToContentJson.convert(firstContent, firstContent.type, this.decoratorType);
      };
      return BlockDescriptorToContent;
    })();
  });