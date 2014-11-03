/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module MainBillPayView
 */
define(function(require) {
	var DOM = require('dashboard/vendor/shim/better-dom');

	return function MainBillPayView() {

		var controllerChannel = require('blue/event/channel/controller'),
			template = require('blue/template');

		this.template = require('dashboard/template/payments/shared/mainBillPay');

		this.init = function() {

		};
	};
});
