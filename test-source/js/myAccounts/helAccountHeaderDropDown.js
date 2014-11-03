define(function(require) {

    return function helAccountsHeaderDropDownView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountThingsYouCanDo'));

        this.template = require('dashboard/template/myAccounts/helHeaderDropDown');

        this.init = function() {};
    };
});
