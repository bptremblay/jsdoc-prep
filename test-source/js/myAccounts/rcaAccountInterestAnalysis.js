define(function(require) {

    return function rcaAccountInterestAnalysisView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/rcaAccountInterestAnalysis'));
        this.template = require('dashboard/template/myAccounts/rcaAccountInterestAnalysis');


        this.init = function() {

        };
    };
});