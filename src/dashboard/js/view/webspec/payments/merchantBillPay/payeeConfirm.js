/*  ======== payeeConfirm ========== */
define({
	'name': 'PAYEE',
	'bindings': {
		'payee_name': {
			type: 'HTML',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'payee_nickname': {
			type: 'HTML',
			field: 'payee_nickname',
			direction: 'BOTH'
		},
		'postal_address': {
			type: 'HTML',
			field: 'postal_address',
			direction: 'BOTH'
		},
		'phone_number': {
			type: 'HTML',
			field: 'phone_number',
			direction: 'BOTH'
		},
		'payee_account_number': {
			type: 'HTML',
			field: 'payee_account_number',
			direction: 'BOTH'
		},
		'payment_processing_delivery_method': {
			type: 'HTML',
			field: 'payment_processing_delivery_method',
			direction: 'BOTH'
		},
		'funding_account_display_name_with_balance': {
			type: 'HTML',
			field: 'funding_account_display_name_with_balance',
			direction: 'BOTH'
		},
		'payee_group': {
			type: 'HTML',
			field: 'payee_group',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'pay_bill_button': {
			type: 'HTML',
			action: 'make_payment',
			'event': 'click'
		},
		'close_button': {
			type: 'BUTTON',
			action: 'initiate_add_payee_via_search'
		}
	}
});
