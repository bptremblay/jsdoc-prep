define(function(require) {

	return function mortgageRecentPaymentView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountRecentPayment'));
		this.template = require('dashboard/template/myAccounts/mortgageAccountRecentPayment');

		this.init = function() {

			this.bridge.on('state/lateFeesHide', function() {
				$('#showLateFees').hide();

			});

			this.bridge.on('state/autoPaymentHide', function() {
				$('#automaticPayment').hide();

			});

		};
	};
});
