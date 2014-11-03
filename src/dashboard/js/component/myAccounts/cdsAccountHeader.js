define(function(require) {

	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},

		requestAccountHeaderDetails: function(inputData, detailsData) {
			this.accountName = inputData.accountName;
			this.accountMaskNumber = inputData.accountMask;
			this.accountBalance = detailsData.presentBalance;
			this.accountAvailableBalance = detailsData.available;
			this.interestEarnedYTD = detailsData.ytdInterest;
			this.interestRate = detailsData.interestRate;
			this.interestAccrued = detailsData.interestNotYetPaid;
			this.issueDate = detailsData.issueRenewalDate;
			this.maturityDate = detailsData.maturityDate;
			this.annualPercentageYield = detailsData.annualPercentYield;
		},
		requestAccountStatements: function() {
		},
		updateStatementSettings: function() {
		},
		updateAlertsSettings: function() {
		},
		setupDirectDeposit: function() {
		},
		requestTaxForms: function() {
		},
		requestBankingForms: function() {
		}
	};
});
