define(
  /**
   * @exports accountOverdraftProtection
   */
  function(require) {
    var context = null;
    return {
      /**
       * Init.
       */
      init: function() {
        context = this.settings.context;
      },
      /**
       * Request overdraft limit.
       * @param inputData
       */
      requestOverdraftLimit: function(inputData) {
        this.accountDisplayName = inputData.fundingAccount;
        this.overdraftProtectionLimit = inputData.fundingAccountLimit;
      }
    };
  });