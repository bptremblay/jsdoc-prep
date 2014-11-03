/**
 * This is the component for the Conversation Deck messages footer.
 * @module component/conversationDeck/messagesFooter
 */
define(function(require) {

	var controllerChannel = require('blue/event/channel/controller'),
		isInitialState = true;

    return {

        init: function() {

        	// Register controller channel event handlers.
			controllerChannel.on({
				convoDeckMessagesRemaining: this.receiveConvoDeckMessagesRemaining.bind(this)
            });

            controllerChannel.on({
                convoDeckToggleMessages: this.receiveConvoDeckToggleMessages.bind(this)
            });

        },

        /**
         * Component action for when the user wants to dismiss all Conversation Deck messages.
         * @function
         */
        dismissAllMessages: function() {
			controllerChannel.emit('convoDeckDismissAllMessages');
            this.output.emit('state', {
                value: 'setFocus'
            });
        },

        /**
         * Component action for when the user wants to hide all Conversation Deck messages.
         * @function
         */
        hideAllMessages: function() {
        	controllerChannel.emit('convoDeckHideAllMessages');
            this.output.emit('state', {
                value: 'setFocus'
            });
        },

        /**
         * Component action for when the user wants to see more Conversation Deck messages.
         * @function
         */
        showMoreMessages: function() {
        	// Switch the footer component into its "more" state and emit the event on the controller channel.
        	this.switchToMoreState();
        	controllerChannel.emit('convoDeckShowMoreMessages');
        },

        /**
         * Switches the footer to the "more" state (i.e. when additional
         * messages are added to the message list after the initial set).
         * @function
         */
        switchToMoreState: function() {

        	// Update the variable to indicate the footer is no longer in its initial state.
			isInitialState = false;

			// Emit the state to the associated view.
			this.output.emit('state', {
    			value: 'showMoreMessagesState'
			});

        },

		/**
		 * Handler for the event with the number of messages remaining in the message list (i.e. after a dismissal).
		 * @function
		 * @data {object} The event data
		 */
        receiveConvoDeckMessagesRemaining: function(data) {
        	// If there is only one or no messages left, destroy this component and model as it is no longer needed.
        	if (data.count <= 1) {
				this.destroyComponentAndModel();
        	}
        },

        /**
         * Handler for the event that the message list is being toggled.
         * @function
         * @return {[type]} [description]
         */
        receiveConvoDeckToggleMessages: function() {
        	// If the footer is currently in its initial state when toggling of the message list is requested,
        	// switch the footer to the "more" state since more messages are being added to the UI.
        	if (isInitialState) {
        		this.switchToMoreState();
        	}
        },

		/**
         * Destroys this component and its associated model.
         * @function
         */
        destroyComponentAndModel: function() {
			this.destroy();
			this.model.set(null);
        }

    };

});
