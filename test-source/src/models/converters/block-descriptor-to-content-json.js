// Generated by CoffeeScript 1.10.0
define(['column-and-block-layout-editor-path/models/converters/content-to-content-json'], function(ContentToContentJson) {
  var BlockDescriptorToContent;
  return BlockDescriptorToContent = (function() {
    function BlockDescriptorToContent(descriptor1, decoratorType1) {
      this.descriptor = descriptor1;
      this.decoratorType = decoratorType1;
      if (this.descriptor.payload.contents.length > 1) {
        throw new Error('Cannot convert a block descriptor containing more than one content editor to a single content editor without losing data.');
      }
    }

    BlockDescriptorToContent.convert = function(descriptor, decoratorType) {
      return new BlockDescriptorToContent(descriptor, decoratorType).convert();
    };

    BlockDescriptorToContent.prototype.convert = function() {
      var contentJSON, firstContent;
      firstContent = this.descriptor.payload.contents[0];
      return contentJSON = ContentToContentJson.convert(firstContent, firstContent.type, this.decoratorType);
    };

    return BlockDescriptorToContent;

  })();
});