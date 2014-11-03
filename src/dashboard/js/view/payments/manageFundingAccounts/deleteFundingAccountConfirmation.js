define(function(require) {

	var bridge = require('blue/bridge').create(
					require('dashboard/view/webspec/payments/manageFundingAccounts/deleteFundingAccountConfirmation'),{});

	var componentChannel = require('blue/event/channel/component');

	return function deleteFundingAccountConfirmationView() {
		var self = this;
		this.template = require('dashboard/template/payments/manageFundingAccounts/deleteFundingAccountConfirmation');

		this.bridge = new bridge({
			targets: {
				do_not_delete_funding_account: '#do_not_delete_funding_account',
				delete_funding_account: '#delete_funding_account'
			}
		});


		this.init = function(){
            self.bridge.on('state/showDeleteFundingAccountConfirmation', function(data) {
				$('#delete_funding_account_confirmation_modal').removeClass('hide-xs');
            });

            self.bridge.on('state/hideDeleteFundingAccountConfirmation', function(data) {
				$('#delete_funding_account_confirmation_modal').addClass('hide-xs');
            });
		};

	};
});
