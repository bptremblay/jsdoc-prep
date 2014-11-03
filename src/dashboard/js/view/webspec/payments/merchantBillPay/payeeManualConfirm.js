/*  ======== payeeManualVerify ========== */
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
		'mailing_address_line1': {
			type: 'HTML',
			field: 'mailing_address_line1',
			direction: 'BOTH'
		},
		'mailing_address_line2': {
			type: 'HTML',
			field: 'mailing_address_line2',
			direction: 'BOTH'
		},
		'phone_number': {
			type: 'HTML',
			field: 'phone_number',
			direction: 'BOTH'
		},
		'account_number': {
			type: 'HTML',
			field: 'account_number',
			direction: 'BOTH'
		},
		'note_for_payee': {
			type: 'HTML',
			field: 'note_for_payee',
			direction: 'BOTH'
		},
		'transaction_processing_lead_time': {
			type: 'HTML',
			field: 'transaction_processing_lead_time',
			direction: 'BOTH'
		},
		'funding_account_display_name_with_balance': {
			type: 'HTML',
			field: 'funding_account_display_name_with_balance',
			direction: 'BOTH'
		},
		'payee_category_id': {
			type: 'HTML',
			field: 'payee_category_id',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'pay_button': {
			type: 'BUTTON',
			action: 'make_payment'
		},
        'add_button': {
            type: 'BUTTON',
            action: 'add_payee'
        },
        'setup_button': {
            type: 'BUTTON',
            action: 'set_up_repeating_payment'
        }
	}
});
