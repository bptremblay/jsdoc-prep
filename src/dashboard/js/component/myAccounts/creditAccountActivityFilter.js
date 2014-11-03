define(function(require) {
	var context = null;
	return {
		init: function() {
			context = this.settings.context;
		},
		applyFilter: function(inputData) {
			var filterData = {};

			filterData.accountId = this.model.get().accountId;
			filterData.accountType = this.model.get().accountType;
			filterData.detailType = this.model.get().detailType;
			filterData.statementTimePeriod = this.transactionPostedTimeframe;
			filterData.transactionType = this.transactionType;
			filterData.dateLo = this.transactionPostedFromDate;
			filterData.dateHi= this.transactionPostedToDate;
			filterData.merchantName = this.merchantName;
			filterData.amountLo = this.transactionFromAmount;
			filterData.amountHi = this.transactionToAmount;
			filterData.isFilterBy = true;

			context.setCardAccountActivity(filterData);
		},
		exitFilter: function() {
			this.destroy();
		},
		closeTransactionDateRangeAdvisory: function() {
		},
		updateTransactionFilterDateBasedOnSelectedTimeframe: function(event) {
			selectedTimePeriod = $(event.domEvent.target).val();
			this.transactionPostedFromDate = '';
			this.transactionPostedToDate = '';
			this.output.emit('state', {
                target: this,
                value: 'enableDateRange',
                selectedTimePeriod: selectedTimePeriod
            });
		}
	};
});
