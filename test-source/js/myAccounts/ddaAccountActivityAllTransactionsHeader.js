define(function(require) {

	return function DdaAccountActivityHeaderView() {

        this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/ddaAccountActivityAllTransactionsHeader'));

        this.template = require('dashboard/template/myAccounts/ddaAccountActivityAllTransactionsHeader');

        this.init = function() {
        };

	};
});
