define(function(require) {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },

        displayDetails: function(inputData) {
            var detailsData = {},
                accountType,
                svcType;
            accountType = inputData.accountType;
            svcType = context.statusCodeMapper.getAccountsMessage('ACCOUNT_TYPE_MAPPER')[accountType];
            context.detailsServices.details[svcType.detailSvc]({
                'accountId': inputData.accountId
            }).then(function(data) {
                detailsData = context.dataTransform.accountDetails(data.detail, accountType);
                this.lastPaymentAmount = detailsData.lastPaymentAmount;
                this.nextPaymentDate = detailsData.nextPaymentDate;
                this.nextPaymentAmount = detailsData.nextPaymentAmount;
                this.lastPaymentDate = detailsData.lastPaymentDate;
                this.accountName = inputData.accountName;
                this.accountMask = inputData.accountMask;
                this.accountId = inputData.accountId;
            }.bind(this));
        },

        showPayoff: function() {
            console.log(this)
            context.state(context.settings.get('classicMortgageUrl') + this.accountId);
        }
    };
});