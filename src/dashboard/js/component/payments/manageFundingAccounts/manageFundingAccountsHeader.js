define(function(require) {
	var context = null,
	 	dynamicContentUtil = require('common/utility/dynamicContentUtil'),
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

			controllerChannel.emit('trigger', {
                target: this,
                value: 'updateFundingAccount',
                payeeId: payeeId
            });

			//alert('Request accounts here: ' + payeeId);
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

				case 'ADD':
					dynamicContentUtil.dynamicContent.set(this, 'add_funding_account_message', message);
					message = '<i class=\"fa fa-check-circle-o fa-2x\"></i>' + this.model.lens('add_funding_account_message').get();
					elementId = 'add_funding_account_message';
					break;

				case 'UPDATE':
					this.model.lens('update_funding_account_message').set( message );
					message = '<div style="color:#bf2155;font-weight:bold;">'+ message + '</div>';
					elementId = 'update_funding_account_message';
					break;

				case 'DELETE':
					dynamicContentUtil.dynamicContent.set(this, 'delete_funding_account_message', {
					     NICKNAME: message
					});
					message = this.model.lens('delete_funding_account_message').get();
					elementId = 'delete_funding_account_message';
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
