define(function(require) {

    return function helocAccountTileView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccount'));

        this.template = require('dashboard/template/myAccounts/helAccount');

        this.init = function() {
            this.bridge.on('state/makeAsActive', function(data) {
                $('.account-summary-tab').removeClass('active');
                $('.acc' + data.accountId).addClass('active');
            });
        };
    };
});
