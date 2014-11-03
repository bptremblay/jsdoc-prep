define(function(require) {
	return function mortgageEscrowView() {

		this.template = require('dashboard/template/myAccounts/mortgageAccountEscrowSummary');
		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountEscrow'));

		this.init = function() {};

	};
});
