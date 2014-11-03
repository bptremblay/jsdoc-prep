/**
 * This is the view for the Conversation Deck search.
 * @module view/conversationDeck/primarySearchOptionView
 */
define(function(require) {

	return function PrimarySearchOptionView() {

		this.viewName = 'PrimarySearchOptionView';
		// Define bridge
		// Set template
		this.template = require('dashboard/template/conversationDeck/primarySearchOption');

		this.init = function() {
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/primarySearchOption'));

		};
	};
});
