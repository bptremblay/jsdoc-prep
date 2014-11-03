define(function(require) {

	return function mortgagePaymentAnalysisView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountPaymentAnalysis'));
		this.template = require('dashboard/template/myAccounts/mortgageAccountPaymentAnalysis');

		this.init = function() {};
	};
});
