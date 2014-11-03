define(function(require) {
    return function updatePaymentDueDateConfirmView() {

        this.template = require('dashboard/template/myAccounts/updatePaymentDueDateConfirm');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/updatePaymentDueDateConfirm'));

        this.init = function() {};
    };
});
