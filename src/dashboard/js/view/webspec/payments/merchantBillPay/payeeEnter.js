/*  ======== payee ========== */
define({
	'name': 'PAYEE',
	'bindings': {
		'payee_name': {
            type: 'TEXT',
            field: 'payee_name',
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
        'payee_account_number': {
            type: 'TEXT',
            field: 'payee_account_number',
            direction: 'BOTH'
        },
        'payee_confirmed_account_number': {
            type: 'TEXT',
            field: 'payee_confirmed_account_number',
            direction: 'BOTH'
        }
	},
	'triggers': {
		'continue_button': {
            type: 'BUTTON',
            action: 'advance_flow'
        },
        'cancel_button': {
            type: 'BUTTON',
            action: 'exit_flow'
        }
	}
});
