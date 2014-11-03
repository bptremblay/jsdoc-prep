/**
 * This is the component for the Conversation Deck messages header.
 * @module component/conversationDeck/messagesHeader
 */
define(function(require) {

	var controllerChannel = require('blue/event/channel/controller'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		convoDeckSessionStore = new (require('blue/store/enumerable/session'))('convoDeck'),
		isMinimized = false,
		totalConversationMessages,
        messagesDisplayed;

    return {

        init: function() {

        	// Register controller channel event handlers.
            controllerChannel.on({
            	convoDeckMessagesDisplay: this.receiveConvoDeckMessagesDisplay.bind(this)
            });
            controllerChannel.on({
                convoDeckMessagesRemaining: this.receiveConvoDeckMessagesRemaining.bind(this)
            });
            controllerChannel.on({
                convoDeckSearchResultsClosed: this.toggleHeaderState.bind(this, false)
            });
            controllerChannel.on({
                convoDeckSearchResultsRequested: this.toggleHeaderState.bind(this, true)
            });
            controllerChannel.on({
            	convoDeckMessageErrorToggle: this.toggleConversationMessages.bind(this)
            });

        },

        /**
         * Component action for when the user wants to toggle Conversation Deck messages.
         * @function
         */
        toggleConversationMessages: function() {

        	// If the messages header is currently minimized, toggle the header state to maximize.
        	if (isMinimized) {
        		this.toggleHeaderState(false);
				controllerChannel.emit('convoDeckMessagesFocus');
        	}

			// If there are still messages available, toggle the message list.
        	if (totalConversationMessages || this.model.get().isErrorMessage) {
                //update aria label for display mode messages shown / hidden.
                this.setHeaderDisplayModeAriaLabel(totalConversationMessages);
        		controllerChannel.emit('convoDeckToggleMessages');
        	}

        },

        /**
         * Toggles the header state to be either minimized or maximized (i.e. when search maximizes or minimizes).
         * @function
         * @param {boolean} minimize true if the header should be the minimized state, false if it should be the maximized state
         */
        toggleHeaderState: function(minimize) {
            //when focus is shifted from message list to search minimize the message list should set aria label to  shows content state.
            if (minimize){
                //As toggle state is triggered to hide messages displayed and just show the header in minimum or maximize state.
                messagesDisplayed = true;
                //update aria label for display mode messages shown / hidden.
                this.setHeaderDisplayModeAriaLabel(totalConversationMessages);
            }
			// Update the header text to be the full or shortered version, based on if it is a minimized or maximized state.
			this.updateMessageHeaderText(totalConversationMessages, minimize);

			// Emit the proper state event for if the header is to be minimized or maximized.
			this.output.emit('state', {
				value: minimize ? 'headerMinimizedState' : 'headerMaximizedState'
			});

			isMinimized = minimize;

        },

        /**
         * Updates the messages header text based on the total number of Conversation Deck messages currently available.
         * @function
         * @param {integer} newTotalConversationMessages The total number of Conversation Deck messages currently available
         * @param {boolean} useShortHeaderText true to use the shortened version of the header text, false to use the full text
         */
        updateMessageHeaderText: function(newTotalConversationMessages, useShortHeaderText) {

        	// For multiple messages ...

        	if (newTotalConversationMessages > 1) {

        		if (useShortHeaderText) {
        			dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_multiple_new_messages_short_label', 'conversationMessageHeader', {});
        		} else {
        			dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_multiple_new_messages_label', 'conversationMessageHeader', {});
        		}

                dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_multiple_new_messages_short_label', 'totalConversationMessagesAda', {});
        	}

        	// For a single message ...

        	else if (newTotalConversationMessages) {

        		if (useShortHeaderText) {
					dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_a_new_message_short_label', 'conversationMessageHeader', {});
				} else {
					dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_a_new_message_label', 'conversationMessageHeader', {});
				}

                dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_a_new_message_short_label', 'totalConversationMessagesAda', {});

        	}

        	// For no messages ...

        	else {

        		dynamicContentUtil.dynamicContent.setForBinding(this, 'conversation_messages_header_no_messages_label', 'conversationMessageHeader', {
        			name: convoDeckSessionStore.get('customerName')
        		});

        	}

        	// Store the total number of messages.

			totalConversationMessages = newTotalConversationMessages;

        },

        /**
         * Handler for the event that the Conversation Deck messages should be displayed (after the greeting has been shown).
         * @function
         * @param {object} data The event data
         */
        receiveConvoDeckMessagesDisplay: function(data) {

        	// Emit the event to the view that the messages should be displayed.
			this.output.emit('state', {
    			value: 'headerDisplayedState'
			});

			// If search is currently maximized, toggle the header to a minimized state.
			if (data.searchMaximized) {
				this.toggleHeaderState(true);
			}

        },

		/**
		 * Handler for the event with the number of messages remaining in the message list (i.e. after a dismissal).
		 * @function
		 * @data {object} The event data
		 */
        receiveConvoDeckMessagesRemaining: function(data) {

        	var newTotalConversationMessages = data.count;

        	// Update the message header text if the number of messages dropped down to 1 or 0.

			if (newTotalConversationMessages === 1 || newTotalConversationMessages === 0) {
				this.updateMessageHeaderText(newTotalConversationMessages, false);
			}

			// If there are messages remaining, update the message count in the model.
			// Else, emit the state that there are no more messages and destroy the header
			// after the configured amount of time.

        	if (newTotalConversationMessages > 0) {

				this.model.lens('totalConversationMessages').set(newTotalConversationMessages);

        	} else {

				this.output.emit('state', {
	    			value: 'allMessagesDismissedState'
				});

				setTimeout(this.destroyComponentAndModel.bind(this), this.context.controller.settings.get('convoDeckHeaderNoMessagesTimer'));

        	}

        },

        //update aria label for display mode messages shown / hidden.
        setHeaderDisplayModeAriaLabel: function(messagesCount)
        {
            //when componet is registered first and user has only one message in the list will mean next click minimize the message list.
            if(messagesDisplayed === undefined){
                messagesCount === 1 ? messagesDisplayed = true : messagesDisplayed = false;
            }
            else {
                //we always toggle the mesageDisplayed flag as this method call is done on toggle from seach engine
                //and meassage headerclick
                messagesDisplayed = !messagesDisplayed;
            }

            messagesDisplayed ? dynamicContentUtil.dynamicContent.setForBinding(this, 'hide_conversation_message_ada', 'conversationMessageDisplayAda', {}) :
                                dynamicContentUtil.dynamicContent.setForBinding(this, 'show_conversation_message_ada', 'conversationMessageDisplayAda', {});
        },
		/**
         * Destroys this component and its associated model.
         * @function
         */
        destroyComponentAndModel: function() {
			this.destroy();
			this.model.set(null);
			controllerChannel.emit('convoDeckMessageHeaderRemoved');
        }

    };

});
