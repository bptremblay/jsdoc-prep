define(
  /**
   * @exports js/view/success
   */
  function(require) {
    /**
     * Creates a new instance of class SuccessView.
     * @constructor
     */
    return function SuccessView() {
      // Set up essential view settings
      this.template = require('logon/template/success');
      /**
       * Init.
       */
      this.init = function() {
        //mock implementation for remember me feature testing, user is hard coded to match
        //the successful login user in virtual service
        var cookieMgr = require('logon/shared/cookieManager'),
          expDate = new Date();
        if (cookieMgr.readCookie('_tmprememberme') === '1') {
          expDate.setDate(expDate.getDate() + 90);
          document.cookie = '_rememberme=chase30user4; expires=' + expDate.toUTCString() + '; path=/';
        } else {
          expDate.setDate(expDate.getDate() - 1);
          document.cookie = '_rememberme=; expires=' + expDate.toUTCString() + '; path=/';
        }
      };
      /**
       * On data change.
       */
      this.onDataChange = function onDataChange() {
        this.rerender();
      };
    };
  });