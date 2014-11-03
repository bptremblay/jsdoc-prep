/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module AddPayeeManualConfirmView
 */
define(function(require) {

	return function PayeeManualConfirmView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));
		template.registerHelper('base1', function(number) {
		 	return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeManualConfirmBridge({
            targets: {
            	payee_name: '#payeeName',
            	payee_nickname: '#payeeNickname',
            	mailing_address_line1: '#mailingAddressLine1',
                mailing_address_line2: '#mailingAddressLine2',
                phone_number: '#phoneNumber',
                account_number: '#payeeAccountNumber',
                note_for_payee: '#noteForPayee',
                transaction_processing_lead_time: '#transactionProcessingLeadTime',
                funding_account_display_name_with_balance: '#fundingAccountDisplayName',
                payee_category_id: '#payeeGroup',
                pay_button: '#pay-button',
                add_button: '#add-button',
                setup_button: '#setup-button'
            }
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeManualConfirm');

		this.init = function() {

		};
	};
});
