// Generated by CoffeeScript 1.10.0
define(['column-and-block-layout-editor-path/constants', 'column-and-block-layout-editor-path/models/converters/content-to-content-json', 'column-and-block-layout-editor-path/models/converters/block-descriptor-to-content-json'], function(constants, ContentToContentJson, BlockDescriptorToContentJson) {
  var ContentConverter;
  return ContentConverter = (function() {
    function ContentConverter() {}

    ContentConverter.convert = function(content, contentType, decoratorType) {
      if (content.type === constants.TYPES.BLOCK) {
        return BlockDescriptorToContentJson.convert(content, decoratorType);
      } else {
        return ContentToContentJson.convert(content, contentType, decoratorType);
      }
    };

    return ContentConverter;

  })();
});
