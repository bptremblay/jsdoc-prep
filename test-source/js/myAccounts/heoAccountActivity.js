define(function(require) {

    return function sharedLoanMortgageActivityView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountActivity'));
        this.template = require('dashboard/template/myAccounts/heoAccountActivity');

        this.init = function() {

        };

    };
});
