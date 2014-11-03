define(function() {
	var context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		updateContent: function(data) {
			context.model.lens('headerComponent.properties').set(data);
			return {};
		}
	};
});
