/**
 * This is the component for the Conversation Deck search results.
 * @module component/conversationDeck/primarySearchResults
 */
define(function(require) {
	var controllerChannel = require('blue/event/channel/controller');
	return {

		init: function() {
			controllerChannel.on({
				'convoDeckMessagesFocus':  this.destroyModelandView.bind(this)
			});
		},

		selectSearchRelatedQuestions: function() {

		},

		selectNeedHelpOnSearch: function() {

		},
		selectSearchResultFeedback: function() {

		},
		//This action hides search results and enables display of search history
		requestRecentSearches: function() {
			//emit state serch history selected
			this.output.emit('state', {
				target: this,
				value: 'recentSearches'
			});
		},
		//This action hides search history and enables display of search results
		requestSearchResults: function() {
			//emit state serch results selected
			this.output.emit('state', {
				target: this,
				value: 'searchResults'
			});
		},

		//This action is close out serch view
		closeSearchResult: function() {
			//collapse the search results view
			this.destroyModelandView();
			//emit a event to search results are closed
			controllerChannel.emit('convoDeckSearchResultsClosed',{});

		},

		//This action is close out serch view
		destroyModelandView: function() {
			//collapse the serch results view
			this.destroyView();
			//clean up model
			this.model.set(null);
		},

		/**
		 * @function selectSearchResult
		 * @description Click handler listening to click events on the answers container. This invokes other functions based on the target which triggered this handler.
		 * @param {Object} data Event Object
		 * @return {none}
		 */
        selectSearchResult: function(data) {
        	var target = data.domEvent.target,
        		classList = target.classList;

        	if (classList.contains('internal-link')) {
        		this.handleInteralLinks(target);
        	} else if(classList.contains('external-link')){
        		this.handleExternalLinks(target);
        	} else if (classList.contains('deeplink-button')){
        		this.showNextOption(target);
        	} else if (classList.contains('seurat-link')){
        		this.handleSeuratLinks(target);
        	} else if (target.href && target.href.indexOf('tel:') === 0){
		        window.location = target.href;
	        }
        },

        /**
         * @function showNextOption
         * @description shows the next question or the final answer in the decision tree
         * @param  {Object} target Event Object
         * @return {none}
         */
        showNextOption: function(target){
        	this.context.controller.showSearchResults(null, target.getAttribute('data-search'), target.getAttribute('data-disambiguation-option'));
        },

        /**
         * @function requestPreviousSearchResult
         * @description Shows the previous question in the decision tree
         * @return {none}
         */
        requestPreviousSearchResult: function(){
        	this.context.controller.showSearchResults(null, this.controller.settings.get('primarySearch').goBackLinkData);
        },

        /**
         * @function setFocus
         * @description Sets focus on passed element
         * @param {String} item Name of the item to get the focus
         * @returns {none}
         */
        setFocus: function(item){
        	this.output.emit('state',{
        		value: 'setFocus',
        		element: item
        	});
        },

        /**
         * @function handleInternalLinks
         * @param  {Object} target Event Object
         * @return {none}
         */
        handleInteralLinks: function(target) {
			window.open(target.href, '_blank');
        },

        /**
         * @function handleExternalLinks
         * @param  {Object} target Event Object
         * @return {none}
         */
        handleExternalLinks: function(target) {
        	controllerChannel.emit('externalLinkClicked', {
				target: target
			});
        },

		/**
         * @function handleSeuratLinks
         * @description Function for handling links to Seurat pages in the search results
         * @param  {Object} target Target DOM element
         * @return {none}
         */
        handleSeuratLinks: function(target) {

        	var linkEvent = target.getAttribute('data-event'),
        		linkUrl = target.href;

        	// If the target link has either an event or url attribute ...

        	if (linkEvent || linkUrl) {

				// Either emit the event or navigate to the URL (assuming both are never provided at the same time).

	        	if (linkEvent) {
	        		controllerChannel.emit(linkEvent);
	        	} else {
	        		window.location = linkUrl;
	        	}

	        	// Close the search results.

	        	this.closeSearchResult();

        	}

        }
    };
});
