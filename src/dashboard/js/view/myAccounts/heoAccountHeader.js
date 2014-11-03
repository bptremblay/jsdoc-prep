define(function(require) {

    return function heoAccountHeaderView() {
        //set up essential view settings
        this.template = require('dashboard/template/myAccounts/heoAccountHeader');

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountHeader'));


        this.init = function() {};



    };

});
