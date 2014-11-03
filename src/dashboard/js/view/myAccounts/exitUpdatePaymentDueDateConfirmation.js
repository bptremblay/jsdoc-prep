define(function(require) {
    return function exitUpdatePaymentDueDateConfirmationView() {

        this.template = require('dashboard/template/myAccounts/exitUpdatePaymentDueDateConfirmation');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/exitUpdatePaymentDueDateConfirmation'));

        this.init = function() {};
    };
});
