define({
	name: 'DEPOSIT_ACCOUNTS',
	bindings: {
		'account_name': {
			direction: 'DOWNSTREAM'
		},
		'account_mask_number': {
			direction: 'DOWNSTREAM'
		},
		'account_balance': {
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {
		'request_account_information': {
			action: 'request_account_information'
		}
	}
});
