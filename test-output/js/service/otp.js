define(
  /**
   * @exports js/service/otp
   */
  function() {
    /**
     * Otp service.
     */
    return function otpService() {
      var svcProps = {
        settings: {
          timeout: 8000,
          type: 'POST',
          dataType: 'json'
        }
      };
      this.serviceCalls = {
        otplist: svcProps,
        otpsend: svcProps,
        otpprefix: svcProps
      };
    };
  });