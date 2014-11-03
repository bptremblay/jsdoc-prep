define(function(require) {
    return function updatePaymentDueDateBeginView() {

        this.template = require('dashboard/template/myAccounts/updatePaymentDueDateBegin');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/updatePaymentDueDateBegin'));

        this.init = function() {};
    };
});
