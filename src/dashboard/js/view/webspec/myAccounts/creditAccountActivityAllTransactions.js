define({
	'name': 'CREDIT_ACCOUNT_ACTIVITY_ALL_TRANSACTIONS',
	'bindings': {
		'transactions': {
            direction: 'DOWNSTREAM'
        }
	},
	'triggers': {
		'show_details': {
			action: 'request_transaction_details',
			stopPropagation: true,
			preventDefault: true
		}
	}
});
