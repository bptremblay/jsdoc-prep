define(function(require) {
  /**
   * Creates a new instance of class ShowDetailsView.
   * @constructor
   */
  return function ShowDetailsView() {
    /**
     * Init.
     */
    this.init = function() {
      this.viewName = 'showDetails';
      this.bridge = this.createBridge(require('lab-component/view/webspec/showDetails'));
      this.template = require('lab-component/template/showDetails');
      this.bridge.on('state/showDetails', function() {}.bind(this));
    };
  };
});