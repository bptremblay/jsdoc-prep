define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        initiateUpdatePaymentDueDate: function() {
			context.getUpdatePaymentDueDateInitiate(this.model.get());
        },
        verifyUpdatePaymentDueDate: function(paymentData) {
            context.getUpdatePaymentDueDateVerify(this.model.get());
        },
        confirmUpdatePaymentDueDate: function() {
            context.getUpdatePaymentDueDateConfirm(this.model.get());
        },
        cancelUpdatePaymentDueDate: function() {
            context.getUpdatePaymentDueDateCancel(this.model.get());
        },
        exitUpdatePaymentDueDate: function() {
            var inputData = this.model.get();
            //redirect to dashboard page
            var params = [inputData.accountId];
            context.appChannel.emit('initAccounts', {
                params: params
            });
        }
    };
});
