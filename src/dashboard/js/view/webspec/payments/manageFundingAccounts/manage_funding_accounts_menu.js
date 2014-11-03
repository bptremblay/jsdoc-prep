define({
	name: 'MANAGE_FUNDING_ACCOUNTS_MENU',
	bindings: {
	},


	triggers: {
		addPaymentAccount: {
			action: 'add_funding_account',
			event: 'click',
			type: 'HTML'
		},

		editPaymentAccount: {
			action: 'update_funding_accounts',
			event: 'click',
			type: 'HTML'
		}
	}
});
