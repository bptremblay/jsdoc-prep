/**
 * This is the view for the Conversation Deck messages header.
 * @module view/conversationDeck/messagesHeader
 */
define(function(require) {

	return function MessagesHeaderView() {

		var controllerChannel = require('blue/event/channel/controller'),
			$convoDeckMessagesContainer;

		// Set view template.
		this.template = require('dashboard/template/conversationDeck/messagesHeader');



		this.init = function() {
			// Set view bridge.
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/messagesHeader'));

			// Bridge channel event handler registration.
			this.bridge.on('state/headerDisplayedState', this.stateHandlerHeaderDisplayed.bind(this));
			this.bridge.on('state/allMessagesDismissedState', this.stateHandlerAllMessagesDismissed.bind(this));
			this.bridge.on('state/headerMaximizedState', this.stateHandlerHeaderMaximized.bind(this));
			this.bridge.on('state/headerMinimizedState', this.stateHandlerHeaderMinimized.bind(this));
			this.bridge.on('state/headerIconErrorState', this.stateHandlerHeaderIconErrorState.bind(this));

			// Controller channel event handler registration.
			controllerChannel.on({
                'convoDeckMessageActionTaken': this.receiveConvoDeckMessageActionTaken.bind(this)
            });
            controllerChannel.on({
                'convoDeckToggleMessagesView': this.receiveConvoDeckToggleMessagesView.bind(this)
            });

		};

		/**
		 * Gets a reference to the Conversation Deck messages container.
         * @function getConvoDeckMessagesContainer
		 * @return {jQuery} The jQuery object for the Conversation Deck messages container
		 */
		this.getConvoDeckMessagesContainer = function() {

			// Get a reference to the message list element if not done so already.
			if (!$convoDeckMessagesContainer) {
				$convoDeckMessagesContainer = $('#convo-deck-messages-container');
			}

			return $convoDeckMessagesContainer;

		};

		/**
		 * Handler for the event that a Conversation Deck message action has been taken.
		 * @function receiveConvoDeckMessageActionTaken
		 */
		this.receiveConvoDeckMessageActionTaken = function() {
			// Hide the Conversation Deck message list.
			this.getConvoDeckMessagesContainer().addClass('dis-none');
		};

		/**
		 * Handler for the event that the Conversation Deck message list should be toggled.
		 * @function receiveConvoDeckToggleMessagesView
		 * @param {object} data The event data
		 */
		this.receiveConvoDeckToggleMessagesView = function(data) {

			// If more messages were added as part of the toggle, ensure that the message
			// list is displayed. Else, toggle the display of the message list.
			if (data.moreMessagesAdded) {
				this.getConvoDeckMessagesContainer().removeClass('dis-none');
			} else {
				this.getConvoDeckMessagesContainer().toggleClass('dis-none');
			}

		};

		/**
		 * Handler for the state that the Conversation Deck messages should be displayed (after the greeting has been shown).
		 * @function stateHandlerHeaderDisplayed
		 */
		this.stateHandlerHeaderDisplayed = function() {
			this.$element.removeClass('dis-none');
			this.getConvoDeckMessagesContainer().removeClass('dis-none');
		};

		/**
		 * Handler for the state that all messages have been dismissed.
		 * @function stateHandlerAllMessagesDismissed
		 */
		this.stateHandlerAllMessagesDismissed = function() {

			// Hide the message count in the header and the message list.
			this.$element.find('#conversation-deck-total-messages').hide();
			this.getConvoDeckMessagesContainer().hide();

			// Remove the actionable styling for the message header.
			this.$element.find('#conversation-deck-messages-header').removeClass('actionable');

		};

		/**
		 * Handler for the state that the header is being minimized (i.e. during search results maximization).
		 * @function stateHandlerHeaderMinimized
		 */
		this.stateHandlerHeaderMinimized = function() {

			// Hide the Conversation Deck message list.
			this.getConvoDeckMessagesContainer().addClass('dis-none');

			// Reduce the width of the header.
			$('#convo-deck-left-col').addClass('col-xs-4');
			$('#convo-deck-left-col').removeClass('col-xs-8');
			$('#convo-deck-right-col').addClass('col-xs-8');
			$('#convo-deck-right-col').removeClass('col-xs-4');

		};

		/**
		 * Handler for the state that the header is being maximized (i.e. during search results minimization).
		 * @function stateHandlerHeaderMaximized
		 */
		this.stateHandlerHeaderMaximized = function() {

			// Expand the width of the header.
			$('#convo-deck-left-col').addClass('col-xs-8');
			$('#convo-deck-left-col').removeClass('col-xs-4');
			$('#convo-deck-right-col').addClass('col-xs-4');
			$('#convo-deck-right-col').removeClass('col-xs-8');

		};

		/**
		 * Handler for the error state to style header
		 * @function stateHandlerHeaderIconErrorState
		 */
		this.stateHandlerHeaderIconErrorState = function() {
			$('#conversation-deck-total-messages').addClass('icon-error-state');
		};

	};

});
