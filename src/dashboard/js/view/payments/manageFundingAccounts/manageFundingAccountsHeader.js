define(function(require) {

	var bridge = require('blue/bridge').create(require('dashboard/view/webspec/payments/manageFundingAccounts/manage_funding_accounts_header'), {});

	return function view() {

		this.template = require('dashboard/template/payments/manageFundingAccounts/manageFundingAccountsHeader');

		this.bridge = new bridge({
			targets: {
				accountDisplayName: '#funding_accounts_header',
				request_accounts: '#payeeSelectBox',
				exitFundingAccounts: '#close_edit_funding_account',
				addFundingAccountMessage: '#add_funding_account_message'
			}
		});

		this.init = function(){

			var scope = this;

            this.bridge.on('state/showFundingAccountMessage', function(data) {
				scope.showFundingAccountMessage( data );
            });

		};

		this.showFundingAccountMessage = function( data ){

			//delete all previous message
			this.$target.find('#add_funding_account_message').empty();
			this.$target.find('#update_funding_account_message').empty();
			this.$target.find('#delete_funding_account_message').empty();


			var fundingAccountMessage = this.$target.find( '#' + data.elementId ).html( data.message );
			fundingAccountMessage.removeClass('hide');

		};

	};
});
