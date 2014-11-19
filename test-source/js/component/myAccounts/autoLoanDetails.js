define(function(require) {

    var context = null,
        controllerChannel = require('blue/event/channel/controller');

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
                this.lastPaymentDate = detailsData.lastPaymentDate;
                this.principalBalance = detailsData.principalBalance;
                this.accountName = inputData.accountName;
                this.accountMask = inputData.accountMask;
            }.bind(this));
        }
    };
});