/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayeeActivityView
 */
define(function(require) {

	return function PayeeActivityView() {
		this.bridge = this.createBridge(require('dashboard/view/webspec/payments/payeeActivity/payeeActivity'));
		this.template = require('dashboard/template/payments/payeeActivity/payeeActivity');

		this.init = function() {

		};

		this.transitions = {
		    'slide': require( 'blue/template/transition/slide' ),
		    'fade': require( 'blue/template/transition/fade' )
		};

	};
});
