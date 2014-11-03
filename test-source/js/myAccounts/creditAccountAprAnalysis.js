define(function(require) {

	return function creditAccountAprAnalysisView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountAprAnalysis'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardscardapr');

		this.init = function() {
		};

	};
});
