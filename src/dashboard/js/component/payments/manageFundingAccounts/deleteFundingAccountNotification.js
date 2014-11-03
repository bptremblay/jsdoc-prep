define(function(require) {
	var context = null,
		controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
			context = this.settings.context;
		},

		closeDeleteFundingAccountNotification: function() {
			console.log("!!!---closeDeleteFundingAccountNotification");
            this.output.emit('state', {
                target: this,
                value: 'hideDeleteFundingAccountNotification'
            });
		},

		showDeleteFundingAccountNotification: function() {
			console.log("!!!---showDeleteFundingAccountNotification");
            this.output.emit('state', {
                target: this,
                value: 'showDeleteFundingAccountNotification'
            });
		}

	};

});
