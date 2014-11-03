/**
 * This is the component for a Conversation Deck message.
 * @module component/conversationDeck/messages
 */
define(function(require) {

	var controllerChannel = require('blue/event/channel/controller'),
		fireAndForgetRequestUtil = require('common/utility/fireAndForgetRequestUtil');

    return {

        init: function() {

        },

        /**
         * Component action for when the message is being dismissed by the user.
         * @function dismissConversationMessage
         */
        exitConversationMessage: function() {

        	var model = this.model.get(),
        		inputData;

        	// If this is an ad message, call the ad dismissal service.
        	if (model.isAdMessage) {

				inputData = {
					_o: this.context.controller.settings.get('convoDeckAdMessagesOrgId'),
					_t: model.adDismissId,
					ssv_eci: this.context.controller.settings.get('convoDeckAdMessagesEci')
        		};

        		fireAndForgetRequestUtil.get(this.context.controller.adsServices.AD_DISMISS_SERVICE_URL, inputData);
				this.dismissConversationMessageUi();

        	}
        	// Else, call the DPS message dismissal service.
        	else {

 				inputData = {
					messageId: model.messageId
        		};

				this.context.controller.messagesServices.messages['conversationdeck.dashboard.messageUpdate.svc'](inputData).then(function(){
					this.dismissConversationMessageUi();
				}.bind(this),
				// handle HTTP errors; bring up error header and message
				function(){
					controllerChannel.emit('dismissMessageError');
				}.bind(this));

        	}

        },

        /**
         * Component action for when the user clicks on a message action.
         * @function selectConversationMessageAction
         * @param {object} data The framework event object
         */
		selectConversationMessageAction: function(data) {

			var actionEvent = data.context.actionEvent,
				actionUrl = data.context.actionUrl,
				model = this.model.get();
			// If either an action event or action URL is provided ...

			if (actionEvent || actionUrl) {

				// If this is an ad message, call the click-through service to indicate the user acted on the ad
				// and dismiss it from the UI. Else, call the function to dismiss this Conversation Deck message.

				if (model.isAdMessage) {

					fireAndForgetRequestUtil.get(model.clickThroughUrl);
					this.dismissConversationMessageUi();

        		} else {
					this.exitConversationMessage();
        		}

				// Either emit the event or navigate to the URL (assuming both are never provided at the same time).

				if (actionEvent) {
					controllerChannel.emit(actionEvent);
				} else {
					this.context.controller.state(actionUrl);
				}

				// Emit the event that a message action was taken.

				controllerChannel.emit('convoDeckMessageActionTaken');

			}

		},

		/**
		 * Dismisses the message from the Conversation Deck in the UI (i.e. no service calls made).
		 * @function dismissConversationMessageUi
		 */
		dismissConversationMessageUi: function() {

			var model = this.model.get(),
				messageId =  model.messageId;

			// Emit the event on the proper channels for the view and other components to pick it up.

			this.output.emit('state', {
    			value: 'conversationMessageDismissed',
    			messageId: messageId
			});

			controllerChannel.emit('convoDeckMessageDismissed', {
				messageId: messageId,
				adDismissId: model.adDismissId
			});

			// Remove the message model data.

			this.model.set(null);

		},

		/**
		 * Dismisses the error message from the Conversation Deck in the UI and passes isErrorMessage flag
		 * @function exitConversationMessageError
		 */
		exitConversationMessageError: function() {
			this.output.emit('state', {
				value: 'conversationMessageDismissed',
				isErrorMessage: true
			});
			controllerChannel.emit('convoDeckMessageErrorToggle');
		},

		/**
		 * Retry to ping messages services
		 */
		requestConversationMessage: function() {
			controllerChannel.emit('retryConversationMessagesRequest');
		}

    };

});
