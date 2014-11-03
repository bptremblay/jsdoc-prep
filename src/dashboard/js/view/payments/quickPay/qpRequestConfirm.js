define(function(require){
	return function RequestConfirmView(){
		var RequestConfirmBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpRequestConfirm')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpRequestConfirm');

		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));

		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));

		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));

		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

		this.bridge = new RequestConfirmBridge({
			targets: {
				close_button: '#close_button',
				request_more_money_button: '#request_more_money_button'
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
