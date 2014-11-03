define(function(require) {

	return function creditAccountDetailsHeaderView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/accountDetailsHeader'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardsCardAccDetailHeader');// NEEDS CHANGE

		this.init = function() {
		};

	};
});
