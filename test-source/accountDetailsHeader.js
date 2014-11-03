define(function(require) {

    return function accountDetailsHeaderView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/accountDetailsHeader'));
        this.template = require('dashboard/template/myAccounts/accountDetailsHeaderShared');

        this.init = function() {

            this.bridge.on('state/asOfDateHide', function() {
                $('#accountUpdateDate').hide();

            });

        };
    };
});
