/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {

	return function SinglePaymentConfirmView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));

		this.bridge = new MerchantBillPayBridge.singlePaymentConfirmBridge({
			targets: {
				payee_name: '#payeeName',
				funding_account_display_name_with_balance: '#fundingAccountDisplayNameWithBalance',
				transaction_amount: '#transactionAmount',
				transaction_initiation_date: '#transactionInitiationDate',
				transaction_due_date: '#transactionDueDate',
				memo: '#memo',
				transaction_number: '#transactionNumber',
				close_button: '#close-button'
			}
		});

		this.template = require('dashboard/template/payments/merchantBillPay/singlePaymentConfirm');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
