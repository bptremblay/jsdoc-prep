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
                this.paymentDueDate = detailsData.paymentDueDate;
                this.lastStmtBalance = detailsData.lastStmtBalance;
                this.cashApr = detailsData.cashAPR;
                this.availableCredit = detailsData.current;
                this.purchaseApr = detailsData.purchaseAPR;
                this.creditLimit = detailsData.creditLimit;
                this.accountName = inputData.accountName;
                this.accountMask = inputData.accountMask;
            }.bind(this));
        }
    };
});