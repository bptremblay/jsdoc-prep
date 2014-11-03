define(function(require) {

    return function heoAccountThingsYouCanDoView() {
        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountThingsYouCanDo'));

        this.template = require('dashboard/template/myAccounts/heoAccountThingsYouCanDo');

        this.init = function() {};
    };
});
