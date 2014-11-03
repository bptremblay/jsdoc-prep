/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {

	return function PayeeListVerifyView() {

		var template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));
		template.registerPartial('selectablelist', require('dashboard/template/payments/payBills/common/selectablelist'));
		template.registerPartial('selectablelistwithheader', require('dashboard/template/payments/merchantBillPay/common/selectableListWithHeader'));
		template.registerPartial('promptwithlink', require('dashboard/template/payments/merchantBillPay/common/promptwithlink'));
		template.registerPartial('payeeAddressBlock', require('dashboard/template/payments/merchantBillPay/common/payeeAddressBlock'));
		template.registerPartial('promptwithlink', require('dashboard/template/payments/merchantBillPay/common/promptwithlink'));
		template.registerHelper('base1', function(number) {
		 	return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeListVerifyBridge({
            targets: {
            	payee_id: '.payeeGroupOptions',
            	payee_name: '#payeeName',
            	payee_nickname: '#payeeNickName',
                payee_account_number: '#payeeAccountNumber',
                funding_account_id: '#fundingAccountId',
                payee_category_id: '#payeeCategoryId',
				address_link: '#payeeAddressLink a span',
                add_button: '#add-button',
                prev_button: '#prev-button',
                cancel_button: '#cancel-button'
            }
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeListVerify');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
