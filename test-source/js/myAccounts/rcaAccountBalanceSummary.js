define(function(require) {

    return function rcaAccountBalanceSummaryView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountBalanceSummary'));
        this.template = require('dashboard/template/myAccounts/rcaAccountBalanceSummary');

        this.init = function() {};
    };
});
