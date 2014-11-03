define(function(require) {
    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAutomaticPaymentsDetails: function() {},
        requestPaperlessStatementsDetails: function() {},
        enrollForAutomaticPayments: function() {},
        enrollForPaperlessStatements: function() {},
        requestAccountHeaderDetails: function(inputData, detailsData) {
            this.model.lens('accountDisplayName').set(detailsData && detailsData.nickname);
            this.model.lens('accountMaskNumber').set(detailsData && detailsData.mask);
            this.model.lens('principalBalance').set(detailsData && detailsData.detail && detailsData.detail.balance);
            this.model.lens('paymentDueOn').set(detailsData && detailsData.detail && detailsData.detail.nextPaymentDate);
            this.model.lens('nextPaymentDue').set(detailsData && detailsData.detail && detailsData.detail.nextPaymentAmount);
            this.model.lens('mortgageCashBack').set(detailsData && detailsData.rewardInfo && detailsData.rewardInfo.earnings);
            this.model.lens('automaticPayments').set(detailsData && detailsData.detail && detailsData.detail.autoPayIndicator);
            this.model.lens('paperlessStatements').set(detailsData && detailsData.detail && detailsData.detail.paperlessIndicator);
            //do not show interest rate & interest in CCYY for non-interest bearing accounts
            var showCashBack = false;
            if (context.dataTransform.isDefined(detailsData && detailsData.rewardInfo)) {
                if (detailsData && detailsData.rewardInfo.status === 'ENROLLED') {
                    showCashBack = true;
                }
            }
            if (showCashBack === false) {
                this.output.emit('state', {
                    target: this,
                    value: 'cashBackHide'
                });
            }

            if (context.dataTransform.isDefined(detailsData && detailsData.detail)) {
                switch (detailsData && detailsData.detail.autoPayIndicator) {
                    case 'On':
                        this.output.emit('state', {
                            target: this,
                            value: 'autoViewPayment'
                        });
                        break;
                    default:
                        break;
                }
            }

            if (context.dataTransform.isDefined(detailsData && detailsData.detail)) {
                switch (detailsData && detailsData.detail.paperlessIndicator) {
                    case 'On':
                        this.output.emit('state', {
                            target: this,
                            value: 'paperlessView'
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    };
});
