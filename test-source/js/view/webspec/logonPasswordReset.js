define({

	name: 'LOGON_PASSWORD_RESET',
	bindings: {
		'password_reset_identify_option_id': {
            type: 'RADIO',
            field: 'password_reset_identify_option_id',
            direction: 'UPSTREAM'
        },
        'social_security_number': {
        	type: 'NUMBER',
        	field: 'social_security_number',
        	direction: 'BOTH'

        },
        'tax_identification_number': {
        	type: 'NUMBER',
        	field: 'tax_identification_number',
        	direction: 'BOTH'

        },
        'date_of_birth': {
        	type: 'NUMBER',
        	field: 'date_of_birth',
        	direction: 'BOTH'

        },
        'email_address': {
        	type: 'EMAIL',
        	field: 'email_address',
        	direction: 'BOTH'

        },
        'security_code': {
        	type: 'TEXT',
        	field: 'security_code',
        	direction: 'BOTH'

        },
        'applicant_id_number': {
        	type: 'NUMBER',
        	field: 'applicant_id_number',
        	direction: 'BOTH'

        },
        'account_number': {
        	type: 'NUMBER',
        	field: 'account_number',
        	direction: 'UPSTREAM'

        },
        'accounttypeoption': {
        	type: 'RADIO',
        	field: 'account_type_id',
        	direction: 'UPSTREAM'
        },
	},
	triggers: {
		'identify_customer_date_of_birth_option': {
			type: 'ANCHOR',
			action: 'identify_customer_date_of_birth_option',
			event: 'click'
		},
		'identify_customer_social_security_number_option': {
			type: 'ANCHOR',
			action: 'identify_customer_social_security_number_option',
			event: 'click'
		},
		'proceed_to_locate_user_id': {
			type: 'BUTTON',
			action: 'proceed_to_locate_user_id'
		},
		'exit_reset_password': {
			type: 'BUTTON',
			action: 'exit_reset_password'
		}
	}
});
