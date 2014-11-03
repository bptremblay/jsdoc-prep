define(function(require) {
	var context = null

	return {
		init: function() {
			context = this.settings.context;
		},
		requestAccountStatements: function() {

		},
		requestAccountDetails: function() {
			context.appChannel.emit('getExpandedCard', this.model.get());
		},
		requestThingsYouCanDo: function() {
		},
		exitThingsYouCanDo: function() {
		}
	};
});
