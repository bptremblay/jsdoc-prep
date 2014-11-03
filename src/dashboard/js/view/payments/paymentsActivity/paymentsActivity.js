/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module ContactFormView
 */
define(function(require) {


	var controllerChannel = require('blue/event/channel/controller'),

	//defining the bridge to be used including the required dashboard paths for payment activity
	PaymentsActivityBridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/paymentsActivity/paymentsActivity'), {});
	template = require('blue/template');

	template.registerPartial('field', require('dashboard/template/payments/quickPay/common/field'));
	template.registerPartial('menu', require('dashboard/template/payments/quickPay/common/menu'));
	template.registerPartial('submenu', require('dashboard/template/payments/quickPay/common/submenu'));
	template.registerPartial('button', require('dashboard/template/payments/quickPay/common/button'));


	//creating a function to define the bridge
	return function PaymentsActivityView() {
		var self = this;

		self.bridge = new PaymentsActivityBridge({
			targets: {

				request_account_activity: '#account_display_name',
				toggle_transaction_details: '.toggl-display-detail-link',
				automatic_payment_enrollment_status: '#automatic_payment_enrollment_status',
				account_display_name: '#account_display_name', // to be updated
				request_transaction_details: '#selector', // to be updated
				print_transaction_details: '#selector', // to be updated
				cancel_transaction: '.cancel-link'

				//setting the actual target to the handlebar ID for the automatic payment indicator
				//automatic_payment_enrollment_status: '#automatic_payment_enrollment_status'
			}
		});

		//calling the required template from the handlebars.
		this.template = require('dashboard/template/payments/paymentsActivity/paymentsActivity');

		this.init = function() {

			this.eventManager = {
				click: {
					'.show-link': function($target) {
						$($target[0]).parent().parent().next().toggle();
						$($target[0]).parent().parent().addClass('noBorder');
						$($target[0]).parent().parent().removeClass('border');
						$($target[0]).parent().parent().next().addClass('border');
						$($target[0]).parent().parent().next().removeClass('noBorder');
						$($target[0]).removeClass('show-link');
						$($target[0]).addClass('hide-link');

						$($target[0]).text(this.model.lens('hide_transaction_details_label').get());
					},
					'.hide-link': function($target) {
						$($target[0]).parent().parent().next().toggle();

						$($target[0]).parent().parent().addClass('border');
						$($target[0]).parent().parent().removeClass('noBorder');
						$($target[0]).parent().parent().next().addClass('noBorder');
						$($target[0]).parent().parent().next().removeClass('border');

						$($target[0]).removeClass('hide-link');
						$($target[0]).addClass('show-link');

						$($target[0]).text(this.model.lens('request_transaction_details_label').get());
					},
					'#payments-activity-toggle': function($target) {
						$('#payments-activity-container').toggle();
						toggleIcon = $target.find('i');
						if ($('#payments-activity-container').is(":visible")) {
							toggleIcon.removeClass('fa-angle-up').addClass('fa-angle-down');
						} else {
							toggleIcon.removeClass('fa-angle-down').addClass('fa-angle-up');
						}

					}

				}
			}
		};
		// Set up essential view settings

		this.onDataChange = function onDataChange() {
			this.rerender();
		};
}


});
