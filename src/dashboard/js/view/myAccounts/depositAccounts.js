define(function(require) {

	return function DepositAccountsView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/depositAccounts'));

		this.template = require('dashboard/template/myAccounts/depositAccounts');

		this.init = function() {
			this.bridge.on('state/makeAsActive', function(data) {
				$('.account-summary-tab').removeClass('active');
				$('.acc' + data.accountId).addClass('active');
			});
		};

	};
});
