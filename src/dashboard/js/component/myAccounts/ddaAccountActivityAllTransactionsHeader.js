define(function(require) {
	var context = null;
	return {
		init: function() {
			context = this.settings.context;
		},
		filterBy: function() {
			var filterByData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				detailType: this.model.lens('detailType').get(),
				showCheckFilter: this.model.lens('showCheckFilter').get()
			};
			context.filterByActivity(filterByData);
        },
		findACheck: function() {
		},
		printAccountActivity: function() {
		},
		clearFilter: function() {
			var filterData = {
				'accountId': this.model.lens('accountId').get(),
				'accountType': this.model.lens('accountType').get(),
				'detailType': this.model.lens('detailType').get(),
				'isFilterBy': false
			};
			context.setAccountActivity(filterData);
		},
		exportAccountActivity: function() {
		},
		editFilterBy: function() {
			var filterByData = {
				accountId: this.model.lens('accountId').get(),
				accountType: this.model.lens('accountType').get(),
				detailType: this.model.lens('detailType').get(),
				showCheckFilter: this.model.lens('showCheckFilter').get(),
				previousFilter: this.model.lens('requestParams').get()
				};
			context.filterByActivity(filterByData);
		}
	};
});
