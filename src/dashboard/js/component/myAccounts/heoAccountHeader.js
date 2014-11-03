define(function(require) {

    var context = null,
        dynamicContentUtil = require('common/utility/dynamicContentUtil');

    return {
        init: function() {
            context = this.settings.context;
        },

        requestAccountHeaderDetails: function(inputData, detailsData) {
            var accountType;
            //svcType;
            accountType = inputData.accountType;
            //svcType = context.statusCodeMapper.getAccountsMessage('ACCOUNT_TYPE_MAPPER')[accountType];
            //context.detailsServices.details['accounts.loan.detail.svc']({
            //          'accountId': inputData.accountId
            //}).then(function(data) {
            this.accountName = detailsData.nickname;
            this.accountMaskNumber = detailsData.mask;
            this.accountPrincipalBalance = detailsData.detail.principalBalance;
            this.nextPaymentDueDate = detailsData.detail.nextPaymentDate;
            this.nextPaymentDueAmount = detailsData.detail.nextPaymentAmount
            dynamicContentUtil.dynamicContent.set(this, 'account_principal_balance_label', {
                prinBal: detailsData.detail.principalBalance
            });
            dynamicContentUtil.dynamicContent.set(this, 'next_payment_due_date_label', {
                dueDate: detailsData.detail.nextPaymentDate
            });

        }



        //}
    };
});
