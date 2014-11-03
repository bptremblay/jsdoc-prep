define(function() {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountHeaderDetails: function(inputData, detailsData) {
            this.accountBalance = detailsData.available;
            this.accountAvailableBalance = detailsData.available;
            this.lastStatementDate = detailsData.lastStmtDate;
            this.lastDepositDate = detailsData.lastDepositDate;
            this.accountName = inputData.accountName;
            this.accountMaskNumber = inputData.accountMask;
            this.cardAccountType = null;
        },
        requestAccountStatements: function() {},
        updateStatementSettings: function() {},
        updateAlertsSettings: function() {},
        updateInternationalTravelSettings: function() {},
        setupDirectDeposit: function() {},
        requestTaxForms: function() {},
        requestBankingForms: function() {}
    };
});
