/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
define(function(require) {

	return function PayeeVerifyView() {

		var controllerChannel = require('blue/event/channel/controller'),
			template = require('blue/template'),
			MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
		template.registerPartial('payeeAddressBlock', require('dashboard/template/payments/merchantBillPay/common/payeeAddressBlock'));
		template.registerHelper('base1', function(number) {
		 	return number + 1;
		});

		this.bridge = new MerchantBillPayBridge.payeeVerifyAddressBridge({
            targets: {
            	mailing_address_line1: '#payeeAddress1',
				mailing_address_line2: '#payeeAddress2',
				city: '#city',
				state: '#state',
				zip_code: '#zipCode',
				phone_number: '#phoneNumber',
				zip_code_extension: '#zipCodeExtension'
            }
		});

		this.template = require('dashboard/template/payments/merchantBillPay/payeeVerifyAddress');

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
