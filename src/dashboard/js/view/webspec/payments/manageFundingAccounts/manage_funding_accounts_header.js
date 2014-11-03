define({
	name: 'MANAGE_FUNDING_ACCOUNTS_HEADER',
	bindings: {
		accountDisplayName: {
			field: 'account_display_name',
			direction: 'BOTH',
			type: 'HTML'
		},

		addFundingAccountMessage:{
			type:'HTML',
			field: 'add_funding_account_message',
			direction: 'BOTH'
		}
	},
	triggers: {
		request_accounts: {
			action: 'requestFundingAccounts',
			event: 'change',
			type: 'SELECT'
		},

		exitFundingAccounts:{
    		action: 'exit_manage_funding_accounts',
            type: 'HTML',
            event: 'click'
    	},

	}
});
