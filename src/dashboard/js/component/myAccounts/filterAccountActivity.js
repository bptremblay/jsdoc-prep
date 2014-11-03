define(function(require) {
	var context = null;
	return {
		init: function() {
			context = this.settings.context;

		},
		applyFilter: function() {
			var filterData = {};

			filterData.accountId = this.model.get().accountId;
			filterData.accountType = this.model.get().accountType;
			filterData.showCheckFilter = this.model.get().showCheckFilter;
			filterData.detailType = this.model.get().detailType;
			filterData.transactionType = this.transactionType ? this.transactionType : 'ALL';
			filterData.dateLo = this.transactionPostedFromDate;
			filterData.dateHi= this.transactionPostedToDate;
			filterData.dateOption = this.transactionPostedTimeframe;
			filterData.amountLo = this.transactionFromAmount;
			filterData.amountHi = this.transactionToAmount;
			filterData.checkLo= this.checkNumberFrom;
			filterData.checkHi = this.checkNumberTo;
			filterData.isFilterBy = true;

			context.setAccountActivity(filterData);
		},
		exitFilter: function() {
			this.destroy();
		},
		closeTransactionDateRangeAdvisory: function() {
			this.transactionPostedTimeframe = '';
			this.output.emit('state', {
                target: this,
                value: 'defualtDateRange'
            });
		},
		updateTransactionFilterDateBasedOnSelectedTimeframe: function(event) {
			this.transactionPostedTimeframe = $(event.domEvent.target).val();
			var dateRange;
			if (this.transactionPostedTimeframe) {
				dateRange = context.dataTransform.getDateRangeByOption(this.transactionPostedTimeframe);
				this.transactionPostedFromDate = dateRange.from;
				this.transactionPostedToDate = dateRange.to;
			}
		},
	};
});
