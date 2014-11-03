/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SinglePaymentView
 */
 define(function(require) {

 	var DOM = require('dashboard/vendor/shim/better-dom');

 	return function SinglePaymentEnterView() {
 		var self = this;
 		var template = require('blue/template'),
 		MerchantBillPayBridge = require('dashboard/view/bridge/payments/merchantBillPayBridge');

 		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));
 		template.registerPartial('menu', require('dashboard/template/payments/payBills/common/menu'));
 		template.registerPartial('submenu', require('dashboard/template/payments/payBills/common/submenu'));
 		template.registerPartial('button', require('dashboard/template/payments/payBills/common/button'));

 		this.bridge = new MerchantBillPayBridge.singlePaymentEnterBridge({
 			targets: {
 				payee_name: '#payeeName',
 				funding_account_display_name_with_balance: '#fundingAccountDisplayNameWithBalance',
 				transaction_amount: '#transactionAmount',
 				transaction_initiation_date: '#transactionInitiationDate',
 				transaction_due_date: '#transactionDueDate',
 				memo: '#memo',
 				next_button: '#next-button',
 				cancel_button: '#cancel-button'
 			}
 		});

 		this.template = require('dashboard/template/payments/merchantBillPay/singlePaymentEnter');

 		this.init = function() {
 			var dateinput = require('dashboard/vendor/shim/better-dateinput-polyfill');
 			this.hideOverlay();

			// Handles Funding accounts dropdown  state
			this.bridge.on('state/setPaymentOptions', function(data) {
				self.setPaymentOptions(data.listData, data.cueText);
			});

			// Handles Funding accounts dropdown  state
			this.bridge.on('state/setPayee', function(data) {
				$('#payeeName').val(data.payeeId);
			});
		};

		/**
		 * Function for handling the display of FundingAccounts in the dropdown using jquery
		 * @function setPaymentOptions
		 * @memberOf module:PayeeActivityView
		 */
		 this.setPaymentOptions = function(inputData, cueText) {
		 	var options = $('#fundingAccountDisplayNameWithBalance');
		 	$(options).empty();
		 	options.append($('<option />').val('').text(cueText));

		 	$.each(inputData, function() {
		 		var label = this.label + ' $' + this.availableBalance;
		 		if (this.defaultAccount){
		 			options.append($('<option />').val(this.id).text(label).attr('selected', 'selected'));
		 		}
		 		else {
		 			options.append($('<option />').val(this.id).text(label));
		 		}

		 	});

		 };




		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
