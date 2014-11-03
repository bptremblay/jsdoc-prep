define(function(require) {

    return function helAccountBalanceSummaryView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountBalanceSummary'));
        this.template = require('dashboard/template/myAccounts/helAccountBalanceSummary');

        this.init = function() {};
    };
});
