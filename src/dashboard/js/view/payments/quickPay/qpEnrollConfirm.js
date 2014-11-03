define(function(require){
	return function EnrollConfirmView(){
		var template = require('blue/template');
		var EnrollConfirmBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpEnrollConfirm'));

		this.template = require('dashboard/template/payments/quickPay/qpEnrollConfirm');
		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));
		template.registerPartial('progressbar', require('dashboard/template/payments/quickPay/common/progressbar'));
		template.registerHelper('base1', function(number) {
		return number + 1;
		});

        this.bridge = new EnrollConfirmBridge({
            targets: {
                send_money_button: '#send_money_button',
                request_money_button: '#request_money_button',
                close_button: '#close_button',

				email_addresses: '',
				phone_numbers: '',
				quickpay_enrollment_legal_acceptance: '',
				quickpay_pending_actions_count: ''
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
