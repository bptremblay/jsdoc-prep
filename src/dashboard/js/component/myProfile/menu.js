/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/menu
 */
define(function(require) {
	return {
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/overview'
		 */		
		selectMyOverview: function(){
			this.context.controller.state('#/dashboard/profile/index/overview');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/phone'
		 */
		selectMyPhoneDetails: function(){
			this.context.controller.state('#/dashboard/profile/index/phone');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/email'
		 */
		selectMyEmailDetails: function(){
			this.context.controller.state('#/dashboard/profile/index/email');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/mailingaddress'
		 */
		selectMyMailingAddressDetails: function(){
			this.context.controller.state('#/dashboard/profile/index/mailingaddress');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/accounts'
		 */
		selectMyAccountSettings: function(){
			this.context.controller.state('#/dashboard/profile/index/accounts');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/paperless'
		 */
		selectMyPaperlessSettings: function(){
			this.context.controller.state('#/dashboard/profile/index/paperless');		
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/travel'
		 */
		selectMyTravelSettings: function(){
			this.context.controller.state('#/dashboard/profile/index/travel');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/alerts'
		 */
		manageMyAlerts: function(){
			this.context.controller.state('#/dashboard/profile/index/alerts');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/deliverymethods'
		 */
		updateMyAlertsDeliverySettings: function(){
			this.context.controller.state('#/dashboard/profile/index/deliverymethods');
		},
		/**
		 * @function
		 * Sets state to '#/dashboard/profile/index/history'
		 */
		requestMyAlertsHistory: function(){
			this.context.controller.state('#/dashboard/profile/index/history');
		}
	};
});

