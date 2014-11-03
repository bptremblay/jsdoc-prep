define(function(require) {

    return function sharedLoanMortgageActivityView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountActivity'));
        this.template = require('dashboard/template/myAccounts/helAccountActivity');

        this.init = function() {

        };

    };
});
