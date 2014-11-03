define(function(require) {

    return function LayoutView() {
        this.template = require('dashboard/template/payments/quickPay/qpServerErrorMessage');
        var LayoutBridge = this.createBridgePrototype({name: 'qpServerErrorMessage', bindings: {}, triggers: {}});
        this.bridge = new LayoutBridge({targets: {}});
        this.init = function() {

      	};

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
