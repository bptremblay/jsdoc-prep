define({
	'name': 'CREDIT_ACCOUNT_ACTIVITY_ALL_TRANSACTIONS_HEADER',
	'bindings': {
		'statememt_activity': {
			direction: 'DOWNSTREAM'
		}
	},
	'triggers': {
		'filter_by': {
			action: 'filter_by',
			stopPropagation: true,
			preventDefault: true
		},
		'clear_filter': {
			action: 'clear_filter',
			stopPropagation: true,
			preventDefault: true
		},
		'edit_filter_by': {
			action: 'edit_filter_by',
			stopPropagation: true,
			preventDefault: true
		}
	}
});
