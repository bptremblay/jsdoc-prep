define(function(require) {
    return function updatePaymentDueDateVerifyView() {

        this.template = require('dashboard/template/myAccounts/updatePaymentDueDateVerify');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/updatePaymentDueDateVerify'));

        this.init = function() {};
    };
});
