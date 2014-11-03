define(function(require) {

	return function AccountActivityView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountActivityAllTransactionsHeader'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/creditAccountActivityAllTransactionsHeader');

		this.init = function() {
		};
	};
});
