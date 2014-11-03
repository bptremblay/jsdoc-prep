define(function(require) {

    return function creditCardAccountView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditCardAccount'));

		this.template = require('dashboard/template/myAccounts/creditCardAccount');

        this.init = function() {
            this.bridge.on('state/makeAsActive', function(data) {
                $('.account-summary-tab').removeClass('active');
                $('.acc' + data.accountId).addClass('active');
            });
        };

    };
});
