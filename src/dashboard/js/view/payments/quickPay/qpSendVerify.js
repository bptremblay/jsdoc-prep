define(function(require){
	return function VerifyView(){
		var VerifyBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpSendVerify')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpSendVerify');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerPartial('progressbar', require('dashboard/template/payments/quickPay/common/progressbar'));
		template.registerHelper('base1', function(number) {
		return number + 1;
		});

        this.bridge = new VerifyBridge({
            targets: {
                send_next_button: '#send_next_button',
                send_previous_button: '#send_previous_button',
                send_cancel_button: '#send_cancel_button'
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
