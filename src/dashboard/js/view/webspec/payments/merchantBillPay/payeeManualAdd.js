/*  ======== add payee manual ========== */
define({ //TODO: correct the types and directions
	'name': 'ADD_PAYEE_PROFILE',
	'bindings': {
		'payee_name': {
			type: 'TEXT',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'payee_nickname': {
			type: 'TEXT',
			field: 'payee_nickname',
			direction: 'BOTH'
		},

		'mailing_address_line1': {
			type: 'TEXT',
			field: 'mailing_address_line1',
			direction: 'BOTH'
		},

		'mailing_address_line2': {
			type: 'TEXT',
			field: 'mailing_address_line2',
			direction: 'BOTH'
		},

		'city': {
			type: 'TEXT',
			field: 'city',
			direction: 'BOTH'
		},

		'state': {
			type: 'TEXT',
			field: 'state',
			direction: 'BOTH'
		},

		'zip_code': {
			type: 'TEXT',
			field: 'zip_code',
			direction: 'BOTH'
		},

		'zip_code_extension': {
			type: 'TEXT',
			field: 'zip_code_extension',
			direction: 'BOTH'
		},

		'phone_number': {
			type: 'TEXT',
			field: 'phone_number',
			direction: 'BOTH'
		},

		'account_number': {
			type: 'TEXT',
			field: 'account_number',
			direction: 'BOTH'
		},

		'confirmed_account_number': {
			type: 'TEXT',
			field: 'confirmed_account_number',
			direction: 'BOTH'
		},

		'account_number_available': {
			type: 'CHECKBOX',
			field: 'account_number_available',
			direction: 'BOTH'
		},

		'note_for_payee': {
			type: 'TEXT',
			field: 'note_for_payee',
			direction: 'BOTH'
		}


	},
	'triggers': {

		'continue_button': {
			type: 'BUTTON',
			action: 'verify_add_payee'
		},
		'cancel_button': {
			type: 'BUTTON',
			action: 'cancel_add_payee'
		},
		'account_number_available': {
			type: 'CHECKBOX',
			action: 'set_up_repeating_payment',
			event: 'change'
		}
	}
});
