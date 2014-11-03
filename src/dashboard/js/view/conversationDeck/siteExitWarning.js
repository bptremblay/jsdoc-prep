/**
 * This is the view for the Conversation Deck Site Exit Warning.
 * @module view/conversationDeck/siteExitWarning
 */
define(function(require) {

	return function siteExitWarningView() {

		this.viewName = 'siteExitWarningView';

		// Set view template.
		this.template = require('dashboard/template/conversationDeck/siteExitWarning');

		this.init = function() {
			// Set Bridge
			this.bridge = this.createBridge(require('dashboard/view/webspec/conversationDeck/siteExitWarning'));
		
			this.bridge.on('state/showSiteExitMessage', function(){
				$('#site_exit_warning_header').focus();
	            $('body').addClass('site-exit-warning-overflow-hidden');
			}.bind(this));

			this.bridge.on('state/hideSiteExitMessage', function(){
	            $('body').removeClass('site-exit-warning-overflow-hidden');
			}.bind(this));
		};


	};

});
