define(function(require) {

    return function helAccountRecentPaymentView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountRecentPayment'));
        this.template = require('dashboard/template/myAccounts/helAccountRecentPayment');

        this.init = function() {};
    };
});
