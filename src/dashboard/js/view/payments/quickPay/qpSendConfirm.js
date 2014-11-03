define(function(require){
	return function ConfirmView(){
		var VerifyBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpSendConfirm')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpSendConfirm');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerHelper('base1', function(number) {
		return number + 1;
		});

		this.bridge = new VerifyBridge({
			targets: {
				send_close_button: '#send_close_button',
				send_more_money_button: '#send_more_money_button'
			}
		});

		this.init = function() {
			this.hideOverlay();
		};

		this.hideOverlay = function() {
			$('.modal-popup, .overlay, #pre-loader').fadeOut(300);
			$('#modal-content').empty();
		};
	};
});
