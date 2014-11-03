/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {

	return function SinglePaymentVerifyView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));

		this.bridge = new MerchantBillPayBridge.singlePaymentVerifyBridge({
			targets: {
				payee_name: '#payeeName',
				funding_account_display_name_with_balance: '#fundingAccountDisplayNameWithBalance',
				transaction_amount: '#transactionAmount',
				transaction_initiation_date: '#transactionInitiationDate',
				transaction_due_date: '#transactionDueDate',
				memo: '#memo',
				schedule_payment_button: '#schedule-payment-button',
				previous_button: '#previous-button',
				cancel_button: '#cancel-button'
			}
		});

		this.template = require('dashboard/template/payments/merchantBillPay/singlePaymentVerify');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
