/*  ======== add payee manual ========== */
define({ //TODO: correct the types and directions
	'name': 'ADD_PAYEE_PROFILE',
	'bindings': {
		'payeeName': {
			type: 'TEXT',
			field: 'payee_name',
			direction: 'BOTH'
		},
		'payeeNickname': {
			type: 'TEXT',
			field: 'payee_nickname',
			direction: 'BOTH'
		},

		'mailingAddressLine1': {
			type: 'TEXT',
			field: 'mailing_address_line1',
			direction: 'BOTH'
		},

		'mailingAddressLine2': {
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

		'zipCode': {
			type: 'TEXT',
			field: 'zip_code',
			direction: 'BOTH'
		},

		'zipCodeExtension': {
			type: 'TEXT',
			field: 'zip_code_extension',
			direction: 'BOTH'
		},

		'phoneNumber': {
			type: 'TEXT',
			field: 'phone_number',
			direction: 'BOTH'
		},

		'accountNumber': {
			type: 'TEXT',
			field: 'account_number',
			direction: 'BOTH'
		},

		'confirmedAccountNumber': {
			type: 'TEXT',
			field: 'confirmed_account_number',
			direction: 'BOTH'
		},

		'accountNumberAvailable': {
			type: 'CHECKBOX',
			field: 'account_number_available',
			direction: 'BOTH'
		},

		'noteForPayee': {
			type: 'TEXT',
			field: 'note_for_payee',
			direction: 'BOTH'
		}


	},
	'triggers': {

		'verifyAddPayee': {
			type: 'BUTTON',
			action: 'verify_add_payee'
		},
		'cancelAddPayee': {
			type: 'BUTTON',
			action: 'cancel_add_payee'
		}
	}
});
