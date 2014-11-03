define(function(require) {

	return function creditAccountRecentPaymentView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountRecentPayment'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardscardpaymentactivity');

		this.init = function() {
		};

	};
});
