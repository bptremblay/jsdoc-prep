/**
 * This is the view for the Conversation Deck search related questions.
 * @module view/conversationDeck/PrimarySearchRelatedQuestionsView
 */
define(function(require) {

	return function PrimarySearchRelatedQuestionsView() {

		//Set view name
		this.viewName = 'PrimarySearchRelatedQuestionsView';

		// Set view template.
		this.template = require('dashboard/template/conversationDeck/primarySearchResultsRelatedQuestions');

		this.init = function() {

		// Set view bridge.
		this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/primarySearchResultsRelatedQuestions'));

		};

	};

});
