define(
  /**
   * @exports accountDetailsHeader
   * @requires jquery
   */
  function(require) {
    /**
     * Account details header view.
     */
    return function accountDetailsHeaderView() {
      this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/accountDetailsHeader'));
      this.template = require('dashboard/template/myAccounts/accountDetailsHeaderShared');
      /**
       * Init.
       */
      this.init = function() {
        this.bridge.on('state/asOfDateHide', function() {
          $('#accountUpdateDate').hide();
        });
      };
    };
  });