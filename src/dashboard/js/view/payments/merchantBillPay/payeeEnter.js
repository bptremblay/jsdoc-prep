/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayeeEnterView
 */
define(function(require) {
	var DOM = require('dashboard/vendor/shim/better-dom');

	return function PayeeEnterView() {

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

		this.bridge = new MerchantBillPayBridge.payeeEnterBridge({
			targets: {
				payee_name: '#payeeName',
				zip_code: '#zipCode',
				zip_code_extension: '#zipCodeExtension',
				payee_account_number: '#payeeAccountNumber',
				payee_confirmed_account_number: '#payeeConfirmedAccountNumber',
				continue_button: '#continue-button',
				cancel_button: '#cancel-button'
			}
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeEnter');

		this.init = function() {
			//TODO: This can be removed (Kaushik)
			//var dateinput = require('dashboard/vendor/shim/better-dateinput-polyfill');
			//this.hideOverlay();
		};

		//TODO: This can be removed (Kaushik)
		// this.hideOverlay = function() {
		// 	$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
		// 	$('#modal-content').empty();
		// };
	};
});
