/**
 * This is the component for the Conversation Deck customer greeting.
 * @module component/conversationDeck/customerGreetings
 */
define(function(require) {

    var controllerChannel = require('blue/event/channel/controller');

    return {

        init: function() {

			
        	// Register controller channel event handlers.
            controllerChannel.on({
				convoDeckSearchResultsClosed: this.toggleGreetingState.bind(this, false)
            });
             controllerChannel.on({
                convoDeckSearchResultsRequested: this.toggleGreetingState.bind(this, true)
            });
              controllerChannel.on({
                convoDeckMessagesFocus: this.toggleGreetingState.bind(this, false)
            });

        },

		/**
         * Toggles the greeting state to be either minimized or maximized (i.e. when search maximizes or minimizes).
         * @function
         * @param {boolean} minimize true if the greeting should be the minimized state, false if it should be the maximized state
         */
        toggleGreetingState: function(minimize) {

			// Emit the proper state event for if the greeting is to be minimized or maximized.
			this.output.emit('state', {
				value: minimize ? 'greetingMinimizedState' : 'greetingMaximizedState'
			});

        }

    };
});
