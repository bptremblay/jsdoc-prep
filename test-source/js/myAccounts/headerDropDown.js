define(function(require) {

    return function HeaderDropDownView() {

    	this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/headerDropDown'));
    	this.template = require('dashboard/template/myAccounts/headerDropDown');

    };
});
