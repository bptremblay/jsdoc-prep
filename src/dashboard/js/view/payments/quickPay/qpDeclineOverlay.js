define(function(require){
	return function DeclineOverlayView(){
		var DeclineOverlayBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpDeclineOverlay'));
		var self = this;

		var template = require('blue/template');
		var controllerChannel = require('blue/event/channel/controller');

		template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

		this.template = require('dashboard/template/payments/quickPay/qpDeclineOverlay');

		this.bridge = new DeclineOverlayBridge({
			targets: {
				confirm_decline_payment:'#declined_button_payment',
				confirm_decline_request:'#declined_button_request',
				cancel_decline:'#cancel_button',
				memo: '#memo'
			}
		});

		this.init = function() {
			controllerChannel.on('showConfirmDecline', function(obj) {
				self.renderDecline(obj.value);
				self.closeDeclineOverlay();
			}.bind(this));
			controllerChannel.on('closeDeclineOverlay', function() {
				self.closeDeclineOverlay();
			}.bind(this));
		};

	   this.renderDecline = function(obj) {
	   		$('#decline_message_' + obj.row_index).text(obj.declineMessage);
	   		$('.defaultHide').hide();
			$('.row_' + obj.row_index).hide();
			$('.show_decline_' + obj.row_index).show();
	   }
	   this.closeDeclineOverlay = function() {
            // $('.defaultHide').hide();
			$('#toDodeclinedOverlay').fadeOut(300);
 	   }
	};
});
