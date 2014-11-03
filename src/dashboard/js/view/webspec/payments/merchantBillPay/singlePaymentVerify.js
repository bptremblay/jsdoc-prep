define({
	'name': 'MERCHANT_BILL_PAYMENT',
	'bindings': {
		'payee_name': {
			type: 'HTML',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'funding_account_display_name_with_balance': {
			type: 'HTML',
			field: 'funding_account_display_name_with_balance',
			direction: 'BOTH'
		},
		'transaction_amount': {
			type: 'HTML',
			field: 'transaction_amount',
			direction: 'BOTH'
		},
		'transaction_initiation_date': {
			type: 'HTML',
			field: 'transaction_initiation_date',
			direction: 'BOTH'
		},
		'transaction_due_date': {
			type: 'HTML',
			field: 'transaction_due_date',
			direction: 'BOTH'
		},
		'memo': {
			type: 'HTML',
			field: 'memo',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'schedule_payment_button': {
			type: 'BUTTON',
			action: 'confirm_merchant_bill_payment'
		},
		'previous_button': {
			type: 'BUTTON',
			action: 'cancel_merchant_bill_payment'
		},
		'cancel_button': {
			type: 'BUTTON',
			action: 'exit_merchant_bill_payment'
		}
	}
});
