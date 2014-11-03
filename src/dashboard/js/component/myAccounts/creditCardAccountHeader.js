define(function() {

    var context = null;

    return {
        init: function() {
            context = this.settings.context;
        },
        requestAccountHeaderDetails: function(inputData, detailsData) {
            this.accountName = inputData.accountName;
            this.accountMaskNumber = inputData.accountMask;
            this.accountCurrentBalance = detailsData.currentBalance;
            this.paymentDueDate = detailsData.nextPaymentDate;
            this.minimumAmountDue = detailsData.nextPaymentAmount;
            this.blueprintAmountDue = detailsData.blueprintNextPaymentAmount;
            this.accountAvailableCreditBalance = detailsData.availableCredit;
            this.model.lens('showBluePrint').set(detailsData.showBluePrint);
            this.model.lens('payment_due_date_label').set(inputData.paymentDueDateLabel);
        },
        requestCurrentStatements: function() {},
        requestCardPayment: function() {},
        setupPaperlessStatements: function() {},
        requestDetailsOfAutomaticPayments: function() {}
    };
});
