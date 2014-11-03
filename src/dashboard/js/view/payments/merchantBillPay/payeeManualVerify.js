/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module AddPayeeManualVerifyView
 */
define(function(require) {

	return function PayeeManualVerifyView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));
		template.registerHelper('base1', function(number) {
		 	return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeManualVerifyBridge({
            targets: {
            	payee_name: '#payeeName',
            	payee_nickname: '#payeeNickname',
                mailing_address_line1: '#mailingAddressLine1',
                mailing_address_line2: '#mailingAddressLine2',
                phone_number: '#phoneNumber',
                account_number: '#payeeAccountNumber',
                note_for_payee: '#noteForPayee',
                transaction_processing_lead_time: '#transactionProcessingLeadTime',
                funding_account_id: '#fundingAccountId',
                payee_category_id: '#payeeCategoryId',
                add_button: '#add-button',
                back_button: '#back-button',
                cancel_button: '#cancel-button'
            }
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeManualVerify');

		this.init = function() {

		};
	};
});
