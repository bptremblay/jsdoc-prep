define(function(require) {

    return function mortgageAccountCashBackView() {
        this.template = require('dashboard/template/myAccounts/mortgageAccountCashBack');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccountCashBack'));


        this.init = function() {
            this.bridge.on('state/cashHide', function() {
                $('#balanceLabel').hide();
            });
            this.bridge.on('state/cashHideBack', function() {
                $('#cancalledLabel').hide();
            });
        };
    };
});
