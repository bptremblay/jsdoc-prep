define(function(require) {

	return function OverdraftProtectionSettingsView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/accountOverdraftProtection'));

		this.template = require('dashboard/template/myAccounts/accountOverdraftProtection');

	};
});
