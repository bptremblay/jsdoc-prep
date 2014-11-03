define({
	name: 'DDA_ACCOUNT_ACTIVITY_ALL_TRANSACTIONS_HEADER',
	bindings: {},
	triggers: {
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
			preventDefault: true
		}
	}
});
