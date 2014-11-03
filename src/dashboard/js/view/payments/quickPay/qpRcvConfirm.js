define(function(require){
	return function RcvConfirmView(){
		var ReceiveBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpRcvConfirm'));

		var QpHandlebarsHelper = require('dashboard/lib/quickPay/qpHandlebarsHelper');
		var hbs = new QpHandlebarsHelper();
		hbs.ifCond();

  		this.bridge = new ReceiveBridge({
            targets: {
                see_details_link: '.see_details_link'
            }
        });


		this.template = require('dashboard/template/payments/quickPay/qpRcvConfirm');

		this.init = function() {
			this.hideOverlay();
		};

        this.hideOverlay = function() {
            $('.modal-popup, .overlay, #pre-loader').fadeOut(300);
            $('#modal-content').empty();
        };
	};
});
