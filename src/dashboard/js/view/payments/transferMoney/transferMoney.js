define(function(require) {

    return function transferMoneyView() {
        var transferMoneyBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/transferMoney/transferMoney'), {});

        this.bridge = new transferMoneyBridge({
            targets: {}
        });

        //render the default view
        this.template = require('dashboard/template/payments/transferMoney/transferMoney');

        this.init = function() {
            $('.overlay, #pre-loader').hide();
        };
    };
});