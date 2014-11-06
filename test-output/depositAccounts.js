define(
  /**
   * @exports depositAccounts
   */
  function(require) {
    var context = null;
    return /**@alias module:depositAccounts */ {
      /**
       * Init.
       */
      init: function() {
        context = this.settings.context;
      },
      /**
       * Request account information.
       */
      requestAccountInformation: function() {
        var data = context.dataTransform.accountModelData(this.model.get());
        context.appChannel.emit('getDetails', data);
        if (data.detailType !== 'CDA' && data.detailType !== 'IRA') {
          context.appChannel.emit('setAccountActivity', data);
        }
        //Add Active class
        this.output.emit('state', {
          target: this,
          value: 'makeAsActive',
          accountId: data.accountId
        });
      },
      /**
       * Request account summary.
       * @param updatedInfo
       */
      requestAccountSummary: function(updatedInfo) {
        this.accountBalance = updatedInfo.accountBalance;
      }
    };
  });