define({
	name: 'ACCOUNT_OVERDRAFT_PROTECTION',
	bindings: {
		'account_display_name': {
			direction: 'DOWNSTREAM'
		},
		'overdraft_protection_limit': {
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {}
});
