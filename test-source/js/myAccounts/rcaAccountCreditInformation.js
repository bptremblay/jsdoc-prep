define(function(require) {

    return function rcaAccountCreditInformationView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountCreditInformation'));
        this.template = require('dashboard/template/myAccounts/rcaAccountCreditInformation');

        this.init = function() {
        	 this.bridge.on('state/secondaryName', function() {
                $('.secondaryBorrowerName').hide();
            });
        };
    };
});
	