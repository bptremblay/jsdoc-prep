define(function(require) {

    return function ddaThingsYouCanDoDropdownView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/ddaThingsYouCanDoDropdown'));

        this.template = require('dashboard/template/myAccounts/ddaThingsYouCanDoDropdown');

        this.init = function() {
        };
    };
});
