/**
 * This is the view for the Conversation Deck search results.
 * @module view/conversationDeck/primarySearchResults
 */
define(function(require) {

	return function PrimarySearchResultsView() {

		//var PrimarySearchResultsBridge = this.createBridgePrototype(require('dashboard/view/webspec/conversationDeck/primarySearchResults'));

		this.viewName = 'PrimarySearchResultsView';
		// Set view template.
		this.template = require('dashboard/template/conversationDeck/primarySearchResults');

		this.init = function() {
			//Set bridge
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/primarySearchResults'));


			this.bridge.on('state/setFocus', this.setFocus.bind(this));

			this.bridge.on('state/recentSearches', function(){

				//Hide search results and active search history tab
				this.$element.find('#results').addClass('dis-none');
	            this.$element.find('#history').removeClass('dis-none');
	            this.$element.find('#recent-search-history').removeClass('dis-none');
	            this.$element.find('#search-history').addClass('active-tab');
	            this.$element.find('#search-results').removeClass('active-tab');

			}.bind(this));

			this.bridge.on('state/searchResults', function(){

				//Hide serch History and active search results tab
				this.$element.find('#history').addClass('dis-none');
				this.$element.find('#recent-search-history').addClass('dis-none');
	            this.$element.find('#results').removeClass('dis-none');
	            this.$element.find('#search-results').addClass('active-tab');
	            this.$element.find('#search-history').removeClass('active-tab');

			}.bind(this));

		};

		//Function to set focus on passed element
		this.setFocus = function(data){
			switch(data.element){
				case 'searchResultsHeader':
					this.$element.find('#ada-search-results-header').focus();
					break;
				default:
					$('#primary-search-input').blur(); // TODO: Put appropriate handler for ADA
					break;
			}
		};

	};

});
