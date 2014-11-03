define(function(require) {

    return function heoAccountInterestAnalysisView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/heoAccountInterestAnalysis'));
        this.template = require('dashboard/template/myAccounts/heoAccountInterestAnalysis');


        this.init = function() {

        };
    };
});
