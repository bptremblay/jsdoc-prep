/**
 * This is the view for the Conversation Deck search History.
 * @module view/conversationDeck/primarySearchHistory
 */
define(function(require) {

	return function primarySearchHistoryView() {

		this.viewName = 'primarySearchHistoryView';

		// Set Bridge
		// Set view template.
		this.template = require('dashboard/template/conversationDeck/primarySearchHistory');

		this.init = function() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/primarySearchHistory'));

		};

	};

});
