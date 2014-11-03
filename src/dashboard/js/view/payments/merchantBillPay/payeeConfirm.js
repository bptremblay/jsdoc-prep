/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {

	return function PayeeConfirmView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));
		template.registerHelper('base1', function(number) {
		 	return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeConfirmBridge({
            targets: {
            	payee_name: '#payeeName',
            	payee_nickname: '#payeeNickname',
            	postal_address: '#postalAddress',
                phone_number: '#phoneNumber',
                payee_account_number: '#payeeAccountNumber',
                payment_processing_delivery_method: '#deliveryMethod',
                funding_account_display_name_with_balance: '#fundingAccountDisplayNameWithBalance',
                payee_group: '#payeeGroup',
                close_button: '#close-button',
                pay_bill_button: '#pay-bill-button'
            }
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeConfirm');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
