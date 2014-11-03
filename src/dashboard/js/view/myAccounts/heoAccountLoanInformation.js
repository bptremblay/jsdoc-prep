define(function(require) {

    return function heoAccountLoanInformationView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountLoanInformation'));
        this.template = require('dashboard/template/myAccounts/heoAccountLoanInformation');


        this.init = function() {
            this.bridge.on('state/secondaryName', function() {
                $('.secondaryBorrowerName').hide();
            });

        };
    };
});
