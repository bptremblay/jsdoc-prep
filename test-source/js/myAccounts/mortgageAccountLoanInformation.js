define(function(require) {

	return function mortgageLoanInformationView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountLoanInformation'));
		this.template = require('dashboard/template/myAccounts/mortgageAccountLoanInformation');

		this.init = function() {

			this.bridge.on('state/fixedInterest', function() {
				$('#fixedRate').hide();

			});

			this.bridge.on('state/adjustableInterest', function() {
				$('.adjustableRate').hide();

			});
		};
	};
});
