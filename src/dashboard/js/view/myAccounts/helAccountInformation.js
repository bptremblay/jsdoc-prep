define(function(require) {

    return function helAccountInformationView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountInformation'));
        this.template = require('dashboard/template/myAccounts/helAccountInformation');

        this.init = function() {
        	 this.bridge.on('state/secondaryName', function() {
                $('.secondaryBorrowerName').hide();
            });
        };
    };
});
