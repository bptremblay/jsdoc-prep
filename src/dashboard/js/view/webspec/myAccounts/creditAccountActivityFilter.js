define({
    'name': 'CREDIT_ACCOUNT_ACTIVITY_FILTER',
    'bindings': {
    	'transaction_type': {
			direction: 'UPSTREAM'
		},
		'transaction_posted_timeframe': {
			direction: 'UPSTREAM'
		},
		'transaction_posted_from_date': {
			direction: 'BOTH'
		},
		'transaction_posted_to_date': {
			direction: 'BOTH'
		},
		'transaction_from_amount': {
			direction: 'UPSTREAM'
		},
		'transaction_to_amount': {
			direction: 'UPSTREAM'
		},
		'merchant_name': {
			direction: 'UPSTREAM'
		},
		'account_statement_generation_date': {
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
        'update_transaction_filter_date_based_on_selected_timeframe': {
        	action: 'update_transaction_filter_date_based_on_selected_timeframe'
        }
    }
});
