define(function(require) {

	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		findACharge: function() {
		},
		filterBy: function() {
			var filterByData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				detailType: this.model.lens('detailType').get(),
				timePeriodOptions: this.model.lens('timePeriodOptions').get(),
				tranTypeOptions: this.model.lens('tranTypeOptions').get()
			};
			context.creditFilterByActivity(filterByData);
		},
		printAccountActivity: function() {
		},
		exportAccountActivity: function() {
		},
		clearFilter: function() {
			var filterData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				detailType: this.model.lens('detailType').get(),
				isFilterBy: false
			};
			context.setCardAccountActivity(filterData);
		},
		editFilterBy: function() {
			var filterByData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				detailType: this.model.lens('detailType').get(),
				timePeriodOptions: this.model.lens('timePeriodOptions').get(),
				tranTypeOptions: this.model.lens('tranTypeOptions').get(),
				previousFilter: this.model.lens('requestParams').get()
			};
			context.creditFilterByActivity(filterByData);
		}
	};
});
