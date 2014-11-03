define(function(require) {

	var paymentsActivityHeaderBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/paymentsActivity/paymentsActivityHeader'), {});
	var componentChannel = require('blue/event/channel/component');

	return function paymentsActivityHeaderView() {
		var self = this;

		self.bridge = new paymentsActivityHeaderBridge({
			targets: {
				'exit-payment-activity': "#exit-payment-activity"
				//'automatic_payment_enrollment_status': '#automatic_payment_enrollment_status'
			}
		});

		this.template = require('dashboard/template/payments/paymentsActivity/paymentsActivityHeader');

		this.init = function() {
			console.log("THIS -->", this);
		};

		this.onDataChange = function onDataChange() {
			this.rerender();
		};
	};
});
