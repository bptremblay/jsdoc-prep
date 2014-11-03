define(function(require) {
	return function mortgageEscrowView() {

		this.template = require('dashboard/template/myAccounts/mortgageAccountCashBack');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountCashBack'));

		this.init = function() {};
	};
});
