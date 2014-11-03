define(function(require) {

	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		requestAccountActivity: function(inputData) {
			this.transactions = inputData.data.list;
		}
	};
});
