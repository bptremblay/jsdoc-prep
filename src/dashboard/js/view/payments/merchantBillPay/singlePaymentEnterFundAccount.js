/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {
	var DOM = require('dashboard/vendor/shim/better-dom');
	var dateinput = require('dashboard/vendor/shim/better-dateinput-polyfill');

	return function SinglePaymentFundAccountView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));

		this.bridge = new MerchantBillPayBridge.singlePaymentEnterFundAccountBridge({
			targets: {
				funding_account_display_name_with_balance: '#fundingAccountDisplayNameWithBalance'
			}
		});

		this.template = require('dashboard/template/payments/merchantBillPay/singlePaymentFundAccount');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
