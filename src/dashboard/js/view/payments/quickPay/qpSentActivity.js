define(function(require){
	return function SentActivityView(){
		var self = this;
		var SentActivityBridge = this.createBridgePrototype(require('dashboard/view/webspec/payments/quickPay/qpSentActivity')),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/quickPay/qpSentActivity');

		template.registerPartial('table', require('dashboard/template/payments/quickPay/common/table'));

		template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new SentActivityBridge({
            targets: {
                see_details_link: 'a.see_details_link',
                edit_link: 'a.edit_link',
                cancel_link: 'a.cancel_link',
                send_inquiry_link: 'a.send_inquiry_link',
                see_more: '#see_more',
                close:'#close'
            }
        });

		this.init = function() {
		};
	};
});
