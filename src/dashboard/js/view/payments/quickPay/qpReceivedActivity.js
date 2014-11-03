define(function(require){

    return function ReceivedActivityView(){
        var self = this;
        var ReceivedActivityBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/quickPay/qpReceivedActivity'), {}),
            template = require('blue/template');

        this.template = require('dashboard/template/payments/quickPay/qpReceivedActivity');

        template.registerPartial('table', require('dashboard/template/payments/quickPay/common/table'));

        template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));

        this.bridge = new ReceivedActivityBridge({

            targets: {
                see_details_link: 'a.see_details_link',
                see_more: '#see_more',
                close:'#close'
            }
        });

        this.init = function() {
        };
    };
});
