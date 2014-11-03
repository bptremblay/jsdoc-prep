define(function(require) {

    return function helAccountRateLocksView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountRateLocks'));
        this.template = require('dashboard/template/myAccounts/helAccountRateLocks');

        this.init = function() {};
    };
});
