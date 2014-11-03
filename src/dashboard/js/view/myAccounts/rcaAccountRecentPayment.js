define(function(require) {

    return function rcaAccountRecentPaymentView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountRecentPayment'));
        this.template = require('dashboard/template/myAccounts/rcaAccountRecentPayment');

        this.init = function() {};
    };
});
