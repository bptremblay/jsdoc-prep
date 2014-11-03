define(function(require) {
	var modernizr = require('dashboard/vendor/webshim/extras/modernizr-custom');
	var polyfiller = require('dashboard/vendor/webshim/polyfiller');

	webshims.setOptions('forms', {
		lazyCustomMessages: true,
		addValidators: true
	});

	webshims.setOptions('forms-ext', {
		replaceUI: 'auto',
		types: 'date',
		date: {
			startView: 2,
			size: 1,
			classes: 'hide-spinbtns'
		}
	});

	return function fieldView() {

		//render the default view
		this.template = require('dashboard/template/payments/payBills/common/field');
		this.init = function() {};

	};
});