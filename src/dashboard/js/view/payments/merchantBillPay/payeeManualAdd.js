/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module addPayeeManual View
 */
 define(function(require) {

 	return function payeeManualAdd() {
 		var self = this;
		var template = require('blue/template'),
		MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));
		template.registerPartial('steps', require('dashboard/template/payments/payBills/common/steps'));
		template.registerHelper('base1', function(number) {
			return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeManualAddBridge({
			targets: {
				payee_name: '#payeeName',
				payee_nickname: '#payeeNickName',
				mailing_address_line1: '#payeeAddress1',
				mailing_address_line2: '#payeeAddress2',
				city: '#city',
				state: '#state',
				zip_code: '#zipCode',
				phone_number: '#phoneNumber',
				zip_code_extension: '#zipCodeExtension',
				account_number: '#payeeAccountNumber',
				confirmed_account_number: '#payeeConfirmedAccountNumber',
				account_number_available: '#accountNumberAvailable',
				note_for_payee: '#noteForPayee',
				continue_button: '#continue-button',
				cancel_button: '#cancel-button'
			}
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeManualAdd');

		this.init = function() {

			// Handles AccountNumberOptions  state
			this.bridge.on('state/setAccountNumberOptions', function(data) {
				self.setAccountNumberOptions(data.accountNumberAvailable);
			});

		/**
		 * Function for handling the enable and diabling Account Number fields
		 * @function setAccountNumberOptions
		 * @memberOf module:payeeManualAdd
		 */
		 this.setAccountNumberOptions = function(accountNumberAvailable) {
		 	var payeeAccountNumber = $('#payeeAccountNumber'),
		 		payeeConfirmedAccountNumber = $('#payeeConfirmedAccountNumber'),
		 		dlNoteForPayee = $('#dlNoteForPayee'),
		 		noteForPayee = $('#noteForPayee');


		 	if (accountNumberAvailable === 'false'){
		 		payeeAccountNumber.removeAttr('disabled');
			 	payeeConfirmedAccountNumber.removeAttr('disabled');
			 	noteForPayee.attr('disabled', 'disabled');
			 	noteForPayee.val('');
			 	dlNoteForPayee.hide();
		 	}
		 	else {
		 		payeeAccountNumber.attr('disabled', 'disabled');
			 	payeeConfirmedAccountNumber.attr('disabled', 'disabled');
			 	payeeAccountNumber.val('');
			 	payeeConfirmedAccountNumber.val('');
			 	dlNoteForPayee.show();
			 	noteForPayee.removeAttr('disabled');
		 	}

		 };

		};

	};
});
