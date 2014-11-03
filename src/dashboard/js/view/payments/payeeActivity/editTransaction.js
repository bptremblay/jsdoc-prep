/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module EditPayeeActivityView
 */
define(function(require) {

	return function EditTransactionView() {
		var template = require('blue/template');


		this.bridge = this.createBridge(require('dashboard/view/webspec/payments/payeeActivity/editTransaction'));
		this.template = require('dashboard/template/payments/payeeActivity/showEditTransaction');
		// this.editList = require('dashboard/template/payments/payeeActivity/editTransaction');
		// this.editVerify = require('dashboard/template/payments/payeeActivity/editTransactionVerify')
		// template.registerPartial('editList', require('dashboard/template/payments/payeeActivity/editTransaction'));
		// template.registerPartial('editVerify', require('dashboard/template/payments/payeeActivity/editTransactionVerify'));
		this.partials = {
			'editList' : require('dashboard/template/payments/payeeActivity/editTransaction'),
			'editVerify' : require('dashboard/template/payments/payeeActivity/editTransactionVerify')
		};



		this.init = function() {
		};


		this.transitions = {
		    'slide': require( 'blue/template/transition/slide' ),
		    'fade': require( 'blue/template/transition/fade' )
		};

	};
});
