define({
	name: 'DELETE_FUNDING_ACCOUNT_CONFIRMATION',
	bindings: {

	},

	triggers: {
		delete_funding_account: {
			action: 'delete_funding_account',
			type: 'BUTTON'
		},
		do_not_delete_funding_account: {
			action: 'do_not_delete_funding_account',
			type: 'BUTTON'
		}
	}

});
