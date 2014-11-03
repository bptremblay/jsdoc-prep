define(function(require) {

    return function AccountsContainerView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/accountsContainer'), {});

        this.template = require('dashboard/template/myAccounts/accountsContainer');

        this.init = function() {
        };

    };
});
