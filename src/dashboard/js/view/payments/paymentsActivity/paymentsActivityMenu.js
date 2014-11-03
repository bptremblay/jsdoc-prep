define(function(require) {

	var paymentsActivityMenuBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/paymentsActivity/paymentsActivityMenu'), {});
	var componentChannel = require('blue/event/channel/component');

	return function paymentsActivityMenuView() {
		var self = this;

		self.bridge = new paymentsActivityMenuBridge({
			targets: {
           	 'credit-card-link':'#payment-activity-credit-card-link',
           	 "exit-payment-activity": "#exit-payment-activity"
			}
		});

		this.template = require('dashboard/template/payments/paymentsActivity/paymentsActivityMenu');

		this.init = function() {
            self.bridge.on('state/hidePaymentActivitySelectionMessage', function(data) {
                $('#payment_activity_selection_message').addClass('hide-xs');
            });
		};

		this.onDataChange = function onDataChange() {
			this.rerender();
		};
	};
});
