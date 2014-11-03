define(function(require) {

    return function mortgageAccountTileView() {
        this.template = require('dashboard/template/myAccounts/mortgageAccount');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/mortgageAccount'));

        this.init = function() {
            this.bridge.on('state/makeAsActive', function(data) {
                $('.account-summary-tab').removeClass('active');
                $('.acc' + data.accountId).addClass('active');
            });
        };
    };
});
