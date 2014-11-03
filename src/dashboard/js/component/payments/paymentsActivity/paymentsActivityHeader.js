define(function(require) {
	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		exitPaymentActivity: function() {
            context.state('/dashboard');
		},
		requestAccountActivity: function() {

		}
	};
});
