/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SiteMessageComponent
 */

define(function(require) {


	return {
		init: function() {
		},
		/**
		 * @function closeCustomerSiteMessaging emits a 'dismiss' message for the view to handle it
		 *
		 */
		closeCustomerSiteMessaging: function(){
			this.output.emit('state', {
                target: this,
                value: 'dismiss'
            });
		},
		/**
		 * @function expandMessage emits a 'expand' message for the view to handle it
		 */
		expandMessage:function(){
			this.output.emit('state', {
                target: this,
                value: 'expand'
            });
		},
		/**
		 * @function collapseMessage emits a 'collapse' message for the view to handle it
		 */
		collapseMessage: function(){
			this.output.emit('state', {
                target: this,
                value: 'collapse'
            });
		}
	}
});
