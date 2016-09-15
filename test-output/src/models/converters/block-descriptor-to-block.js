define(['underscore'],
  /**
   * @exports src/models/converters/block-descriptor-to-block
   * @requires underscore
   */
  function (_) {
    /**
     * The block descriptor to block.
     */
    var BlockDescriptorToBlock;
    return BlockDescriptorToBlock = ( /**@lends module:src/models/converters/block-descriptor-to-block~BlockDescriptorToBlock# */ function () {
      /**
       * @constructor
       * @param descriptor1
       */
      function BlockDescriptorToBlock(descriptor1) {
        this.descriptor = descriptor1;
      }
      BlockDescriptorToBlock.convert = function (descriptor) {
        return new BlockDescriptorToBlock(descriptor).convert();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockDescriptorToBlock.prototype.convert = function () {
        /**
         * The block.
         */
        var block;
        block = _(this.descriptor.toJSON()).omit('payload', 'dynamic', 'sourceLayoutInstanceId', 'sourceColumnIndex', 'sourceBlockIndex', 'type');
        block.contents = this._getContents();
        return block;
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      BlockDescriptorToBlock.prototype._getContents = function () {
        return this.descriptor.payload.contents.map(function (content) {
          return _(content).omit('state', 'decoratorType');
        });
      };
      return BlockDescriptorToBlock;
    })();
  });