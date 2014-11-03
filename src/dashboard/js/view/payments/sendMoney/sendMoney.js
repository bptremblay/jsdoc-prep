define(function(require) {

    return function sendMoneyView() {
        var sendMoneyBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/sendMoney/sendMoney'), {});


        this.bridge = new sendMoneyBridge({
            targets: {}
        });

        //render the default view
        this.template = require('dashboard/template/payments/sendMoney/sendMoney');

        this.init = function() {
            $('.overlay, #pre-loader').hide();
        };
    };
});