define(function(require) {

	return function rcaHeaderDropDownView() {
		this.template = require('dashboard/template/myAccounts/rcaHeaderDropDown');
		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountThingsYouCanDo'));

		this.init = function() {
			
		};
	};
});
