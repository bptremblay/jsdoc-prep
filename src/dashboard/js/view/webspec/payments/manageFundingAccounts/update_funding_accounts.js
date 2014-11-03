define({
	name: 'UPDATE_FUNDING_ACCOUNTS',
	bindings: {
		fundingAccounts: {
			type: 'HTML',
			direction: 'BOTH',
			field: 'funding_accounts'
		}
	},
	triggers: {
		updatePrimaryDesignation: {
			action: 'update_primary_funding_account_designation',
			event: 'click',
			type: 'HTML'
		},
		updateFundingAccount: {
			action: 'update_funding_account',
			event: 'click',
			type: 'ANCHOR'
		},
		deleteFundingAccount: {
			action: 'delete_funding_account',
			event: 'click',
			type: 'ANCHOR'
		},
		cancelUpdateFundingAccount: {
			action: 'cancel_update_funding_account',
			event: 'click',
			type: 'BUTTON'
		},
		saveUpdateFundingAccount: {
			action: 'save_update_funding_account',
			event: 'click',
			type: 'BUTTON'
		},
		closePrimaryDesignationAdvisory: {
			action: 'exit_primary_help_message',
			event: 'click',
			type: 'HTML'
		},
		requestPrimaryHelpMessage: {
			action: 'request_primary_help_message',
			type: 'HTML'
		}
	}
});
