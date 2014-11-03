define(function(require) {

    return function rcaAccountView() {
        this.template = require('dashboard/template/myAccounts/rcaAccount');
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccount'));



        this.init = function() {
            this.bridge.on('state/makeAsActive', function(data) {
                $('.account-summary-tab').removeClass('active');
                $('.acc' + data.accountId).addClass('active');
            });
        };


    };
});
