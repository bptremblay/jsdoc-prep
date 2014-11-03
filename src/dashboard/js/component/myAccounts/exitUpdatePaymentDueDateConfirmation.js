define(function(require) {
    var context = null,
        dynamicContentUtil = require('common/utility/dynamicContentUtil');

    return {
        init: function() {
            context = this.settings.context;
        },
        doNotExitUpdatePaymentDueDate: function() {
            context.appChannel.emit('getUpdatePaymentDueDateInitiate', this.model.get());
        },
        confirmExitUpdatePaymentDueDate: function() {
            var inputData = this.model.get();

            //redirect to dashboard page
            var params = [inputData.accountId];

            context.appChannel.emit('initAccounts', {
                params: params
            });
        }
    };
});
