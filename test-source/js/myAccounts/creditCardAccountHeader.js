define(function(require) {

    return function CreditCardAccountHeaderView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditCardAccountHeader'));

		this.template = require('dashboard/template/myAccounts/creditCardAccountHeader');

		this.init = function() {
		};

    };
});
