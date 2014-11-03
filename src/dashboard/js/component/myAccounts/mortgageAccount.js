define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        toggleAccountTile: function() {},
        requestAccountInformation: function() {
            var data = context.dataTransform.accountModelData(this.model.get());

            context.appChannel.emit('getDetails', data);
            context.appChannel.emit('setAccountActivity', data);

            //Add Active class
            this.output.emit('state', {
                target: this,
                value: 'makeAsActive',
                accountId: data.accountId
            });
        },
        requestAccountSummary: function(updatedInfo) {
            this.nextPaymentDueAmount = updatedInfo.accountBalance;
            this.accountBalance = updatedInfo.accountBalance;
            this.lastUpdatedAt = updatedInfo.lastUpdatedAt;
        }
    };
});
