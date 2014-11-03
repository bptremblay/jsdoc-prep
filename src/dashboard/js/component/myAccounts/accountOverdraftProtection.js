define(function(require) {

	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		requestOverdraftLimit: function(inputData) {
			this.accountDisplayName = inputData.fundingAccount;
			this.overdraftProtectionLimit = inputData.fundingAccountLimit;
		}
	};
});
