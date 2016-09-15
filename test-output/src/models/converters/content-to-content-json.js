define(['underscore'],
  /**
   * @exports src/models/converters/content-to-content-json
   * @requires underscore
   */
  function (_) {
    /**
     * The content to content json.
     */
    var ContentToContentJson;
    return ContentToContentJson = ( /**@lends module:src/models/converters/content-to-content-json~ContentToContentJson# */ function () {
      /**
       * @constructor
       * @param descriptor1
       * @param contentType1
       * @param decoratorType1
       */
      function ContentToContentJson(descriptor1, contentType1, decoratorType1) {
        this.descriptor = descriptor1;
        this.contentType = contentType1;
        this.decoratorType = decoratorType1;
      }
      ContentToContentJson.convert = function (descriptor, contentType, decoratorType) {
        return new ContentToContentJson(descriptor, contentType, decoratorType).convert();
      };
      /**
       * @todo Add some jsDoc comments here!
       */
      ContentToContentJson.prototype.convert = function () {
        return _.extend({
          name: this.descriptor.name,
          type: this.contentType,
          decoratorType: this.decoratorType || null
        });
      };
      return ContentToContentJson;
    })();
  });