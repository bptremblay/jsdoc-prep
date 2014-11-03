define(function(require) {

	return function creditAccountUltimateRewardsView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountUltimateRewards'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardscardultimaterewards');

		this.init = function() {
		};

	};
});
