define(function(require) {

    return function sharedLoanMortgageActivityView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountActivity'));
        this.template = require('dashboard/template/myAccounts/rcaAccountActivity');

        this.init = function() {

        };

    };
});
