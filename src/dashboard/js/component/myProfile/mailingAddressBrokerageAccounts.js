/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/mailingAddressBrokerageAccounts
 * @requires blue/event/channel/controller
 */
define(['blue/event/channel/controller'], function( controllerChannel ) {

	return {
		/**
		 * @function
		 * Sets context and controllerChannel object.
		 */
		init: function() {
			this.controllerChannel = controllerChannel;
		},
		/**
		 * @function
		 * Edit brokerage mailing address.
		 */
		changeMailingAddress: function(eventData){
			controllerChannel.emit('changeMailingAddress', {accountId:eventData.context.id, mask:eventData.context.mask});
		},

		// TODO: to be removed from spec
		requestBrokerageAccounts: function(){

		},

		/**
		 * @function
		 * Render component and insert it to target.
		 */
		_render: function(options, data){
			var callbackFunction = function(){
				this.controller.executeCAV( [ this, options.view, { target: options.target, react: true } ]);
			}.bind(this);
			
			callbackFunction();
		}
	};
});
