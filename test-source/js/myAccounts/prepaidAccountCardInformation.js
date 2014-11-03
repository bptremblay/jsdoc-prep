define(function(require) {

	return function prepaidAccountCardInformationView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/prepaidAccountCardInformation'));
		//render the default view
		this.template = require('dashboard/template/myAccounts/prepaidAccountCardInformation');

		this.init = function() {
		};

	};
});
