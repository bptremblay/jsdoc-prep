define(function(require) {

    return function ppaView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/prepaidAccountHeader'));

		this.template = require('dashboard/template/myAccounts/prepaidAccountHeader');

		this.init = function() {
		};

    };
});
