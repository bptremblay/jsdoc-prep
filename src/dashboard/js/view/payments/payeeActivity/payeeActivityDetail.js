/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module PayeeActivityView
 */
define(function(require) {


	return function showDetail() {
		var template = require('blue/template'),
			PayeeActivityBridge = require('dashboard/view/bridge/payments/payeeActivityBridge')(this);

		template.registerPartial('field', require('dashboard/template/payments/payBills/common/field'));

		this.bridge = new PayeeActivityBridge.payeeActivityBridge({
			targets: {
				see_details_link: '.see-payee-activity-details-link',
				see_more_button: '#see_more_button'
			}
		});

  		this.template = require('dashboard/template/payments/payeeActivity/payeeActivityDetail');

		this.init = function() {

		};
	};
});
