define(function(require) {

	return function creditAccountCashAdvanceAnalysisView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountCashAdvanceAnalysis'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardscardcashadvance');

		this.init = function() {
		};

	};
});
