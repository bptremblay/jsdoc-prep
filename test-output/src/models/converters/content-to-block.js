define(
  /**
   * @exports src/models/converters/content-to-block
   */
  function () {
    /**
     * The content to block.
     */
    var ContentToBlock;
    return ContentToBlock = ( /**@lends module:src/models/converters/content-to-block~ContentToBlock# */ function () {
      /**
       * @constructor
       * @param descriptor1
       * @param contentType1
       * @param actualCreate1
       */
      function ContentToBlock(descriptor1, contentType1, actualCreate1) {
        this.descriptor = descriptor1;
        this.contentType = contentType1;
        this.actualCreate = actualCreate1 != null ? actualCreate1 : false;
      }
      ContentToBlock.convert = function (descriptor, contentType, actualCreate) {
        return new ContentToBlock(descriptor, contentType, actualCreate).convert();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentToBlock.prototype.convert = function () {
        return {
          id: this.descriptor.name,
          contents: [{
            name: this.descriptor.name,
            type: this.contentType,
            actualCreate: this.actualCreate
          }]
        };
      };
      return ContentToBlock;
    })();
  });