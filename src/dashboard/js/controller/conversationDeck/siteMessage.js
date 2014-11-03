/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SiteMessageController
 * @description Controller for the site message
 **/
define(function(require) {

	return function SiteMessageController() {

		var observable = require('blue/observable'),
			controllerChannel = require('blue/event/channel/controller'),
			SiteMsgSpec = require('bluespec/customer_site_messages'),
			SiteMsgMethods = require('dashboard/component/conversationDeck/siteMessage');

		this.init = function() {
			controllerChannel.on({
                dashboardHeaderLoaded: this.index.bind(this)
            });
		};

		/**
		 * Function for default action
		 * @function index
		 * @memberOf module:SiteMessageController
		 */
		this.index = function() {

			// Set the model data.
			this.model = observable.Model(this.settings.get('convoDeckSiteMessageModel'));

			// Register the site message component.
			this.register.components(this, [{
				name: 'siteMsgComponent',
				model: this.model,
				spec: SiteMsgSpec,
				methods: SiteMsgMethods
			}]);

			//TODO: This is the temporary logic to set site message between 12:00 AM and 2:59 AM (inclusive). We have to remove this logic once we have services in place
			var hour = new Date().getHours();
			if(hour >= 0 && hour <= 2){
				this.executeCAV(
					[this.components.siteMsgComponent, 'conversationDeck/siteMessage', { target: '#site-message-container' }]
				);
			}
		};
	};
});
