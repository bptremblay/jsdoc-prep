define(function(require) {

	return function prepaidAccountThingsYouCanDoView() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/prepaidAccountThingsYouCanDo'));

		this.template = require('dashboard/template/myAccounts/prepaidAccountThingsYouCanDo');

		this.init = function() {};
	};
});
