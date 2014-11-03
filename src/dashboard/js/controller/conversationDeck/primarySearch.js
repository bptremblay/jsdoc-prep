/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PrimarySearchController
 * @description Controller to handle type ahead search options and search results
 */
define(function(require) {

	return function PrimarySearchController() {

		var observable = require('blue/observable'),
			controllerChannel = require('blue/event/channel/controller'),
			dynamicContentUtil = require('common/utility/dynamicContentUtil'),
			cvSessionStorage = new (require('blue/store/enumerable/session'))('cvsessiondata');

		//Initialization method
		this.init = function() {

			//Mapper object to store information about spec/component/view modules for all the search components
			this.searchMapper = {

				'SEARCHCOMPONENT': {
					'spec': require('bluespec/primary_search_query'),
                    'component': require('dashboard/component/conversationDeck/primarySearch'),
                    'view': 'conversationDeck/primarySearch'
				},
				'SEARCHOPTIONCOMPONENT': {
					'spec': require('bluespec/primary_search_options'),
                    'component': require('dashboard/component/conversationDeck/primarySearchOption'),
                    'view': 'conversationDeck/primarySearchOption'
				},
				'SEARCHRESULTSCOMPONENT': {
					'spec': require('bluespec/primary_search_results'),
                    'component': require('dashboard/component/conversationDeck/primarySearchResults'),
                    'view': 'conversationDeck/primarySearchResults'
				},
				'SEARCHHISTORYCOMPONENT': {
					'spec': require('bluespec/primary_recent_searches'),
                    'component': require('dashboard/component/conversationDeck/primarySearchHistory'),
                    'view': 'conversationDeck/primarySearchHistory'
				},
				'SEARCHRELATEDQUESTIONSCOMPONENT': {
					'spec': require('bluespec/primary_search_results_related_questions'),
                    'component': require('dashboard/component/conversationDeck/primarySearchResultsRelatedQuestions'),
                    'view': 'conversationDeck/primarySearchResultsRelatedQuestions'
				},
				'SITEEXITWARNINGCOMPONENT': {
					'spec': require('bluespec/site_exit_warning'),
                    'component': require('dashboard/component/conversationDeck/siteExitWarning'),
                    'view': 'conversationDeck/siteExitWarning'
				}

			};

 			//Controller channel listining to 'selectSearchOption' (triggered when type ahead option is selected), 'showSearchOptionList' (triggered when type ahead options are retrieved from services) and 'clearSearchFor' (triggered when close button in the search box is clicked) messages from primarySearch component

			controllerChannel.on({
				'selectSearchOption': this.showSearchResults.bind(this)
			});

			controllerChannel.on({
				'showSearchOptionList': this.refreshSearchList.bind(this)
			});

			controllerChannel.on({
				'externalLinkClicked': this.showSiteExitWarning.bind(this)
			});
			controllerChannel.on({
                dashboardHeaderLoaded: this.index.bind(this)
            });
			//Base data model
			this.model = observable.Model({
				'searchData':{
					'searchFor': '',
					'defaultSearchOptions': '',
					'searchOptionsCount': '',
					'searchOptionsResponse': ''
				}
			});

		};

		/**
		 * @function renderSearchList
		 * @description creates search option component list
		 * @param  {Object} data Raw search option list from services
		 * @return {none}
		 */

		this.renderSearchList = function(typeaheadData){
			var	searchOptionsCount = typeaheadData.suggestions.length,
				searchOptionModelList = [],
				searchOptionsModel;
			//looping through data to create component data model
			for(var i=0; i<searchOptionsCount; i++){
				searchOptionModelList.push({
					searchOption: typeaheadData.suggestions[i],
					searchOptionData: typeaheadData.data[i],
					searchOptionAnswerID: typeaheadData.answerID[i],
					searchOptionRecognitionID: typeaheadData.recognitionID[i]
				});

			}
			this.model.lens('searchData.searchOptionsCount').set(searchOptionsCount);
			searchOptionsModel = observable.Model({
				searchOptions: searchOptionModelList
			});

        	this.register.components(this, [{
        		name: 'searchOptionsListComponent',
            	model: searchOptionsModel,
            	spec: this.searchMapper.SEARCHOPTIONCOMPONENT.spec,
            	methods: this.searchMapper.SEARCHOPTIONCOMPONENT.component
        	}]);

            this.executeCAV([this.components.searchOptionsListComponent, this.searchMapper.SEARCHOPTIONCOMPONENT.view, {
            	'target': '#primary-search-options-list',
            	'react': true
            }]);
		};

		/**
		 * @function refreshSearchList
		 * @description Removes existing typeahead list and renders a new list
		 * @param  {Object} data Raw data from services
		 * @return {none}
		 */
		this.refreshSearchList = function(data){
			this.removeSearchList();
			this.renderSearchList(data);
		};

		/**
		 * @function removeSearchList
		 * @description Deletes the typeahead suggestion component
		 * @return {none}
		 */
		this.removeSearchList = function(){
			this.components.searchOptionsListComponent && this.components.searchOptionsListComponent.destroy();
		};

		/**
		 * Default action to initialize the search.
		 * @function index
		 * @description calls executeCAV
		 * @return {none}
		 */
		this.index = function() {

				// Register the base component.
				this.register.components(this, [{
	            	name: 'primarySearchComponent',
	            	model: this.model.lens('searchData'),
	            	spec: this.searchMapper.SEARCHCOMPONENT.spec,
	            	methods: this.searchMapper.SEARCHCOMPONENT.component
	            }]);

	            this.executeCAV([this.components.primarySearchComponent, this.searchMapper.SEARCHCOMPONENT.view, {
	            	'target': '#convo-deck-primary-search',
	            	'react': true
	            }]);

		};

		this.showSearchResults = function(data, searchQueryString, disambiguationOption) {

			//emit a event that search results are being displayed.
            controllerChannel.emit('convoDeckSearchResultsRequested',{});

            var componentsCollection = [],
           		inputData = {};

            inputData.type = this.settings.get('primarySearch').type;
            inputData.api = this.settings.get('primarySearch').api;

            inputData.ident = cvSessionStorage.get('ident');
            inputData.userloginId = cvSessionStorage.get('userloginId');

            // when the user selects typeahead suggestion and perform search
            if(data && data.searchOptionData){
            	inputData.faq = this.settings.get('primarySearch').faq;
            	inputData.recognition_id = data.searchOptionData.searchOptionRecognitionID;
            	inputData.answer_id = data.searchOptionData.searchOptionAnswerID;
            	inputData.faqrequest = data.searchOptionData.searchOptionData;

            }else {
            	disambiguationOption && (inputData.disambiguationOption = disambiguationOption);
            	inputData.entry = searchQueryString;
            }

            //remove the typeahead search list
            this.removeSearchList();
            this.components.primarySearchComponent.hideSearchOptionsContainer();
            this.components.primarySearchComponent.expandSearchComponent();

            //searchresult service call, which will returns results for selected/entered search text.
            this.primarySearchServices.primarySearch['conversationdeck.dashboard.primarysearch.svc'](inputData).then(

            	// Success function.
            	function(resultResponseData) {

            		// Handle the search response error, if any.
            		if (this.isSearchResponseError(resultResponseData)) {
            			this.handleSearchResultsException();
            			return;
            		}

	            	//Add ident, userloginId to session storage, as subsequent service calls requires latest ident and userloginId
					cvSessionStorage.set('ident', resultResponseData.ident);
					cvSessionStorage.set('userloginId', resultResponseData.userlogid);
					componentsCollection = this.pushPrimarySearchResultsComponent(componentsCollection, resultResponseData, false);
					componentsCollection = this.pushSearchRelatedQuestionsComponent(componentsCollection, resultResponseData);
					componentsCollection = this.pushSearchHistoryComponent(componentsCollection, resultResponseData);
					//execute all the collection of components
					this.executeCAV(componentsCollection);

					this.components.primarySearchResultsComponent.setFocus('searchResultsHeader');

		        }.bind(this),

		        // Failure function.
            	this.handleSearchResultsException.bind(this)

            );
        };

		//this function is to push search results component to component collection
		this.pushPrimarySearchResultsComponent = function(componentsCollection, data, isSearchResultsException) {

			// Set the appropriate results model based on whether or not it is an exception or not.

			var resultsModel;

			if (isSearchResultsException) {

				resultsModel = {
					isSearchResultsException: true
				};

			} else {

				resultsModel = {
					searchResults: data.answer,
					needHelpOnSearch: data.escalationprompt,
					searchResultFeedback: data.ICS.prompt ? data.ICS : '',
					showRecentSearches: data.convohistory.length,
					showRelatedQuestions:data.questions.length,
					showfaqSection: data.ICS.prompt || data.questions.length,
					showGoBackLink: Number(data.backnavflag)
				};

			}

			this.model.lens('Results').set(resultsModel);

			// Register Component

            this.register.components(this, [{
             	name: 'primarySearchResultsComponent',
            	model: this.model.lens('Results'),
            	spec: this.searchMapper.SEARCHRESULTSCOMPONENT.spec,
            	methods: this.searchMapper.SEARCHRESULTSCOMPONENT.component
            }]);

            // Add the component to the components list passed into the function.

            componentsCollection.push([this.components.primarySearchResultsComponent, this.searchMapper.SEARCHRESULTSCOMPONENT.view, {
            	'target': '#primary-search-result', 'react': true}]);

            return componentsCollection;

		};

		//this function is to push search history components to component collection
		this.pushSearchHistoryComponent = function(componentsCollection, data) {

			//TODO revisit with 1.3.3 release
			//for each history question and answer history componet will be registered and pushed to collection
			data.convohistory.forEach(function(item, i) {
                var primarySearchHistoryComponentName = 'primarySearchHistoryComponent-' + i;

                this.model.lens(primarySearchHistoryComponentName).set({
					searchQuery: item.question,
					searchResult: item.answer
				});
                // Register Component
                this.register.components(this, [{
                    name: primarySearchHistoryComponentName,
                    model: this.model.lens(primarySearchHistoryComponentName),
                    spec: this.searchMapper.SEARCHHISTORYCOMPONENT.spec,
                    methods: this.searchMapper.SEARCHHISTORYCOMPONENT.component
                }]);

                componentsCollection.push(
					[this.components[primarySearchHistoryComponentName], this.searchMapper.SEARCHHISTORYCOMPONENT.view, { target: '#history', append: !!i, 'react': true }]
				);

			}.bind(this));
			return componentsCollection;
		};

		//this function is to push search history components to component collection
		this.pushSearchRelatedQuestionsComponent = function(componentsCollection, data) {


			var	questionsList = data.questions;
			if(questionsList.length){
				var	searchOptionModelList = [],
					searchOptionsModel;

				for(var i=0; i<questionsList.length; i++){
					searchOptionModelList.push({
						searchOption: questionsList[i].faqdisplay,
						searchOptionData: questionsList[i].faqrequest,
						searchOptionAnswerID: questionsList[i].answer_id,
						searchOptionRecognitionID: questionsList[i].recognition_id,
						searchOptionFaqID: questionsList[i].faqid
					});

				}

				searchOptionsModel = observable.Model({
					searchRelatedQuestions: searchOptionModelList
				});

				this.register.components(this, [{
	                name: 'primarySearchRelatedQuestionsComponentName',
	                model: searchOptionsModel,
	                spec: this.searchMapper.SEARCHRELATEDQUESTIONSCOMPONENT.spec,
	                methods: this.searchMapper.SEARCHRELATEDQUESTIONSCOMPONENT.component
	            }]);

	            componentsCollection.push(
					[this.components.primarySearchRelatedQuestionsComponentName, this.searchMapper.SEARCHRELATEDQUESTIONSCOMPONENT.view, { target: '#relatedquestions', append: false, react: true }]
				);
	        }

            return componentsCollection;
		};

		/**
		 * @function showSiteExitWarning
		 * @description Brings up the "speedbump"; registers and calls CAV that takes over the screen through fixed positioning
		 */
		this.showSiteExitWarning = function(target) {
		 	this.register.components(this, [{
		 	 	name: 'siteExitWarningComponent',
		 	 	model: observable.Model({
		 	 		externalURL: target.target.href
		 	 	}),
		 		spec: this.searchMapper.SITEEXITWARNINGCOMPONENT.spec,
		 		methods: this.searchMapper.SITEEXITWARNINGCOMPONENT.component
		 	}]);

		 	dynamicContentUtil.dynamicContent.set(this.components.siteExitWarningComponent, 'site_exit_message', { redirectURL: target.target.getAttribute('data-display') });

		 	this.executeCAV([this.components.siteExitWarningComponent, this.searchMapper.SITEEXITWARNINGCOMPONENT.view, { target: '#site-exit-warning-container', react:true }]);
		};

		/**
		 * @function handleSearchResultsException
		 * @description Handler for search result exceptions
		 * @return {none}
		 */
		this.handleSearchResultsException = function() {

			var componentsCollection = [];

			// Show the search results component in the exception state.
			this.pushPrimarySearchResultsComponent(componentsCollection, null, true);
			this.executeCAV(componentsCollection);

			// Set focus on the search results header (for ADA).
			this.components.primarySearchResultsComponent.setFocus('searchResultsHeader');

		};

		/**
		 * @function isSearchResponseError
		 * @description For application / system errors, the service response will have an HTTP 200 status
		 *              code but the response data will have an error indicator. This function verifies that.
		 * @param {object} data The service response data
		 * @return {boolean} true if the search response indicates an error, false otherwise
		 */
		this.isSearchResponseError = function(data) {
			if (data && data.status === 'error') {
				return true;
			} else {
				return false;
			}
		};

	};
});
