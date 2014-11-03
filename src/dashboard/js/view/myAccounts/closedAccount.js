define(function(require) {

	return function ClosedAccountView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditCardAccountHeader'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/closedAccount');

		this.init = function() {
		};
	};
});
