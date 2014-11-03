define(function(require) {
	return function DuplicateView() {
		//var self = this;
		var SendBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpSendDuplicate'));
			//template = require('blue/template');

		// var controllerChannel = require('blue/event/channel/controller');

		this.template = require('dashboard/template/payments/quickPay/qpSendDuplicate');
		// template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		// template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
		// template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
		// template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new SendBridge({
            targets: {
                duplicate_next_button: '#duplicate_next_button',
                duplicate_cancel_button: '#duplicate_cancel_button'
            }
        });

        this.init = function() {
			this.renderOverlay();
		};

        this.renderOverlay = function() {
	        var timer = setInterval(function() {
	    		if(!($('#duplicateOverlay').is(':empty')))
	            {
	            	$('#qpSendDubplicateOverlay').fadeIn(300);
	            	clearInterval(timer);
	            }
	        },100);
	    };
	};
});
