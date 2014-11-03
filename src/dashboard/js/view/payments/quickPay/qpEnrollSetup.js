define(function(require){
	return function EnrollSetupView(){
		var EnrollSetupBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpEnrollSetup')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpEnrollSetup');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new EnrollSetupBridge({
            targets: {
                cancel_button: '#cancel_button',
                setup_button: '#setup_button'
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
