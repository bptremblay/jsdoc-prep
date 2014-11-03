/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PrimarySearchComponent
 * @description Component action methods for primary search
 */
define(function(require) {

	//store userloginId, ident in session storage
	var cvSessionStorage = new (require('blue/store/enumerable/session'))('cvsessiondata'),
		controllerChannel = require('blue/event/channel/controller'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		inputData = {},
		intervalRef,
		isInitServiceCalled,
		prevTypeAheadSearchFor,
		searchOptionsContainerDisplayed,
		defaultSuggestionsCount = 0;

	return {

		//initialization method
		init: function() {
			controllerChannel.on({
				'selectSearchOption': this.updateInputText.bind(this),
				'convoDeckSearchResultsClosed': this.shrinkSearchComponent.bind(this),
				'convoDeckMessagesFocus': this.setDefaultState.bind(this),
				'convoDeckToggleMessages': this.setDefaultState.bind(this), //TODO: Clean this once we have on dom click event
				'tabPressOnLastSuggestion': this.hideTypeAheadSearchSuggestions.bind(this),
				'hideSearchOptions': this.hideTypeAheadSearchSuggestions.bind(this)
			});
		},

		/**
		 * @function updateInputText
		 * @description Updates search modal's input data with the selected type ahead option
		 * @param  {Model} selectedOptionData data model related to selected type ahead option
		 * @return {none}
		 */
		updateInputText: function(data){
			this.searchFor = data.searchOptionData.searchOption;
		},

		/**
		 * @function hideTypeAheadSearchSuggestions
		 * @description Hides the type ahead search options when tab pressed on last item and when escape key is pressed on any item
		 * @param {object} data flag for escape key press
		 * @return {none}
		 */
		hideTypeAheadSearchSuggestions: function(data){
			//Accessibility requirement to set focus on input box if escape key pressed on type ahead list
			if(data.escapeKeyPressed){
				this.clearSearchFor();
			}else{
				this.context.controller.removeSearchList();
				this.hideSearchOptionsContainer();

			}
		},

		/**
		 * @function hideSearchOptions
		 * @description Hides the default search options when tab pressed on last item and when escape key is pressed on any item
		 * @return {none}
		 */
		hideSearchOptions: function(data){
			if(data.domEvent.keyCode === 9 && !data.domEvent.shiftKey){
				var $target = $(data.domEvent.target),
					$currentTarget = $(data.domEvent.currentTarget),
					$suggestionList = $currentTarget.find('a'),
					suggestionListLength = $suggestionList.length;
				if($suggestionList.index($target) === suggestionListLength-1){
					this.hideSearchOptionsContainer();
				}
			}
		},

		/**
		 * @function setDefaultState
		 * @description sets the search box to default state
		 * @return {none}
		 */
		//TODO: call this method to close search on click of dom
		setDefaultState: function(){
			this.context.controller.removeSearchList();
			this.searchFor = '';
			this.shrinkSearchComponent();
			this.hideSearchOptionsContainer();
			this.hideSearchAdvisory();
		},

		/**
		 * @function requestDefaultSearchOptionsResult
		 * @description Called when default search option is clicked. Gets result for the default search options
		 * @return {none}
		 */
		requestDefaultSearchOptionsResult: function(event){
			var target = event.domEvent.target,
				searchQueryString = target.getAttribute('data-search');
			this.searchFor = target.text;
			this.context.controller.showSearchResults(null, searchQueryString);
		},

		/**
		 * @function requestDefaultSearchOptions
		 * @description Handler for when the user focuses into the search text box.
		 * @return {none}
		 */
		requestDefaultSearchOptions: function(){

			// If the search options container is not currently displayed ...
			if (!searchOptionsContainerDisplayed) {

				// Save the current search text for comparison later during type ahead to detect any changes.
				prevTypeAheadSearchFor = this.searchFor;

				// Show the search options container and default search options.
				this.showSearchOptions();
				this.showDefaultSearchOptions();

			}

		},

		/**
		 * @function requestSearchResults
		 * @description Triggers a message to primarySearchResults component when the user types text in the search box and presses enter
		 * @return {none}
		 */
		requestSearchResults:function(){
			this.context.controller.showSearchResults(null, this.searchFor);
			this.expandSearchComponent();
		},

		/**
		 * @function requestTypeAheadSearchOptions
		 * @description Gets type ahead suggestion list by making a service call and emits a message to controller to handle the response from services. Also emits a message on output channel to hide the default search suggestion contianer
		 * @return {none}
		 */
		requestTypeAheadSearchOptions: function(data){

			var searchFor = this.searchFor,
				searchInputTextLength = searchFor.length;

			// If the Enter key is pressed and the user has entered a search term ...
			if(data && data.domEvent.keyCode === 13 && searchInputTextLength){
				// Clear any pending type ahead call and execute the search.
				clearTimeout(intervalRef);
				this.requestSearchResults();
				return;
			}

			// If the current search text is the same as the previous type ahead search text, do not do anything.
			if (searchFor === prevTypeAheadSearchFor) {
				return;
			}

			// Since the search text is changing, clear any pending type ahead call and save the new search text.
			clearTimeout(intervalRef);
			prevTypeAheadSearchFor = searchFor;

			// If the search input box has no text, display the default search options.
			if(searchInputTextLength === 0){
				this.showDefaultSearchOptions();
				return;
			}

			// If the number of characters entered in the search input box is less than the minimum number
			// of characters required to display a typeahead suggestion list, show the search advisory.
			if(searchInputTextLength < 5){
				this.showSearchAdvisory(false);
				return;
			}

			intervalRef = setTimeout(function () {

				//Type ahead request param data
				inputData.type = this.context.controller.settings.get('primarySearch').type;
            	inputData.api = this.context.controller.settings.get('primarySearch').api;
				inputData.featureClass = this.context.controller.settings.get('primarySearch').featureClass;
				inputData.style = this.context.controller.settings.get('primarySearch').style;
				inputData.maxRows = this.context.controller.settings.get('primarySearch').maxRows;  //max no of typeahead suggestions
				inputData.query = searchFor;
				inputData.ident = cvSessionStorage.get('ident');

				//typeahead service call, which will return typeahead suggessions.
				this.context.controller.primarySearchServices.primarySearch['conversationdeck.dashboard.primarysearch.typeahead.svc'](inputData).then(

					// Success function.
					function(typeaheadResponseData) {

	            		// Handle the search response error, if any.
	            		if (this.context.controller.isSearchResponseError(typeaheadResponseData)) {
	            			this.handleSearchInputException();
	            			return;
	            		}

						// When the session timed out in V-Engine during typeadread service call,
						// call init service to create new session.
		   				if(typeaheadResponseData.reason === 'timeout'){
							this.invokeCVInitService(false);
							return;
						}

						if(typeaheadResponseData.suggestions.length){

							// If the query this request is for is still the same as what is currently
							// in the search text box, display the typeahead suggestions returned.
							if (searchFor === this.searchFor) {
								this.hideDefaultSearchOptions();
								this.hideSearchAdvisory();
								this.context.controller.renderSearchList(typeaheadResponseData);
							}

						}else{

							this.showSearchAdvisory(false);

						}

					}.bind(this),

					// Failure function.
					this.handleSearchInputException.bind(this)

				);

			}.bind(this), 225);

		},

		/**
		 * @function clearSearchFor
		 * @description Clears search input text and shows default search options
		 * @return {none}
		 */
		clearSearchFor: function(){

			// Clear any typeahead suggestion requests pending.
			clearTimeout(intervalRef);

			// Clear the search input text box, display the default search options, and set focus to the search input.
			this.searchFor = '';
			this.showDefaultSearchOptions();
			this.setFocus('searchBox');

		},

		/**
		 * @function hideSearchOptionsContainer
		 * @description Emits a message to View to hide the search suggestions container
		 * @return {none}
		 */
		hideSearchOptionsContainer: function(){
			searchOptionsContainerDisplayed = false;
			this.output.emit('state', {
                value: 'hideSearchOptionsContainer'
            });
		},

		/**
		 * @function showSearchOptions
		 * @description Emits a message to View to hide search suggestion container
		 * @return {none}
		 */
		showSearchOptions: function(){
			searchOptionsContainerDisplayed = true;
            this.output.emit('state', {
                value: 'showSearchOptionsContainer'
            });
		},

		/**
		 * @function hideDefaultSearchOptions Emits a message to View to hide default suggestions
		 * @return {none}
		 */
		hideDefaultSearchOptions: function(){
			this.output.emit('state', {
				value: 'hideDefaultSearchOptionsContainer'
			});
		},

		/**
		 * @function showDefaultSearchOptions Emits a message to View to show default suggestions
		 * @return {none}
		 */
		showDefaultSearchOptions: function(){

			// If the search initialization service was called earlier successfully ...

			if (isInitServiceCalled) {

				// Hide the other search dropdowns.
				this.hideSearchAdvisory();
				this.context.controller.removeSearchList();

				// Update the model with the count of default options about to be displayed (for ADA).
				this.model.lens('searchOptionsCount').set(defaultSuggestionsCount);

 				// Display the default options container, which should already have the default
 				// search options that were retrieved earlier.
				this.output.emit('state', {
					value: 'showDefaultSearchOptionsContainer'
				});

			}

			// Else, make a request for the default search options.

			else {

				this.invokeCVInitService(true);

			}

		},

		/**
		 * @function expandSearchComponent
		 * @description Emits a message to View to expand search component when the search results are displayed
		 * @return {none}
		 */
		expandSearchComponent: function(){
			this.output.emit('state', {
                value: 'expandSearchComponent'
            });
		},

		/**
		 * @function shrinkSearchComponent
		 * @description Emits a message to View to go to the default view when search component is closed
		 * @return {none}
		 */
		shrinkSearchComponent: function(){
			this.searchFor = '';
			this.output.emit('state', {
                value: 'shrinkSearchComponent'
            });
		},

		/**
		 * @function showSearchAdvisory
		 * @description Emits a message to View to show the search advisory text
		 * @param {boolean} isSearchException true if this advistory is for a search exception, false otherwise
		 * @return {none}
		 */
		showSearchAdvisory: function(isSearchException){

			var searchOptionResponseToken;

			// Set the appropriate advisory text depending on whether or not this is for a search exception.

			searchOptionResponseToken = isSearchException ? 'search_option_error' : 'search_option_ask_question_advisory';
			dynamicContentUtil.dynamicContent.setForBinding(this, searchOptionResponseToken, 'searchOptionsResponse', {});

			// Update the model with the count of options about to be displayed for ADA.

			this.model.lens('searchOptionsCount').set(0);

			// Hide the other search dropdowns.

			this.hideDefaultSearchOptions();
			this.context.controller.removeSearchList();

			// Emit the message to the view to show the advisory text.

			this.output.emit('state', {
				value: 'showAdvisory'
			});

		},

		/**
		 * @function hideSearchAdvisory
		 * @description Emits a message to View to hide the search advisory text
		 * @return {none}
		 */
		hideSearchAdvisory: function(){
			this.output.emit('state', {
				value: 'hideAdvisory'
			});
		},

		/**
		 * @function handleSearchInputException
		 * @description Handler for search input exceptions (e.g. during search initialization or typeahead service calls)
		 * @return {none}
		 */
		handleSearchInputException: function() {
			// Show the search advisory for an exception.
			this.showSearchAdvisory(true);
		},

		/**
		 * @function setFocus
		 * @description set's focus to an element
		 */
		//This function can be used to set focus on various items. Can be useful for fixing accessibility issues
		setFocus: function(item){
			this.output.emit('state', {
				value: 'setFocus',
				element: item
			});
		},

		/**
		 * @function invokeCVInitService
		 * @description Function to make service call for default search suggestions
		 * @param {boolean} showDefaultSearchOptions true to show the default search options after successfully retrieving them,
		 *                                           else they will only be shown if the search text box is empty
		 * @return {none}
		 */
		invokeCVInitService: function(showDefaultSearchOptions){

			inputData.type = this.context.controller.settings.get('primarySearch').type;
            inputData.api = this.context.controller.settings.get('primarySearch').api;
			inputData.init = this.context.controller.settings.get('primarySearch').init;
			inputData.segment = this.context.controller.settings.get('personlizationData').segment;
			inputData.pm = this.context.controller.settings.get('personlizationData').pm;

			//init service call to initialize session in V-Engine and returns suggested questions in response.
			this.context.controller.primarySearchServices.primarySearch['conversationdeck.dashboard.primarysearch.svc'](inputData).then(

				// Success function.
				function(initResponseData) {

            		// Handle the search response error, if any.
            		if (this.context.controller.isSearchResponseError(initResponseData)) {
            			this.handleSearchInputException();
            			return;
            		}

					//Add ident, userloginId to session storage, as subsequent service calls requires latest ident and userloginId
					cvSessionStorage.set('ident', initResponseData.ident);
					cvSessionStorage.set('userloginId', initResponseData.userlogid);
					isInitServiceCalled = true;
					this.defaultSearchOptions = initResponseData.answer;
					defaultSuggestionsCount = Number(initResponseData.suggestionsCount);

					// If default search options are requested or the search text box has no entry, show the default search options.
					if (showDefaultSearchOptions || this.searchFor === '') {
						this.showDefaultSearchOptions();
					}

				}.bind(this),

				// Failure function.
				this.handleSearchInputException.bind(this)

			);
		},
		hideDefaultSearchOptionsIfOpen: function(data){

			var elementId = data.domEvent.target.id;
			if( elementId !== 'primary-search-input' && elementId !=='primary-search-suggestions-container'){
				this.hideSearchOptionsContainer();
			}
		}


	};
});
