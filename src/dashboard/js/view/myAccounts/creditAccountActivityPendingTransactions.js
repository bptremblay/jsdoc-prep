define(function(require) {

	return function AccountActivityView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountActivityPendingTransaction'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/creditAccountActivityPendingTransaction');

		this.init = function() {
		};

	};
});
