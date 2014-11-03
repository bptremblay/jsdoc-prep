define(function(require) {

    return function helAccountInterestAnalysisView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/helAccountInterestAnalysis'));
        this.template = require('dashboard/template/myAccounts/helAccountInterestAnalysis');


        this.init = function() {

        };
    };
});