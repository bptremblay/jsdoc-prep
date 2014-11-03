define(function (require) {
	var componentChannel = require('blue/event/channel/component'),
		context = null;

	return {
		init: function() {
			context = this.settings.context;
		},
		trigger: function() {
			componentChannel.emit(this.model.get().eventToEmit, {});
		}
	}
});