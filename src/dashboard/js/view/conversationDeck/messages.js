/**
 * This is the view for a Conversation Deck message.
 * @module view/conversationDeck/messages
 */
define(function(require) {

	return function MessagesView() {

		// Set view template and bridge
		this.template = require('dashboard/template/conversationDeck/messages');


		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/messages'));
			this.bridge.on('state/conversationMessageDismissed', this.stateHandlerDismissConversationMessage.bind(this));
		};

		/**
		 * State handler for when this message has been dismissed.
		 * @function stateHandlerDismissConversationMessage
		 * @param {object} data The state data
		 * @description Handles error by checking if data contains `isErrorMessage`
		 */
		this.stateHandlerDismissConversationMessage = function(data) {
			var focusElement, currentElement;

			if(data.isErrorMessage){
				focusElement = $('#convo-deck-messages-header');
				focusElement.focus();
			} else {
				// Remove the dismissed message from the UI.
				currentElement = $('#conversation-deck-message-' + data.messageId);
				if (currentElement.is(':last-child')) {
					focusElement = currentElement.prev();
					if(!focusElement.length){
					focusElement = $('#convo-deck-messages-header');
					}
				}
				else {
					focusElement = currentElement.next();
				}
				currentElement.remove();
				focusElement.attr('tabindex', -1).focus();
			}

		};

	};

});
