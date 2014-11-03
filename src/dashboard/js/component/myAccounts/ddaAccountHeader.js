define(function() {

    var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		requestAccountHeaderDetails: function(inputData, detailsData) {
			this.accountBalance = detailsData.presentBalance;
			this.accountAvailableBalance = detailsData.available;
			this.interestYearTillDate = detailsData.ytdInterest;
			this.interestRate = detailsData.interestRate;
			this.accountName = inputData.accountName;
			this.accountMaskNumber = inputData.accountMask;
			this.numberOfWithdrawalsThisPeriod = detailsData.numberOfWithdrawals;

            //do not show interest rate & interest in CCYY for non-interest bearing accounts
            if (inputData.isNonInterestTypeAccount) {
                this.output.emit('state', {
                    target: this,
                    value: 'doNotShowInterest'
                });
            }
            //do not show number of withdrawals for checking account
            if (detailsData.detailType === 'CHK') {
                this.output.emit('state', {
                    target: this,
                    value: 'doNotShowWithdrawals'
                });
                //for debit card coverage section
                this.output.emit('state', {
                    target: this,
                    value: 'showDebitCardCoverage'
                });
            }
        },
        requestAccountSummary: function() {},
        setupOverdraftProtectionPreferences: function() {},
        setupDebitCardCoveragePreferences: function() {},
        setupPaperlessStatementsPreferences: function() {},
        requestOverdraftProtectionDetails: function() {},
        requestDebitCardCoverageDetails: function() {},
        requestPaperlessStatementsDetails: function() {}
    };
});
