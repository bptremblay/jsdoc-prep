define(
  /**
   * @exports js/service/auth
   */
  function() {
    /**
     * Auth service.
     */
    return function authService() {
      var svcProps = {
        settings: {
          timeout: 8000,
          type: 'POST',
          dataType: 'json'
        }
      };
      this.serviceCalls = {
        userenrollmentlocate: svcProps
      };
    };
  });