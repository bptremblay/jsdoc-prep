define(function(require) {

	return function DdaAccountHeaderView() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/ddaAccountHeader'));

		this.template = require('dashboard/template/myAccounts/ddaAccountHeader');

		this.init = function() {
			this.bridge.on('state/showDebitCardCoverage', function() {
				$('#debitCardCoverage').show();
			});

			this.bridge.on('state/doNotShowInterest', function() {
                $('#interestByYear').hide();
                $('#rateOfInterest').hide();
            });
			this.bridge.on('state/doNotShowWithdrawals', function() {
                $('#withdrawals').hide();
            });
		};

	};
});
