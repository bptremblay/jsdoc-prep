define(function(require) {

    return function CreditCardAccountThingsYouCanDoView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditCardAccountThingsYouCanDo'));

        this.template = require('dashboard/template/myAccounts/creditCardAccountThingsYouCanDo');

        this.init = function() {};
    };
});
