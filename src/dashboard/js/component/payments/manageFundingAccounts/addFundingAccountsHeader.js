define(function(require) {
	var context = null,
		controllerChannel = require('blue/event/channel/controller');

	return {
		init: function() {
			context = this.settings.context;

            controllerChannel.on({

                'trigger/showFundingAccountMessage': function( data ) {
                	this.showFundingAccountMessage( data );
                }.bind(this)
            });

		},

		requestFundingAccounts: function(payeeId) {
			this.model.lens('currentPayeeId').set( payeeId );
		},

		exitManageFundingAccounts: function() {
			context.state('/dashboard');
		},
		requestAccountDisplayName: function() {

		},
		showFundingAccountMessage: function( data ){

			var message = data.message,
			elementId = '',
			action = data.action;

 			//2 way binding not working!!!

			switch( action ){

				case 'UPDATE':
					this.model.lens('update_funding_account_message').set( message );
					message = '<div style="color:#bf2155;font-weight:bold;">'+ message + '</div>';
					elementId = 'update_funding_account_message';
					break;
			}

			this.output.emit('state', {
				message: message,
				elementId: elementId,
	            value: 'showFundingAccountMessage'
	        });

		}
	};

});
