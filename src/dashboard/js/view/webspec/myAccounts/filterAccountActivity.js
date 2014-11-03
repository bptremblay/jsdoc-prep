define({
	name: 'FILTER_ACCOUNT_ACTIVITY',
	bindings: {
		'transaction_type': {
			direction: 'UPSTREAM'
		},
		'transaction_from_amount': {
			direction: 'UPSTREAM'
		},
		'transaction_to_amount': {
			direction: 'UPSTREAM'
		},
		'transaction_posted_from_date': {
			direction: 'BOTH'
		},
		'transaction_posted_to_date': {
			direction: 'BOTH'
		},
		'transaction_posted_timeframe': {
			direction: 'UPSTREAM'
		},
		'check_number_from': {
			direction: 'UPSTREAM'
		},
		'check_number_to': {
			direction: 'UPSTREAM'
		}
	},
	'triggers': {
		'apply_filter': {
            action: 'apply_filter',
            preventDefault: true
        },
        'exit_filter': {
            action: 'exit_filter',
            preventDefault: true
        },
        'close_transaction_date_range_advisory': {
        	action: 'close_transaction_date_range_advisory'
        },
        'update_transaction_filter_date_based_on_selected_timeframe': {
        	action: 'update_transaction_filter_date_based_on_selected_timeframe'
        }
	}
});
