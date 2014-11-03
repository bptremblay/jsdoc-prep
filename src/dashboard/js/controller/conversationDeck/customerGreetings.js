/**
 * @This is a conversationDeck greeting message contorller
 **/
define(function(require) {

    return function CustomerGreetingsController() {

        var observable = require('blue/observable'),
        	controllerChannel = require('blue/event/channel/controller'),
        	properCase = require('blue/string/properCase'),
        	dynamicContentUtil = require('common/utility/dynamicContentUtil'),
            greetingSpec = require('bluespec/customer_greetings'),
            greetingMethods = require('dashboard/component/conversationDeck/customerGreetings'),
            convoDeckSessionStore = new (require('blue/store/enumerable/session'))('convoDeck'),
            convoDeckSearchMaximized = false;

        this.init = function() {
            controllerChannel.on({
				convoDeckSearchResultsClosed: this.receiveConvoDeckSearchResults.bind(this, false)
            });
            controllerChannel.on({
                convoDeckSearchResultsRequested: this.receiveConvoDeckSearchResults.bind(this, true)
            });
            controllerChannel.on({
                dashboardHeaderLoaded: this.index.bind(this)
            });


            this.model = observable.Model({});

        };
        this.setDefault = function() {
            convoDeckSearchMaximized = false;
        };

        /**
         * Default action binds model,view component for greeting message display
         */
        this.index = function() {
            //Register Component
            this.register.components(this, [{
               name: 'greetingComponent',
               model: this.model,
               spec: greetingSpec,
               methods: greetingMethods
            }]);

            this.setDefault();
            var date =  new Date();
            var hour = date.getHours();
        	var inputData = {
                    'clientTime': hour
                };

            this.greetingServices.greeting['conversationdeck.dashboard.greeting.svc'](inputData).then(function(greetingResponseData) {

                var customerName = properCase(greetingResponseData.greetingName),
                	greetingToken = 'customer_greeting.' + greetingResponseData.greetingId,
                	localizedGreeting,
                    customerfullName = properCase(greetingResponseData.fullName);

	            //Grab the localized greeting based on given data.
                if(customerName && greetingResponseData.greetingId){
	                localizedGreeting = dynamicContentUtil.dynamicContent.get(this.components.greetingComponent, greetingToken, {
	            		customerName: customerName
	            	});
                } else if (greetingResponseData.greetingId) {
                	greetingToken = greetingToken + '_no_name';
            	    localizedGreeting = dynamicContentUtil.dynamicSettings.get(this.components.greetingComponent, greetingToken);
                } else if (greetingResponseData.greetingName) {
                	greetingToken = 'customer_greeting.hello';
            	    localizedGreeting = dynamicContentUtil.dynamicContent.get(this.components.greetingComponent, greetingToken, {
            			customerName: customerName
            		});
                } else {
                	greetingToken = 'customer_greeting.error_default';
                	localizedGreeting = dynamicContentUtil.dynamicSettings.get(this.components.greetingComponent, greetingToken);
                }

	            //Set the localized greeting in the model.
                this.model.lens('customer_greeting').set(localizedGreeting);

                //Render the greeting component in the UI.
                this.executeCAV([this.components.greetingComponent, 'conversationDeck/customerGreetings', {'target': '#customer-greeting',react:true}]);

                //my info menu is updated with the customer full name.
                controllerChannel.emit('convoDeckGreetingResponseReceived', {
					fullName: customerfullName || customerName
                });
                //If the search was maximized, set the greeting to a minimized state.
                if (convoDeckSearchMaximized) {
                	this.components.greetingComponent.toggleGreetingState(true);
                }

                //Store the name of the customer in the session for later use.
                convoDeckSessionStore.set('customerName', customerName);

            }.bind(this),
            // Handle all HTTP errors resolved from the promise, this function is passed an the error object
            function() {

            	// Set the default error greeting in the model.
            	var errorToken = 'customer_greeting.error_default';
            	var errorDefaultGreeting = dynamicContentUtil.dynamicSettings.get(this.components.greetingComponent, errorToken);
                this.model.lens('customer_greeting').set(errorDefaultGreeting);

                //Render the greeting component in the UI.
                this.executeCAV([this.components.greetingComponent, 'conversationDeck/customerGreetings', {'target': '#customer-greeting',react:true}]);

                //If the search was maximized, set the greeting to a minimized state.
                if (convoDeckSearchMaximized) {
                	this.components.greetingComponent.toggleGreetingState(true);
                }
            }.bind(this));
         };

		/**
		 * Handler for the event that the Conversation Deck search results are requested or closed.
         * @function
		 * @param {boolean} maximized true if the search is maximized, false if it is minimized
		 */
		this.receiveConvoDeckSearchResults = function(maximized) {
			// Store the state the Conversation Deck search.
			convoDeckSearchMaximized = maximized;
		};

    };

});
