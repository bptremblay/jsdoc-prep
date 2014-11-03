define({
	'name': 'PAYMENT_ACTIVITY',
	'bindings': {
		//setting the binding for the automatic payment indicator as per the spec.
		'automatic_payment_enrollment_status': {
			'type': 'HTML',
			'field': 'automatic_payment_enrollment_status',
			'direction': 'BOTH'
		},
		'account_display_name': {
			'type': 'SELECT',
			'field': 'account_display_name',
			'direction': 'DOWNSTREAM'
		}
	},
	'triggers': {
		request_account_activity: {
			type: 'SELECT',
			action: 'request_account_activity',
			event: 'change'
		},
		request_transaction_details: {
			type: 'ANCHOR',
			action: 'request_transaction_details',
			event: 'click'
		},
		toggle_transaction_details: {
			type: 'ANCHOR',
			action: 'toggle_transaction_details',
			event: 'click'
		},
		print_transaction_details: {
			type: 'ANCHOR',
			action: 'print_transaction_details',
			event: 'click'
		},
		cancel_transaction: {
			type: 'ANCHOR',
			action: 'cancel_transaction',
			event: 'click'
		}
	}
});
