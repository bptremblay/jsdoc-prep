define(function(require) {

	return function creditAccountInformationView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/creditAccountInformation'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/rewardsCardAccountInfo');

		this.init = function() {
		};

	};
});
