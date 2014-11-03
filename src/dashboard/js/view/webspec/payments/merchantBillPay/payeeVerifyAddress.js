/*  ======== payeeVerifyAddress ========== */
define({
	'name': 'PAYEE',
	'bindings': {
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
		}
	}
});
