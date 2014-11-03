define(function(require) {

	return function expandedContainerView() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/expandedContainer'));

		this.template = require('dashboard/template/myAccounts/mortgageExpandedContainer');
	};
});
