/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/container
 */
define(function() {
	
	return {
		/**
		 * @function
		 * Sets state to '#/dashboard'
		 */
		exitMyProfile: function(){
			this.context.controller.state('#/dashboard')
		}
	};
});
