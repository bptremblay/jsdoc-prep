define(
  /**
   * @exports accountActivity
   */
  function(require) {
    var context = null;
    /** @alias module:accountActivity */
    var exports = {
      /**
       * Init.
       */
      init: function() {
        context = this.settings.context;
      },
      /**
       * List.
       * @param inputData
       */
      list: function(inputData) {
        context.model.lens(inputData.model).set(inputData.data);
      },
      /**
       * Select transaction details.
       */
      selectTransactionDetails: function() {}
    };
    return exports;
  });