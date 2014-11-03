define({
	'name': 'RCA_ACCOUNT_ACTIVITY',
	'bindings': {
		'transactions': {
			direction: 'DOWNSTREAM'
		}
	},
	triggers: {
		'toggle_account_activity_display': {
			action: 'toggle_account_activity_display',
			stopPropagation: true,
			preventDefault: true
		},
		'request_account_activity': {
			action: 'request_account_activity',
			stopPropagation: true,
			preventDefault: true
		}
	}
});
