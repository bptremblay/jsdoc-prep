define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        closeAccountDetails: function() {
            var inputData = this.model.get();
            var params = [inputData.accountId];

            context.appChannel.emit('initAccounts', {
                params: params
            });
        }
    };
});
