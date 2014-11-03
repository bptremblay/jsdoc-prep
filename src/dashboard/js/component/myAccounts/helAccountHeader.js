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
            this.model.lens('accountId').set(detailsData.accountId);
            this.accountName = detailsData.nickname;
            this.accountMaskNumber = detailsData.mask;
            this.accountCurrentBalance = detailsData.detail.currentBalance;
            this.accountPrincipalBalance = detailsData.detail.principalBalance;
            this.lastPaymentAmount = detailsData.detail.lastPaymentAmount;
            this.lastPaymentDate = detailsData.detail.lastPaymentDate;
            this.nextPaymentDueDate = detailsData.detail.nextPaymentDate;
            this.nextPaymentDueAmount = detailsData.detail.nextPaymentAmount;
            this.accountAvailableCreditBalance = detailsData.detail.availableCredit;
            this.feesAndCharges = "";
            this.accruedInterest = "";

            dynamicContentUtil.dynamicContent.set(this, 'next_payment_due_date_label', {
                dueDate: detailsData.detail.nextPaymentDate
            });

        },
        requestAccountCurrentBalanceHelpMessage: function() {
            var inputData = this.model.get();
            context.expandedServices.expanded['accounts.loan.expanded.svc']({
                'accountId': inputData.accountId,
            }).then(function(data) {
                detailData = context.dataTransform.helocDetailData(data);
                this.feesAndCharges = detailData.detail.paydownFees;
                this.accruedInterest = detailData.detail.interestBalanceTotal;

                detailType = data.detail.detailType;

            }.bind(this));
        },
        exitAccountCurrentBalanceHelpMessage: function() {}
    };
});