/**
 * This is the view for the Conversation Deck messages footer.
 * @module view/conversationDeck/messagesFooter
 */
define(function(require) {

	return function MessagesFooterView() {

		// Set view template.
		this.template = require('dashboard/template/conversationDeck/messagesFooter');

		this.init = function() {
			// Set view bridge.
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/messagesFooter'));
			this.bridge.on('state/showMoreMessagesState', this.stateHandlerShowMoreMessages.bind(this));
			this.bridge.on('state/setFocus', this.setFocus.bind(this));
		};

		/**
		 * Handler for when the footer changes to the "more" state.
		 * @function
		 */
		this.stateHandlerShowMoreMessages = function() {
			// Hide the initial footer links and display the additional footer links instead.
			this.$element.find('#conversation-deck-footer-initial').addClass('dis-none');
			this.$element.find('#conversation-deck-footer-more').removeClass('dis-none');
		};

		this.setFocus = function() {
			$('#convo-deck-messages-header').focus();
		};


	};

});
