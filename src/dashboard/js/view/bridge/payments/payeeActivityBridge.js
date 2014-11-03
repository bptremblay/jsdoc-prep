define(function(require) {
	var Bridge = require('blue/bridge'),
		payeeActivityWebSpec = require('dashboard/view/webspec/payments/payeeActivity/payeeActivity');

	return function(view) {
		return {
			payeeActivityBridge: view.createBridgePrototype(payeeActivityWebSpec)
		};
	};
});
