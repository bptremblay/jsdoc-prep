define(function(require) {

	return function CdsAccountHeaderView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/cdsAccountHeader'));

		this.template = require('dashboard/template/myAccounts/cdsAccountHeader');

		this.init = function() {
		};

	};
});
