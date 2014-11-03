define(function(require) {

    return function heoAccountRecentPaymentView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountRecentPayment'));
        this.template = require('dashboard/template/myAccounts/heoAccountRecentPayment');

        this.init = function() {};
    };
});
