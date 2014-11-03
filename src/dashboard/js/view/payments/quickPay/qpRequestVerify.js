define(function(require){
	return function RequestVerifyView(){
		var RequestVerifyBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpRequestVerify')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpRequestVerify');

		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));

		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));

		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));

		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new RequestVerifyBridge({
            targets: {
                previous_button: '#previous_button',
                cancel_button: '#cancel_button',
                next_button: '#next_button'
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
