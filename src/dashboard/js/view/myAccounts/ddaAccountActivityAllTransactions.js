define(function(require) {

	return function DdaAccountActivityAllTransactionsView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/ddaAccountActivityAllTransactions'));

		this.template = require('dashboard/template/myAccounts/ddaAccountActivityAllTransactions');

		this.init = function() {
            this.bridge.on('state/additionalCriteria', function() {
                $('#defaultMsg').hide();
                $('#noTransactionActivity').show();
                $('#noFilterActivity').hide();
            });
            this.bridge.on('state/noAdditionalCriteria', function() {
                $('#defaultMsg').hide();
                $('#noFilterActivity').show();
                $('#noTransactionActivity').hide();
            });
        };

	};
});
