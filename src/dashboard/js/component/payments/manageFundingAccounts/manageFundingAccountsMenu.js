define(function(require) {
	var context = null,
		controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {

            controllerChannel.on({
                'trigger/selectMenuItem': function(data) {
                	var itemId = data.itemId;
                	this.selectMenuItem( itemId );
                }.bind(this)
            });

		},

		addFundingAccount: function(){

			controllerChannel.emit('trigger', {
                target: this,
                value: 'addFundingAccount'
            });
		},

		updateFundingAccounts: function(){

			controllerChannel.emit('trigger', {
                target: this,
                defaultBehavior:true,
                value: 'updateFundingAccount'
            });
		},

		selectMenuItem: function( itemId ){

			this.output.emit('state', {
            	itemId: itemId,
	            value: 'selectMenuItem'
	        });
		}
	};

});
