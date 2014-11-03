define(function(require) {

    return function sharedLoanMortgageActivityView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountActivity'));
        this.template = require('dashboard/template/myAccounts/mortgageAccountActivity');

        this.init = function() {

        };

    };
});
