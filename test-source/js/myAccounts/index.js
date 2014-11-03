define(function(require) {

    return function AccountsView() {
        var LayoutBridge = this.createBridgePrototype(require('dashboard/view/webspec/myAccounts/expandedContainer')),
            self = this;

        self.bridge = new LayoutBridge({
            targets: {}
        });

        this.template = require('dashboard/template/myAccounts/accounts');

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
