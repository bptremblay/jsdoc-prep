/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module CancelMerchantBillPaymentView
 */
define(function(require) {

	return function CancelMerchantBillPaymentView() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/payments/payeeActivity/cancelMerchantBillPayment'));
		this.template = require('dashboard/template/payments/payeeActivity/cancelMerchantBillPayment');

		this.init = function() {
			// Handles Funding accounts dropdown  state
			this.bridge.on('state/setFocus', function(data) {
				switch(data.element){
					case 'cancelHeader':
						this.$target.find('#cancel-header').focus();
						break;
					default: break;
				}
			}.bind(this));
		};
	};
});
