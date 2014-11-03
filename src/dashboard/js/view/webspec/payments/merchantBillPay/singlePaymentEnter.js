define({
	'name': 'MERCHANT_BILL_PAYMENT',
	'bindings': {
		'payee_name': {
			type: 'SELECT',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'funding_account_display_name_with_balance': {
			type: 'SELECT',
			field: 'funding_account_display_name_with_balance',
			direction: 'BOTH'
		},
		'transaction_amount': {
			type: 'TEXT',
			field: 'transaction_amount',
			direction: 'BOTH'
		},
		'transaction_initiation_date': {
			type: 'DATE',
			field: 'transaction_initiation_date',
			direction: 'BOTH'
		},
		'transaction_due_date': {
			type: 'DATE',
			field: 'transaction_due_date',
			direction: 'BOTH'
		},
		'memo': {
			type: 'TEXT',
			field: 'memo',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'next_button': {
			type: 'BUTTON',
			action: 'verify_merchant_bill_payment'
		},
		'cancel_button': {
			type: 'BUTTON',
			action: 'exit_merchant_bill_payment'
		},
		'payee_name': {
			type: 'SELECT',
			action: 'initiate_merchant_bill_payment',
			event: 'change'
		}
	}
});
