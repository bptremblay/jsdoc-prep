define(function(require) {

    return function heoAccountTileView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccount'));

        this.template = require('dashboard/template/myAccounts/heoAccount');

        this.init = function() {
            this.bridge.on('state/makeAsActive', function(data) {
                $('.account-summary-tab').removeClass('active');
                $('.acc' + data.accountId).addClass('active');
            });
        };
    };
});
