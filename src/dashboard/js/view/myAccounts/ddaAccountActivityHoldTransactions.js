define(function(require) {

	return function DdaAccountActivityHoldTransactionView() {

		this.bridge = this.createBridge(require('dashboard/view/webspec/myAccounts/ddaAccountActivityHoldTransactions'));

		this.template = require('dashboard/template/myAccounts/ddaAccountActivityHoldTransactions');

		this.init = function(){};
	};

});
