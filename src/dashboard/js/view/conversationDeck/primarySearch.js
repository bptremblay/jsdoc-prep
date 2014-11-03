/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PrimarySearchView
 * @description View for Primary Search Component
 */
define(function(require) {

	return function PrimarySearchView() {

		//Set View name
		this.viewName = 'PrimarySearchView';
		//Set Bridge
		//Set Template
		this.template = require('dashboard/template/conversationDeck/primarySearch');

		// Initialization method
		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/primarySearch'));
			this.bridge.on('state/hideSearchOptionsContainer', this.hideSearchOptionsContainer.bind(this));
			this.bridge.on('state/showSearchOptionsContainer', this.showSearchOptionsContainer.bind(this));
			this.bridge.on('state/hideDefaultSearchOptionsContainer', this.hideDefaultSearchOptionsContainer.bind(this));
			this.bridge.on('state/showDefaultSearchOptionsContainer', this.showDefaultSearchOptionsContainer.bind(this));
			this.bridge.on('state/expandSearchComponent', this.expandSearchComponent.bind(this));
			this.bridge.on('state/shrinkSearchComponent', this.shrinkSearchComponent.bind(this));
			this.bridge.on('state/hideAdvisory', this.hideAdvisoryText.bind(this));
			this.bridge.on('state/showAdvisory', this.showAdvisoryText.bind(this));
			this.bridge.on('state/setFocus', this.setFocus.bind(this));
		};

		// Function to hide search options container, adds dis-none class
		this.hideSearchOptionsContainer = function(){
			this.$element.find('#primary-search-suggestions-container').addClass('dis-none');
			this.$element.find('#primary-search-input').removeClass('is-active');
		};

		// Function to show the search options container, removes dis-none class
		// Also shows default options container
		this.showSearchOptionsContainer = function(data){
			this.$element.find('#primary-search-suggestions-container').removeClass('dis-none');
			this.$element.find('#primary-search-input').addClass('is-active');
		};

		//Function to hide default search options conatiner
		this.hideDefaultSearchOptionsContainer = function(){
			this.$element.find('#primary-search-default-options').addClass('dis-none');
		};

		//Function to show default search options conatiner
		this.showDefaultSearchOptionsContainer = function(){
			this.$element.find('#primary-search-default-options').removeClass('dis-none');
		};

		//Function to expand the search options container
		this.expandSearchComponent = function(){
			//this.$element.addClass('width60');
		};

		//Function to shrink the search options conatiner
		this.shrinkSearchComponent = function(){
			//this.$element.removeClass('width60');
		};

		//Function to hide search advisory text
		this.hideAdvisoryText = function(){
			this.$element.find('#primary-search-advisory').addClass('dis-none');
		};

		//Function to show search advisory text
		this.showAdvisoryText = function(){
			this.$element.find('#primary-search-advisory').removeClass('dis-none');
		};

		//Function to set focus on passed element
		this.setFocus = function(data){
			switch(data.element){
				case 'searchBox':
								this.$element.find('#primary-search-input').focus();
								break;
				default: break;
			}
		};

	};

});
