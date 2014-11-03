/**
 * The messages controller manages the messages header and list of messages for the Conversation Deck.
 * @module controller/conversationDeck/messages
 */
define(function(require) {

	return function MessagesController() {

		var when = require('when/when'),
			observable = require('blue/observable'),
			controllerChannel = require('blue/event/channel/controller'),
			dynamicAjaxCallUtil = require('common/utility/dynamicAjaxCallUtil'),
			dynamicContentUtil = require('common/utility/dynamicContentUtil'),
			fireAndForgetRequestUtil = require('common/utility/fireAndForgetRequestUtil'),
			messagesSpec = require('bluespec/customer_conversation_messages'),
			messagesMethod = require('dashboard/component/conversationDeck/messages'),
			messagesHeaderSpec = require('bluespec/customer_conversation_messages_header'),
			messagesHeaderMethod = require('dashboard/component/conversationDeck/messagesHeader'),
			messagesFooterSpec = require('bluespec/customer_conversation_messages_footer'),
			messagesFooterMethod = require('dashboard/component/conversationDeck/messagesFooter'),
			convoDeckMessagesDisplayReady = false, // Flag to indicate when all Conversation Deck messages have been retrieved and are ready for display
			convoDeckGreetingHideReady = false, // Flag to indicate if the initial Conversation Deck greeting has displayed for enough time and is ready for hiding
			convoDeckMessagesUiCount = 0, // Count of the number of Conversation Deck messages that have been rendered to the UI
			convoDeckMessagesUiIds = {}, // For each Conversation Deck message rendered to the UI, its message ID will be a property name in this object
			convoDeckAdMessageRemainingDismissIds = {}, // For each ad message retrieved for the Conversation Deck that has not yet been dismissed, its dismiss ID will be a property name in this object (regardless of the message being displayed yet in the UI)
			convoDeckMessagesRemainingDisplayList = [], // The message response data for all the Conversation Deck messages retrieved but have not yet been rendered to the UI
			convoDeckSearchMaximized = false, // Flag to indicate whether or not search is currently maximized
			convoDeckMessagesResponseData, // The service response retrieved from the DPS message list
			adMessageResponseDataList; // The list of service responses retrieved for each individual ad message

		this.init = function() {

			controllerChannel.on({
				convoDeckGreetingHideReady: this.receiveConvoDeckGreetingHideReady.bind(this),
				convoDeckDismissAllMessages: this.receiveConvoDeckDismissAllMessages.bind(this),
				convoDeckMessageDismissed: this.receiveConvoDeckMessageDismissed.bind(this),
				convoDeckShowMoreMessages: this.receiveConvoDeckToggleMessages.bind(this),
				convoDeckHideAllMessages: this.receiveConvoDeckToggleMessages.bind(this),
				convoDeckToggleMessages: this.receiveConvoDeckToggleMessages.bind(this),
				convoDeckSearchResultsClosed: this.receiveConvoDeckSearchResults.bind(this, false),
				convoDeckSearchResultsRequested: this.receiveConvoDeckSearchResults.bind(this, true),
				dashboardHeaderLoaded: this.index.bind(this),
				retryConversationMessagesRequest: this.receiveRetryConversationMessagesRequest.bind(this),
				dismissMessageError: this.registerConvoDeckMessagesError.bind(this)
			});
		};

		/**
		 * Resets the private state variables to their defaults.
		 */
		this.setDefault = function() {
			convoDeckMessagesDisplayReady = false;
			convoDeckGreetingHideReady = false;
			convoDeckMessagesUiCount = 0;
			convoDeckMessagesUiIds = {};
			convoDeckAdMessageRemainingDismissIds = {};
			convoDeckMessagesRemainingDisplayList = [];
			convoDeckSearchMaximized = false;
			convoDeckMessagesResponseData = undefined;
			adMessageResponseDataList = undefined;
		};

		/**
		 * Default action to initialize the Conversation Deck's message list.
		 * @function index
		 */
		this.index = function() {

			// Reset the private state variables to their defaults (in the event where index is being called multiple times).
			this.setDefault();

			// Get Conversation Deck and ad messages.
			this.retrieveConvoDeckMessages();
			this.retrieveAdMessages();

		};

		/**
		 * Calls the service to get the list of Conversation Deck messages.
		 * @function retrieveConvoDeckMessages
		 */
		this.retrieveConvoDeckMessages = function() {

			// Retrieve the list of Conversation Deck messages from the service.

			this.messagesServices.messages['conversationdeck.dashboard.messages.svc']().then(function(svcConvoDeckMessagesResponseData) {

				// Save the Conversation Deck message response data and register both Conversation Deck and ad messages if both are ready.

				convoDeckMessagesResponseData = svcConvoDeckMessagesResponseData;
				this.registerConvoDeckMessagesIfReady(convoDeckMessagesResponseData, adMessageResponseDataList);

			}.bind(this),
			// Handle all HTTP errors
			function() {
				this.registerConvoDeckMessagesError();
			}.bind(this));
		};

		/**
		 * Calls the services to get the list of ad messages.
		 * @function retrieveAdMessages
		 */
		this.retrieveAdMessages = function() {

			// If ads are not enabled, just register the Conversation Deck messages now if ready and return.

			if (!this.settings.get('convoDeckAdMessagesEnabled')) {
				adMessageResponseDataList = [];
				this.registerConvoDeckMessagesIfReady(convoDeckMessagesResponseData, adMessageResponseDataList);
				return;
			}

			var adMessageServiceUrls,
				adMessageServiceCalls,
				adDecisionInputData = {
					_o: this.settings.get('convoDeckAdMessagesOrgId'),
					_t: this.settings.get('convoDeckAdMessagesTypeName'),
					ssv_eci: this.settings.get('convoDeckAdMessagesEci')
				};

			// Make the initial call to the ad decision service to get URLs for the list of ad message services to call for actual message content.

			this.adsServices['conversationdeck.ads.decision.svc'](adDecisionInputData).then(

				// Success function.

				function(decisionResponseData) {

					// Create a list of all the message service URLs that need to be called to retrieve their content.

					adMessageServiceCalls = [];

					adMessageServiceUrls = [
						decisionResponseData.CDMessageList1.cid,
						decisionResponseData.CDMessageList2.cid,
						decisionResponseData.CDMessageList3.cid
					];

					// For each ad message service URL ...

					adMessageServiceUrls.forEach(function(adMessageServiceUrl) {

						// If there is a service URL, add a service call object for that message to the
						// service list. Else, add a null object to the service list for that message.

						if (adMessageServiceUrl) {

							adMessageServiceCalls.push(dynamicAjaxCallUtil({
								type: 'GET',
								url: adMessageServiceUrl
							}));

						} else {

							adMessageServiceCalls.push(null);

						}

					}, this);

					// When all message content services have completed (some may be empty) ...

					when.all(adMessageServiceCalls).done(

						// Success function.
						function(svcAdMessageResponseDataList) {

							adMessageResponseDataList = svcAdMessageResponseDataList;

							// For each ad message response data ...

							adMessageResponseDataList.forEach(function(adMessageResponseData, index) {

								// If there is actually an ad response data ...

								if (adMessageResponseData) {

									// Add additional property values.

									adMessageResponseData.messageId = 'ad-' + index;
									adMessageResponseData.isAdMessage = true;
									adMessageResponseData.clickThroughUrl = decisionResponseData['CDMessageList' + (index + 1)].turl;

									// Store the dismiss message ID.

									convoDeckAdMessageRemainingDismissIds[adMessageResponseData.dismissId] = true;

								}

							}, this);

		 					// Register the Conversation Deck and ad messages if both are ready.

							this.registerConvoDeckMessagesIfReady(convoDeckMessagesResponseData, adMessageResponseDataList);

						}.bind(this),

						// Exception function.

						this.registerConvoDeckMessagesWithoutAds.bind(this)

					);

				}.bind(this),

				// Exception function.

				this.registerConvoDeckMessagesWithoutAds.bind(this)

			);

			// TODO: Re-visit error handling.

		};

		/**
		 * Registers all the Conversation Deck messages and ad messages components, and then displays them if both are available.
		 * @function registerConvoDeckMessagesIfReady
		 * @param {object} convoDeckMessagesResponseData The response from the Conversation Deck message list service
		 * @param {Array} adMessageResponseDataList The list of responses from the ad message services
		 */
		this.registerConvoDeckMessagesIfReady = function(convoDeckMessagesResponseData, adMessageResponseDataList) {

			// If both the Conversation Deck messages and ad messages are available ...
			if (convoDeckMessagesResponseData && adMessageResponseDataList) {

				var allMessagesList = this.mergeConvoDeckAndAdMessagesResponses(convoDeckMessagesResponseData, adMessageResponseDataList),
					totalConversationMessages = allMessagesList.length,
					initMessagesDisplayCount;

				// Remove the saved response data, as they are not needed anymore.
				convoDeckMessagesResponseData = null;
				adMessageResponseDataList = null;

				// If there are messages ...
				if (totalConversationMessages) {

					initMessagesDisplayCount = this.settings.get('convoDeckInitMessagesDisplayCount');

					// Initialize an empty observable model for this controller.
					this.model = observable.Model({});

					// Add the message components.
					this.addMessagesHeaderModelAndComponent(totalConversationMessages);
					this.addMessagesModelsAndComponents(allMessagesList.slice(0, initMessagesDisplayCount));
					this.addMessagesFooterModelAndComponent(totalConversationMessages);

					// Save the Conversation Deck messages remaining to be displayed, for later if the user requests to see more.
					convoDeckMessagesRemainingDisplayList = allMessagesList.slice(initMessagesDisplayCount);

					// Trigger the event to display the Conversation Deck messages (which are currently hidden) if ready.
					convoDeckMessagesDisplayReady = true;
					this.displayConvoDeckMessagesIfReady();

				}

			}

		};

		/**
		 * Registers the messages error message/alert into the messages container.
		 * @function registerConvoDeckMessagesError
		 * @param [None] (for now)
		 */
		this.registerConvoDeckMessagesError = function() {

			// Remove the saved response data, as they are not needed anymore.
			convoDeckMessagesResponseData = null;
			adMessageResponseDataList = null;

			// Initialize an empty observable model for this controller.
			this.model = observable.Model({});

			// Add the message header and error message components.
			this.addMessagesHeaderModelAndComponent('error');
			this.addMessagesErrorModelsAndComponents();

			// Trigger the event to display the Conversation Deck messages (which are currently hidden) if ready.
			convoDeckMessagesDisplayReady = true;
			this.displayConvoDeckMessagesIfReady();
		};

		/**
		 * Creates a merged list of Conversation Deck and ad message data
		 * @function mergeConvoDeckAndAdMessagesResponses
		 * @param {object} convoDeckMessagesResponseData The response from the Conversation Deck message list service
		 * @param {array} adMessageResponseDataList The list of responses from each ad message service (in the order of display required)
		 * @return {array} The list of Conversation Deck and ad message data
		 */
		this.mergeConvoDeckAndAdMessagesResponses = function(convoDeckMessagesResponseData, adMessageResponseDataList) {

			var allMessagesList = convoDeckMessagesResponseData.messages || [];

			// Merge the ad message response data into the Conversation Deck response data list.

			adMessageResponseDataList.forEach(function(adMessageData, index) {

				// If the ad message response data actually has content ...

				if (adMessageData) {

					// Add the first ad to the beginning of the message list, and add the remaining ads to the end of the message list.

					index === 0 ? allMessagesList.unshift(adMessageData) : allMessagesList.push(adMessageData);

				}

			}, this);

			// Return the merged list of Conversation Deck and ad messages.

			return allMessagesList;

		};

		/**
		 * Adds the messages header model and component for this controller.
		 * @function addMessagesHeaderModelAndComponent
		 * @param {integer} totalConversationMessages The total number of Conversation Deck messages
		 */
		this.addMessagesHeaderModelAndComponent = function(totalConversationMessages) {


			var messagesHeaderModel, intialTotalConversationMessagesNumber, hasErrorFlag;

			// Adjust the header depending on whether an HTTP error has occured
			if(totalConversationMessages === 'error'){
				intialTotalConversationMessagesNumber = '!';
				hasErrorFlag = 'messagesHeaderError';
			} else {
				intialTotalConversationMessagesNumber = totalConversationMessages;
			}

			// Add the messages header model within the controller's model.
			messagesHeaderModel = observable.Model({
				totalConversationMessages: intialTotalConversationMessagesNumber,
				conversationMessageHeader: '',
				totalConversationMessagesAda: '',
				conversationMessageDisplayAda: '',
				isErrorMessage: hasErrorFlag
			});

			this.model.lens('messagesHeaderComponent').set(messagesHeaderModel);

			// Register the component.
			this.register.components(this, [{
				name: 'messagesHeaderComponent',
				model: messagesHeaderModel,
				spec: messagesHeaderSpec,
				methods: messagesHeaderMethod
			}]);

			if(totalConversationMessages === 'error'){

				dynamicContentUtil.dynamicContent.setForBinding(this.components.messagesHeaderComponent, 'hide_conversation_message_ada', 'conversationMessageDisplayAda', {});

			} else {

				//update aria label for display mode messages shown / hidden.
				this.components.messagesHeaderComponent.setHeaderDisplayModeAriaLabel(totalConversationMessages);

				// Update the message header text based on the number of messages.
				this.components.messagesHeaderComponent.updateMessageHeaderText(totalConversationMessages, false);

			}

			// Render the component.
			this.executeCAV(
				[this.components.messagesHeaderComponent, 'conversationDeck/messagesHeader', { target: '#convo-deck-message-header' , react:true }]
			);

		};

		/**
		 * Adds the message models and components for this controller.
		 * @function addMessagesModelsAndComponents
		 * @param {array} messages The list of messages to add from the Conversation Deck message service response data
		 */
		this.addMessagesModelsAndComponents = function(messages) {

			var cavList = [],
				messagesCount = messages.length,
				messageId,
				messageData,
				messageModel,
				messageComponent,
				isAdMessage,
				i;

			// For each message ...

			for (i = 0; i < messagesCount; i++) {

				messageData = messages[i];
				messageId = messageData.messageId;
				isAdMessage = messageData.isAdMessage;

				// Add the model for this message within the controller's model.

				messageModel = observable.Model({
					messageId: messageId,
					isAdMessage: isAdMessage
				});

				if (isAdMessage) {
					messageModel.lens('adDismissId').set(messageData.dismissId);
					messageModel.lens('clickThroughUrl').set(messageData.clickThroughUrl);
				}

				this.model.lens(messageId).set(messageModel);

				// Register the component for this message.

				this.register.components(this, [{
					name: messageId,
					model: messageModel,
					spec: messagesSpec,
					methods: messagesMethod
				}]);

				// Call the appropriate function to set the message text and actions based on the message type.

				messageComponent = this.components[messageId];

				if (isAdMessage) {

					this.setAdMessageTextAndActions(
						messageComponent,
						messageData.content,
						messageData.actions
					);

				} else {

					this.setConvoDeckMessageTextAndActions(
						this.components[messageId],
						messageData.textId,
						messageData.data,
						messageData.actionIds
					);

				}

				// Add a component and view pair to the list to render later.

				cavList.push([this.components[messageId], 'conversationDeck/messages', {
					target: '#convo-deck-messages',
					append: true,
					react: true
				}]);

				// Increment the count of messages pushed to the UI and save the message component's name.

				convoDeckMessagesUiCount++;
				convoDeckMessagesUiIds[messageId] = true;

			}

			// Render all the message components.

			this.executeCAV(cavList);

		};

		this.addMessagesErrorModelsAndComponents = function() {

			var messageModel = observable.Model({
				isErrorMessage: 'true'
			});

			this.register.components(this, [{
				name: 'messagesErrorComponent',
				model: messageModel,
				spec: messagesSpec,
				methods: messagesMethod
			}]);

			var defaultErrorMessage1 = dynamicContentUtil.dynamicSettings.get(this.components.messagesErrorComponent, 'conversation_message_error.1');
			var defaultErrorMessage2 = dynamicContentUtil.dynamicSettings.get(this.components.messagesErrorComponent, 'conversation_message_error.2');
			var defaultErrorMessage3 = dynamicContentUtil.dynamicSettings.get(this.components.messagesErrorComponent, 'conversation_message_error.3');
			this.components.messagesErrorComponent.model.lens('conversation_message_1').set(defaultErrorMessage1);
			this.components.messagesErrorComponent.model.lens('conversation_message_2').set(defaultErrorMessage2);
			this.components.messagesErrorComponent.model.lens('conversation_message_3').set(defaultErrorMessage3);

			this.executeCAV([this.components.messagesErrorComponent, 'conversationDeck/messages', {
							target: '#convo-deck-messages',
							react: true
						}]);
		};

		/**
		 * Adds the messages footer model and component for this controller.
		 * @function addMessagesFooterModelAndComponent
		 * @param {integer} totalConversationMessages The total number of Conversation Deck messages
		 */
		this.addMessagesFooterModelAndComponent = function(totalConversationMessages) {

			// Only add the messages footer if there is more than one message.
			if (totalConversationMessages > 1) {

				// Add the messages footer model within the controller's model.

				var messagesFooterModel = observable.Model({});
				this.model.lens('messagesFooterComponent').set(messagesFooterModel);

				// Register the component.

				this.register.components(this, [{
					name: 'messagesFooterComponent',
					model: messagesFooterModel,
					spec: messagesFooterSpec,
					methods: messagesFooterMethod
				}]);

				// Render the component.

				this.executeCAV(
					[this.components.messagesFooterComponent, 'conversationDeck/messagesFooter', { target: '#convo-deck-message-footer' , react:true}]
				);

			}

		};

		/**
		 * Sets the text and action data (including localization) for the given Conversation Deck message component.
		 * @function setConvoDeckMessageTextAndActions
		 * @param {object} messageComponent The registered message component
		 * @param {string} textId The resource bundle token for the message text
		 * @param {array} textIdData The list of data to be substituted into the message text for localization (service response format)
		 * @param {array} actionIds The list of action objects for the message (service response format)
		 */
		this.setConvoDeckMessageTextAndActions = function(messageComponent, textId, textIdData, actionIds) {

			var messageToken = 'conversation_message.' + textId,
				messageTokenProps = {},
				textIdDataCount = textIdData ? textIdData.length : 0,
				actionIdsCount = actionIds ? actionIds.length : 0,
				conversationMessageActions = [],
				actionName,
				actionEvent,
				actionUrl,
				conversationMessage,
				currActionId,
				currTextIdData,
				i;

			// Create the data values to pass in to the dynamic content
			// utility for substituting in the message text, if any.

			for (i = 0; i < textIdDataCount; i++) {
				currTextIdData = textIdData[i];
				messageTokenProps[currTextIdData.name] = currTextIdData.value;
			}

			// Set the localized message text.

			conversationMessage = dynamicContentUtil.dynamicContent.get(messageComponent, messageToken, messageTokenProps);
			messageComponent.model.lens('conversation_message').set(conversationMessage);

			// Create the action array for the model with the localized action name and URL.

			for (i = 0; i < actionIdsCount; i++) {

				currActionId = actionIds[i];
				actionName = dynamicContentUtil.dynamicSettings.get(messageComponent, 'conversation_message_action_name', currActionId);
				actionEvent = dynamicContentUtil.dynamicSettings.get(messageComponent, 'conversation_message_action_event', currActionId);
        		actionUrl = dynamicContentUtil.dynamicContent.get(messageComponent, 'conversation_message_action_url.'+currActionId, messageTokenProps);

				conversationMessageActions.push({
					actionName: actionName,
					actionEvent: actionEvent,
					actionUrl: actionUrl
				});

			}

			// Update the message component model with the array of actions.

			messageComponent.model.lens('conversationMessageActions').set(conversationMessageActions);

		};

		/**
		 * Sets the text and action data for the given ad message component.
		 * @function setAdMessageTextAndActions
		 * @param {object} messageComponent The registered message component
		 * @param {string} message The ad message content
		 * @param {array} actions The ad message actions
		 */
		this.setAdMessageTextAndActions = function(messageComponent, message, actions) {

			var conversationMessageActions = [];

			// Set the message text.

			messageComponent.model.lens('conversation_message').set(message);

			// If there are actions, update the action array for the model with the action names and URLs.

			if (actions) {

				actions.forEach(function(currAction) {

					conversationMessageActions.push({
						actionName: currAction.name,
						actionEvent: currAction.event,
						actionUrl: currAction.url
					});

				}, this);

			}

			// Update the message component model with the array of actions.

			messageComponent.model.lens('conversationMessageActions').set(conversationMessageActions);
		};

		/**
		 * Checks the conditions needed to display the messages. If satisfied,
		 * the event to display the messages will be triggered.
		 * @function displayConvoDeckMessagesIfReady
		 */
		this.displayConvoDeckMessagesIfReady = function() {
			if (convoDeckGreetingHideReady && convoDeckMessagesDisplayReady) {
				controllerChannel.emit('convoDeckMessagesDisplay', { searchMaximized: convoDeckSearchMaximized });
			}
		};

		/**
		 * Emits an event with the number of Conversation Deck messages remaining when it changes (i.e. message dismissal).
		 * @function emitConvoDeckMessagesRemaining
		 * @param {integer} count The number of messages remaining
		 */
		this.emitConvoDeckMessagesRemaining = function(count) {
			controllerChannel.emit('convoDeckMessagesRemaining', { count: count });
		};

		/**
		 * Handler for the event that the Conversation Deck greeting has been
		 * displayed for the required amount of time and is ready to be hidden.
		 * @function receiveConvoDeckGreetingHideReady
		 */
		this.receiveConvoDeckGreetingHideReady = function() {
			convoDeckGreetingHideReady = true;
			this.displayConvoDeckMessagesIfReady();
		};

		/**
		 * Handler for the event that a single Conversation Deck message has been dismissed.
		 * @function receiveConvoDeckMessageDismissed
		 * @param {object} data The event data
		 */
		this.receiveConvoDeckMessageDismissed = function(data) {

			// Decrement the count of messages currently in the UI.
			convoDeckMessagesUiCount--;

			// If there are additional Conversation Deck messages remaining
			// to display, add the next message to display in the UI.
			if (convoDeckMessagesRemainingDisplayList.length) {
				var nextMessage = convoDeckMessagesRemainingDisplayList.splice(0, 1);
				this.addMessagesModelsAndComponents(nextMessage);
			}

			// Remove the message ID from the list of UI display message IDs.
			delete convoDeckMessagesUiIds[data.messageId];

			// If this is an ad message, remove its dismiss ID from the list of ad message dismiss IDs.
			if (data.adDismissId) {
				delete convoDeckAdMessageRemainingDismissIds[data.adDismissId];
			}

			// Send out an event with the updated count of messages left in the user's message list.
			this.emitConvoDeckMessagesRemaining(convoDeckMessagesUiCount + convoDeckMessagesRemainingDisplayList.length);

		};

		/**
		 * Handler for the event that all Conversation Messages should be dismissed.
		 * @function receiveConvoDeckDismissAllMessages
		 */
		this.receiveConvoDeckDismissAllMessages = function() {

			var inputData;

			// Dismiss all the ad messages.

			for (var adDismissId in convoDeckAdMessageRemainingDismissIds) {

				if (convoDeckAdMessageRemainingDismissIds.hasOwnProperty(adDismissId)) {

					inputData = {
						_o: this.settings.get('convoDeckAdMessagesOrgId'),
						_t: adDismissId,
						ssv_eci: this.settings.get('convoDeckAdMessagesEci')
					};

					fireAndForgetRequestUtil.get(this.adsServices.AD_DISMISS_SERVICE_URL, inputData);

				}

			}

			// Execute the Conversation Deck message dismissal service.

			this.messagesServices.messages['conversationdeck.dashboard.messageUpdateAll.svc']().then(function() {

				// Clear out the model data for all the messages.

				for (var messageId in convoDeckMessagesUiIds) {
					if (convoDeckMessagesUiIds.hasOwnProperty(messageId)) {
						this.model.lens(messageId.toString()).set(null);
					}
				}

				// Call the destroy method on one of the message components, which will remove all the message components.

				this.components[messageId].destroy();

				// Reset the related message variables.

				convoDeckMessagesUiCount = 0;
				convoDeckMessagesRemainingDisplayList = [];
				convoDeckMessagesUiIds = {};
				convoDeckAdMessageRemainingDismissIds = {};

				// Emit the event that there are no messages remaining.

				this.emitConvoDeckMessagesRemaining(0);

			}.bind(this),
			// handle HTTP errors
			function() {
				controllerChannel.emit('dismissMessageError');
			}.bind(this));

			// TODO: Add error handling logic

		};

		/**
		 * Handler for the event that the Conversation Deck search results are requested or closed.
		 * @function receiveConvoDeckSearchResults
		 * @param {boolean} maximized true if the search is maximized, false if it is minimized
		 */
		this.receiveConvoDeckSearchResults = function(maximized) {
			// Store the state the Conversation Deck search.
			convoDeckSearchMaximized = maximized;
		};

		/**
		 * Handler for the event that the user is requesting to toggle or display more Conversation Deck messages.
		 * @function receiveConvoDeckToggleMessages
		 */
		this.receiveConvoDeckToggleMessages = function() {

			var moreMessagesAdded = false;

			// If there are Conversation Deck messages still available for display after the
			// initial set was loaded, add the remaining Conversation Deck messages to the UI.
			if (convoDeckMessagesRemainingDisplayList.length) {
				this.addMessagesModelsAndComponents(convoDeckMessagesRemainingDisplayList);
				convoDeckMessagesRemainingDisplayList = [];
				moreMessagesAdded = true;
			}

			// Emit the event for toggling the Conversation Deck message list for the view to pick up.
			controllerChannel.emit('convoDeckToggleMessagesView', {
				moreMessagesAdded: moreMessagesAdded
			});

		};

		/**
		 * Registers the current conversation deck message components (if available) without the ads.
		 */
		this.registerConvoDeckMessagesWithoutAds = function() {
			adMessageResponseDataList = [];
			this.registerConvoDeckMessagesIfReady(convoDeckMessagesResponseData, adMessageResponseDataList);
		};

		/**
		 * Retrieves conversation deck messages and ad messages again.
		 */
		this.receiveRetryConversationMessagesRequest = function() {
			// Get Conversation Deck and ad messages.
			this.retrieveConvoDeckMessages();
			this.retrieveAdMessages();
		};

	};

});
