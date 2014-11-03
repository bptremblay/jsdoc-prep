define(function(require) {

     /**
     * This is the view for a Conversation Deck greeting message.
     */
    return function customeGreetingsView() {

    	var controllerChannel = require('blue/event/channel/controller'),
    		settings = require('blue/settings');

        //Settign template
        this.template = require('dashboard/template/conversationDeck/customerGreetings');

		this.init = function() {

			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/customerGreetings'));

			// Bridge channel event handler registration.
			this.bridge.on('state/greetingMaximizedState', this.stateHandlerGreetingMaximized.bind(this));
			this.bridge.on('state/greetingMinimizedState', this.stateHandlerGreetingMinimized.bind(this));

			// Controller channel event handler registration.
	        controllerChannel.on({
	            convoDeckMessagesDisplay: this.receieveConvoDeckMessagesDisplay.bind(this)
	        });
	        controllerChannel.on({
	            convoDeckMessageHeaderRemoved: this.receiveConvoDeckMessageHeaderRemoved.bind(this)
	        });

			// Set the timer for hiding the greeting after having displayed it for a fixed period of time.
			this.setGreetingHideTimer();

		};

		/**
		 * Handler for the event that the Conversation Deck messages should be displayed.
		 * @function
		 */
		this.receieveConvoDeckMessagesDisplay = function() {
			// Hide the greeting.
			$('#greeting-area').addClass('dis-none');
		};

		/**
		 * Handler for the event that the Conversation Deck message header has been removed.
		 * @function
		 */
		this.receiveConvoDeckMessageHeaderRemoved = function() {
			// Show the greeting.
			$('#greeting-area').removeClass('dis-none');
		};

		/**
		 * Handler for the state that the header is being minimized (i.e. during search results maximization).
		 * @function
		 */
		this.stateHandlerGreetingMinimized = function() {
			// Reduce the width of the greeting.
			$("#convo-deck-left-col").addClass('col-xs-4');
			$("#convo-deck-left-col").removeClass('col-xs-8');
			$("#convo-deck-right-col").addClass('col-xs-8');
			$("#convo-deck-right-col").removeClass('col-xs-4');
		};

		/**
		 * Handler for the state that the header is being maximized (i.e. during search results minimization).
		 * @function
		 */
		this.stateHandlerGreetingMaximized = function() {
			// Expand the width of the greeting.
			$("#convo-deck-left-col").addClass('col-xs-8');
			$("#convo-deck-left-col").removeClass('col-xs-4');
			$("#convo-deck-right-col").addClass('col-xs-4');
			$("#convo-deck-right-col").removeClass('col-xs-8');
		};

		/**
		 * Set a timer for when the greeting should be hidden.
		 * @function
		 */
		this.setGreetingHideTimer = function() {
			setTimeout(function() {
				controllerChannel.emit('convoDeckGreetingHideReady');
			}, settings.get('convoDeckGreetingDisplayTimer'));
		};

	};
});
