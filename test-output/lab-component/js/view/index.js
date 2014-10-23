define(function(require) {
  /**
   * Creates a new instance of class IndexView.
   * @constructor
   */
  return function IndexView() {
    /**
     * Init.
     */
    this.init = function() {
      this.viewName = 'index';
      this.bridge = this.createBridge(require('lab-component/view/webspec/contactForm'));
      this.template = require('lab-component/template/contactForm');
    };
  };
});