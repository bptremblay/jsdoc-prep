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
		'funding_account_id': {
			type: 'SELECT',
			field: 'funding_account_id',
			direction: 'BOTH'
		},
		'payee_category_id': {
			type: 'SELECT',
			field: 'payee_category_id',
			direction: 'BOTH'
		}
	},
	'triggers': {
		'add_button': {
			type: 'BUTTON',
			action: 'confirm_add_payee'
		},
        'cancel_button': {
            type: 'BUTTON',
            action: 'cancel_add_payee'
        },
        'back_button': {
            type: 'BUTTON',
            action: 'provide_payee_information'
        }
	}
});
